# 分布式处理MQ消息

## 功能概述

讲一下我们是如何处理系统收到的 100 条需求消息的。

1. **消息接收**
   - 系统使用 RabbitMQ 接收来自上游的需求消息，这 100 条消息会进入 **正常队列 `demandQueue`**。
   - 每条消息由消费者异步消费，使用 **线程池并行处理**，提高吞吐量。
2. **幂等与分布式锁处理**
   - 消费者在处理每条需求消息前，会先尝试通过 **Redisson 的分布式锁**获取锁。
   - 如果锁获取成功，就检查数据库中是否已存在该需求（幂等校验），确保同一条需求不会被重复入库或处理。
   - 处理完成后释放锁，并将处理状态标记到 Redis，防止重复处理。
3. **异常与重试机制**
   - 如果处理过程中出现异常，不会直接丢失消息。
   - 消息会被投递到 **延迟队列 `demandRetryQueue`**，延迟 5 秒后自动返回到正常队列进行重试。
   - 消息重试次数有上限（如 3 次），超过上限的消息会被自动投递到 **死信队列 `dlxQueue`**，供人工或后台处理，保证消息不丢失。
4. **高并发处理保障**
   - 100 条需求消息可以并行处理，线程池和 RabbitMQ 的并发能力确保不会阻塞。
   - Redis 缓存和分布式锁保证了 **跨实例或跨节点的幂等和一致性**。

------

**总结**

整体流程是：

```
消息到达 → 正常队列 → 分布式锁+幂等校验 → 数据入库 → 异常进入延迟队列重试 → 超过次数进入死信队列
```

这样即使 100 条需求同时到达，我们也能高效、安全、可靠地处理，并保证数据不丢失、不重复。

## 一、 RabbitMQ配置

```java
@Configuration
public class RabbitConfig {
    
    // 正常队列和交换机
    public static final String DEMAND_QUEUE = "demand_queue";
    public static final String DEMAND_EXCHANGE = "demand_exchange";
    public static final String DEMAND_ROUTING_KEY = "demand_key";

    // 死信队列和交换机
    public static final String DLX_QUEUE = "demand_dlx_queue";
    public static final String DLX_EXCHANGE = "demand_dlx_exchange";
    public static final String DLX_ROUTING_KEY = "demand_dlx_key";

    // 延迟重试队列（路由键）
    public static final String DEMAND_RETRY_QUEUE = "demand_retry_queue";
    public static final String DEMAND_RETRY_ROUTING_KEY = "demand_retry_key";
    
    @Bean
    public Queue demandQueue() {
        return QueueBuilder.durable(DEMAND_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)      // 达到最大重试次数进入DLQ
                .withArgument("x-dead-letter-routing-key", DLX_ROUTING_KEY)
                .build();
    }

    // 延迟队列，用于控制消息重试次数
    @Bean
    public Queue demandRetryQueue() {
        return QueueBuilder.durable(DEMAND_RETRY_QUEUE)
                .withArgument("x-dead-letter-exchange", DEMAND_EXCHANGE) // 延迟结束后投回正常队列
                .withArgument("x-dead-letter-routing-key", DEMAND_ROUTING_KEY)
                .withArgument("x-message-ttl", 5000) // 延迟5秒重试
                .build();
    }

    @Bean
    public DirectExchange demandExchange() {
        return new DirectExchange(DEMAND_EXCHANGE);
    }

    @Bean
    public Binding demandBinding() {
        return BindingBuilder.bind(demandQueue())
                .to(demandExchange())
                .with(DEMAND_ROUTING_KEY);
    }

    @Bean
    public Binding demandRetryBinding() {
        return BindingBuilder.bind(demandRetryQueue())
                .to(demandExchange())
                .with("demand_retry_key");
    }

    // 死信队列保持不变
    @Bean
    public Queue dlxQueue() {
        return QueueBuilder.durable(DLX_QUEUE).build();
    }

    @Bean
    public DirectExchange dlxExchange() {
        return new DirectExchange(DLX_EXCHANGE);
    }

    @Bean
    public Binding dlxBinding() {
        return BindingBuilder.bind(dlxQueue())
                .to(dlxExchange())
                .with(DLX_ROUTING_KEY);
    }
}

```
## 二、消费者配置

```java
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class DemandConsumerService {

    @Autowired
    private RedissonClient redissonClient;

    @Autowired
    private DemandRepository demandRepository; // 假设这是你的数据库操作类

    // 创建线程池处理消息
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    
    // 处理从下级接收到的需求信息，进行入库等逻辑处理
    @RabbitListener(queues = RabbitConfig.DEMAND_QUEUE)
    public void receive(Demand demand, Channel channel, Message message) throws Exception {
        String retryHeader = "x-retry-count";
        Integer retryCount = (Integer) message.getMessageProperties().getHeaders().get(retryHeader);
        if (retryCount == null) retryCount = 0;

        try {
            processDemand(demand); // 业务处理
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false); // 成功 ACK
        } catch (Exception e) {
            e.printStackTrace();
            if (retryCount >= 3) {
                // 达到最大重试次数，进入死信队列
                channel.basicReject(message.getMessageProperties().getDeliveryTag(), false);
            } else {
                // 增加重试次数，并放入延迟队列
                message.getMessageProperties().getHeaders().put(retryHeader, retryCount + 1);
                channel.basicPublish("", "demand_retry_queue", message.getMessageProperties(), message.getBody());
                channel.basicAck(message.getMessageProperties().getDeliveryTag(), false); // ACK原消息
            }
        }
    }


    private void processDemand(Demand demand) {
        String lockKey = "demand:lock:" + demand.getId();
        RLock lock = redissonClient.getLock(lockKey);

        try {
            // 尝试获取锁，最多等待0秒，锁自动释放时间5秒
            boolean isLocked = lock.tryLock(0, 5, TimeUnit.SECONDS);
            if (!isLocked) {
                // 说明其他实例/线程在处理，跳过或延迟重试
                return;
            }

            // 幂等处理：检查数据库是否已处理过
            if (demandRepository.existsById(demand.getId())) {
                return; // 已处理过，直接返回
            }

            // 处理业务逻辑：入库、状态同步等
            demandRepository.save(demand);
            // 其他处理逻辑，如状态同步、报表更新等...

        } catch (Exception e) {
            e.printStackTrace(); // 实际项目中用日志记录
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
```

