# Java 操作 Redis 常用 API 总结（基于 Spring Data Redis）

## 前言

在实际项目中，Redis 通常作为 **缓存层** 或 **高性能数据存储** 使用。Java 操作 Redis 的常见方式有：

- **Spring Data Redis**（最常用，封装了 RedisTemplate 和 StringRedisTemplate）
- **Redisson**（更高级，支持分布式锁、延迟队列等）

本文主要总结 **Spring Data Redis** 的常用 API。

------

## 一、RedisTemplate 基础使用

### 1. 依赖配置

在 `pom.xml` 中引入：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 2. 配置 RedisTemplate

```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        // key 序列化
        template.setKeySerializer(new StringRedisSerializer());
        // value 序列化（可用 JSON 序列化）
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
```

### 3. 注入使用

```java
@Autowired
private RedisTemplate<String, Object> redisTemplate;

@Autowired
private StringRedisTemplate stringRedisTemplate; // 专门操作 String
```

------

## 二、常用数据类型操作

### 1. 字符串（String）

```java
// 存值
stringRedisTemplate.opsForValue().set("name", "Tom");

// 取值
String name = stringRedisTemplate.opsForValue().get("name");

// 设置过期时间
stringRedisTemplate.opsForValue().set("token", "abc123", 60, TimeUnit.SECONDS);

// 自增、自减
stringRedisTemplate.opsForValue().increment("count", 1);  // +1
stringRedisTemplate.opsForValue().decrement("count");     // -1
```

------

### 2. 哈希（Hash）

```java
// 存储哈希
redisTemplate.opsForHash().put("user:1", "name", "Tom");
redisTemplate.opsForHash().put("user:1", "age", 20);

// 获取字段
Object name = redisTemplate.opsForHash().get("user:1", "name");

// 获取所有字段
Map<Object, Object> user = redisTemplate.opsForHash().entries("user:1");

// 删除字段
redisTemplate.opsForHash().delete("user:1", "age");
```

------

### 3. 列表（List）

```java
// 左插入
redisTemplate.opsForList().leftPush("queue", "task1");
redisTemplate.opsForList().leftPushAll("queue", "task2", "task3");

// 右插入
redisTemplate.opsForList().rightPush("queue", "task4");

// 范围获取
List<Object> tasks = redisTemplate.opsForList().range("queue", 0, -1);

// 弹出
Object task = redisTemplate.opsForList().leftPop("queue");
```

------

### 4. 集合（Set）

```java
// 添加元素
redisTemplate.opsForSet().add("tags", "java", "spring", "redis");

// 获取所有成员
Set<Object> tags = redisTemplate.opsForSet().members("tags");

// 判断是否存在
boolean exists = redisTemplate.opsForSet().isMember("tags", "java");

// 删除元素
redisTemplate.opsForSet().remove("tags", "spring");

// 求交集
Set<Object> common = redisTemplate.opsForSet().intersect("tags1", "tags2");
```

------

### 5. 有序集合（ZSet）

```java
// 添加元素
redisTemplate.opsForZSet().add("ranking", "Tom", 100);
redisTemplate.opsForZSet().add("ranking", "Jack", 200);

// 获取排名（升序）
Set<Object> range = redisTemplate.opsForZSet().range("ranking", 0, -1);

// 获取排名（降序 + 分数）
Set<ZSetOperations.TypedTuple<Object>> revRange = 
        redisTemplate.opsForZSet().reverseRangeWithScores("ranking", 0, -1);

// 增加分数
redisTemplate.opsForZSet().incrementScore("ranking", "Tom", 10);
```

------

## 三、Key 操作

```java
// 设置过期时间
redisTemplate.expire("name", 60, TimeUnit.SECONDS);

// 判断 key 是否存在
boolean hasKey = redisTemplate.hasKey("name");

// 删除 key
redisTemplate.delete("name");

// 获取剩余 TTL
Long ttl = redisTemplate.getExpire("token");
```

------

## 四、发布订阅（Pub/Sub）

### 1. 发布消息

```java
stringRedisTemplate.convertAndSend("news", "hello redis pubsub!");
```

### 2. 订阅消息

配置一个监听器：

```java
@Configuration
public class RedisMessageSubscriber {

    @Bean
    public RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
                                                   MessageListenerAdapter listenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        // 监听 "news" 频道
        container.addMessageListener(listenerAdapter, new PatternTopic("news"));
        return container;
    }

    @Bean
    public MessageListenerAdapter listenerAdapter(Receiver receiver) {
        return new MessageListenerAdapter(receiver, "receiveMessage");
    }
}

@Component
public class Receiver {
    public void receiveMessage(String message) {
        System.out.println("Received <" + message + ">");
    }
}
```

------

## 五、分布式锁（简单实现）

```java
// 加锁
RLock lock = redissonClient.getLock("lockKey");
try {
    lock.lock(); // 加锁（阻塞）
    // 业务逻辑
} finally {
    lock.unlock();
}
```