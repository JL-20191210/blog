# ☕ Java 面试答题卡：ConcurrentHashMap详解

## ✅ 1. 什么是 ConcurrentHashMap？

> ConcurrentHashMap 是 Java 中一个**线程安全的哈希表实现**，支持并发读写操作，性能远优于 Hashtable 和 Collections.synchronizedMap()。

它是并发编程中非常重要的基础组件。

## **✅ 2. 所在包与版本**

- 所在包：java.util.concurrent
- 出现版本：Java 1.5，引入了分段锁实现
- Java 8 重写为基于**CAS + synchronized + 红黑树**的结构

## **✅ 3. 与其他 Map 对比**

| **特性**       | HashMap          | Hashtable       | ConcurrentHashMap |
| -------------- | ---------------- | --------------- | ----------------- |
| 线程安全       | ❌                | ✅（全部同步）   | ✅（高并发设计）   |
| 锁粒度         | 无锁             | 整体锁          | 分段/节点锁       |
| 读写效率       | 高（单线程）     | 低（全锁）      | 高（多线程）      |
| 支持 null 键值 | ✅（允许一个）    | ❌               | ❌                 |
| 适合场景       | 单线程或读多写少 | 非推荐（老API） | 多线程高并发读写  |

## **✅ 4. Java 7 vs Java 8 实现对比**

| **版本** | **底层结构**            | **锁策略**                         |
| -------- | ----------------------- | ---------------------------------- |
| Java 7   | Segment[] + HashEntry[] | 分段锁（Segment继承ReentrantLock） |
| Java 8   | Node[] + 链表/红黑树    | CAS + synchronized                 |

> Java 8 移除了 Segment，提高空间效率；写时采用 CAS + synchronized，提高并发度。

## **✅ 5. Java 8 结构详解**

### **🌳 基本结构：**

```
transient volatile Node<K,V>[] table;  // 主存储数组（Node 链表或红黑树）
```

- Node：链表节点结构（key、value、hash、next）
- table：核心存储数组，默认初始化大小 16

### **🌳 高并发写的核心手段：**

| **技术**     | **作用**                          |
| ------------ | --------------------------------- |
| CAS          | 控制桶位插入、初始化、扩容标志等  |
| synchronized | 控制链表/红黑树写入过程           |
| volatile     | 保证 table 和 size 等字段的可见性 |
| 分段扩容机制 | 分布式地进行 rehash，避免全表阻塞 |

## **✅ 6. 插入流程简图（Java 8）**

```
put(key, val)
  └── 1. 计算 hash
      ├── 2. 如果 table 未初始化，CAS 初始化
      ├── 3. 定位桶位 i = (n - 1) & hash
      ├── 4. 如果桶为空，CAS 插入新节点
      ├── 5. 如果非空：
      │     ├── 5.1 是链表：synchronized 上锁 + 遍历插入
      │     └── 5.2 是红黑树：红黑树插入逻辑
      └── 6. 判断是否需要 treeify 或 resize
```

## **✅ 7. 常用 API 示例**

```
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

map.put("A", 1);
map.putIfAbsent("B", 2);
map.compute("A", (k, v) -> v == null ? 0 : v + 1);
map.forEach(1, (k, v) -> System.out.println(k + ":" + v));
```

## **✅ 8. 常见面试问题解析**

### **Q1：为什么** ConcurrentHashMap不支持 null？

- 为避免**put(null, value)** 与 **map.get(key) == null** 产生歧义（究竟是键不存在，还是值为 null）

### **Q2：为什么读操作不加锁？**

- 因为数据结构使用了 volatile + 单向链表结构，读操作只需保证**可见性即可**，无需互斥。
- Java 8 中通过**volatile 保证数组可见性**，Node 元素不可变。

### **Q3：扩容如何避免阻塞？**

- Java 8 使用 transferIndex + 多线程协作迁移，每个线程负责一段桶位数据迁移，避免一次性全表锁死。

## **✅ 9. 使用场景**

- 并发环境下的缓存结构（如 LRU 缓存）
- 线程安全的 HashMap 替代品
- 计数器、并发 ID 映射表
- Spring 的 Bean 定义映射结构（内部使用）

## **✅ 10. 注意事项**

| **注意点**                       | **建议/说明**                                        |
| -------------------------------- | ---------------------------------------------------- |
| null 键值不支持                  | 使用 Optional 或默认值规避                           |
| 遍历是弱一致性（弱一致性迭代器） | 可用于读多写少的遍历场景                             |
| 写操作仍然有锁竞争               | 高并发写入可能不如预期快                             |
| 不适合严格一致性需求场景         | 如需要强一致性，应考虑加锁或用 ConcurrentSkipListMap |

## **🎯 面试简答模板（建议背诵）**

> ConcurrentHashMap 是 Java 中线程安全的哈希表实现，支持高并发读写操作。Java 7 使用 Segment 分段锁，而 Java 8 重构为基于 CAS + synchronized 的节点级并发机制，底层结构为数组 + 链表 + 红黑树组合。它不支持 null 键值，并发读操作不加锁，适合高性能并发环境下的数据存取，如缓存、线程安全 Map 等场景。