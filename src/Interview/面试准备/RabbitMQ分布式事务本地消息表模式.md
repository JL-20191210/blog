# 分布式事务--本地消息表模式

------

## 一、问题背景

典型场景：

- 业务方法：
  1. 更新订单表
  2. 更新需求管理服务的数据
  3. 发送 MQ 消息同步需求状态
- 问题：
  - 如果数据库事务回滚，但消息已经发送给 MQ，消费者可能已经消费了消息，业务状态却没有更新，导致不一致。
- 目标：
  - 保证数据库事务与消息发送的 **最终一致性**
  - 避免消息被过早发送
  - 支持失败重试

------

## 二、解决方案

**本地事务 + 消息表 + 定时任务（可靠消息表模式）**

1. **在数据库中创建消息表**（Message Table）
   - 每条业务数据更新时，同时在消息表插入一条待发送消息记录
   - 与业务更新在同一个本地事务里
2. **事务提交成功后再发送 MQ**
   - 使用定时任务轮询消息表，发送未发送成功的消息
   - 发送成功后更新消息状态（已发送）
   - 发送失败时重试，保证最终一致性

**特点**：

- 数据库事务和消息发送解耦
- 即便业务回滚，消息不会提前发出
- 可结合 MQ 的延迟重试 + 死信队列处理发送失败的消息

**缺点**：

- 需要维护额外的消息表和定时任务
- 消息不是立即发送，存在一定延迟

------

## 三、数据库设计

```sql
-- 业务表
CREATE TABLE `order` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `amount` DECIMAL(10,2),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 消息表
CREATE TABLE `message` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `business_id` BIGINT NOT NULL,
    `exchange` VARCHAR(100) NOT NULL,
    `routing_key` VARCHAR(100) NOT NULL,
    `payload` TEXT NOT NULL,
    `status` VARCHAR(20) DEFAULT 'PENDING', -- PENDING / SENT / FAILED
    `retry_count` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

------

## 四、SSM 实体类

```java
public class Order {
    private Long id;
    private Long userId;
    private String status;
    private BigDecimal amount;
    private Date createdAt;
}

public class Message {
    private Long id;
    private Long businessId;
    private String exchange;
    private String routingKey;
    private String payload;
    private String status; // PENDING / SENT / FAILED
    private Integer retryCount;
    private Date createdAt;
    private Date updatedAt;
}
```

------

## 五、MyBatis Mapper

```java
public interface OrderMapper {
    void insertOrder(Order order);
    Order selectById(Long id);
}

public interface MessageMapper {
    void insertMessage(Message message);
    void updateMessageStatus(Message message);
    List<Message> selectPendingMessages();
}
```

Mapper XML 示例：

```xml
<insert id="insertOrder" parameterType="Order">
    INSERT INTO `order` (user_id, status, amount, created_at)
    VALUES (#{userId}, #{status}, #{amount}, NOW())
</insert>

<insert id="insertMessage" parameterType="Message">
    INSERT INTO message (business_id, exchange, routing_key, payload, status, retry_count, created_at)
    VALUES (#{businessId}, #{exchange}, #{routingKey}, #{payload}, #{status}, #{retryCount}, NOW())
</insert>

<update id="updateMessageStatus" parameterType="Message">
    UPDATE message
    SET status=#{status}, retry_count=#{retryCount}, updated_at=NOW()
    WHERE id=#{id}
</update>

<select id="selectPendingMessages" resultType="Message">
    SELECT * FROM message WHERE status='PENDING' ORDER BY created_at ASC LIMIT 100
</select>
```

------

## 六、业务服务（本地事务 + 消息表写入）

```java
@Service
public class OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private MessageMapper messageMapper;

    @Transactional
    public void createOrder(Order order) throws JsonProcessingException {
        // 保存业务数据
        orderMapper.insertOrder(order);

        // 保存消息表记录（本地事务内）
        Message msg = new Message();
        msg.setBusinessId(order.getId());
        msg.setExchange("order_exchange");
        msg.setRoutingKey("order.created");
        msg.setPayload(new ObjectMapper().writeValueAsString(order));
        msg.setStatus("PENDING");
        msg.setRetryCount(0);

        messageMapper.insertMessage(msg);
    }
}
```

> 核心：**消息表写入与业务表写入在同一个事务中**。事务回滚时消息不会发送。

------

## 七、MQ 配置（RabbitMQ）

```java
@Configuration
public class RabbitConfig {

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange("order_exchange");
    }

    @Bean
    public Queue orderQueue() {
        return QueueBuilder.durable("order_queue").build();
    }

    @Bean
    public Binding binding(Queue orderQueue, DirectExchange orderExchange) {
        return BindingBuilder.bind(orderQueue).to(orderExchange).with("order.created");
    }
}
```

------

## 八、定时任务异步发送 MQ

```java
@Service
public class MessageSender {

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final int MAX_RETRY = 5;

    @Scheduled(fixedDelay = 5000)
    public void sendPendingMessages() {
        List<Message> pendingMessages = messageMapper.selectPendingMessages();
        for (Message msg : pendingMessages) {
            try {
                rabbitTemplate.convertAndSend(msg.getExchange(), msg.getRoutingKey(), msg.getPayload());
                msg.setStatus("SENT");
                messageMapper.updateMessageStatus(msg);
                System.out.println("消息发送成功: " + msg.getId());
            } catch (Exception e) {
                int retry = msg.getRetryCount() + 1;
                msg.setRetryCount(retry);
                if (retry >= MAX_RETRY) msg.setStatus("FAILED");
                messageMapper.updateMessageStatus(msg);
                System.err.println("消息发送失败: " + msg.getId() + ", retry=" + retry);
            }
        }
    }
}
```

------

## 九、总结

1. **业务方法和消息表写入在同一个本地事务内** → 避免事务回滚导致消息提前发送
2. **定时任务异步发送 MQ** → 解耦数据库事务和消息发送
3. **消息发送失败重试** → 支持最终一致性
4. 可结合 **延迟队列 + 死信队列** 实现可靠重试

**优点**：

- 保证业务和消息最终一致
- 兼容分布式事务场景（Seata + 本地事务）
- 实现简单，可落地 SSM 项目

**缺点**：

- 消息发送存在延迟
- 需要维护额外的消息表和定时任务