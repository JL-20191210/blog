# ☕ Java 面试答题卡：ConcurrentHashMap 的 put 操作中 CAS 和 synchronized 的使用

------

## ✅ 1. 总体结构回顾（JDK 1.8）

> JDK 1.8 的 `ConcurrentHashMap` 不再使用分段锁（Segment），而是使用：

- **数组 + 链表 + 红黑树结构**
- **节点槽位粒度的同步控制**
- 高效使用 `CAS + synchronized` 控制并发写入

------

## ✅ 2. put() 流程图简化版

```
put(key, val)
   ↓
定位桶 (index)
   ↓
[为空？] --- 是 --> 用 CAS 插入（无需锁）
   ↓ 否
桶不为空（链表/红黑树）
   ↓
加 synchronized 锁（锁的是桶的首节点）
   ↓
插入 / 替换 / 树化等操作
```

------

## ✅ 3. 核心源码片段分析

以 JDK 1.8 的 `putVal()` 为例：

```java
final V putVal(K key, V value, boolean onlyIfAbsent) {
    ...
    int hash = spread(key.hashCode());
    int i = (n - 1) & hash;
    Node<K,V> f = tabAt(table, i);

    // ✅ 第一步：桶为空，尝试用 CAS 插入新节点
    if (f == null) {
        if (casTabAt(table, i, null, new Node<>(hash, key, value, null))) {
            break; // 插入成功，退出
        }
    } else {
        // ❌ CAS 失败 or 桶已非空，使用 synchronized 加锁处理冲突
        synchronized (f) {
            if (tabAt(table, i) == f) {
                ...
                // 链表添加 or 红黑树处理
            }
        }
    }
}
```

------

## ✅ 4. 解释：CAS + synchronized 的协作机制

| 阶段              | 机制                     | 特点                                           |
| ----------------- | ------------------------ | ---------------------------------------------- |
| 桶为空            | 使用 `CAS`（无锁插入）   | 高性能，减少锁竞争（适用于大多数并发插入场景） |
| CAS 失败 / 桶非空 | 使用 `synchronized` 加锁 | 竞争较大时保证线程安全，锁的是**桶中首节点**   |

------

## ✅ 5. CAS 是什么？为什么优先用它？

- **CAS（Compare-And-Swap）**：一种硬件原子指令，尝试把某个值从 A 改成 B，如果失败则返回 false
- 在 `put()` 中：用 `casTabAt()` 方法尝试将 table[i] 从 `null` 改为新节点
- 无锁高效 → 适合多线程首次向不同桶写入的情况

------

## ✅ 6. synchronized 是如何用的？

- 如果该桶已经有节点（即发生 hash 冲突），则进入 `synchronized` 块
- 只对桶的**头节点加锁**，不是锁整个 map
- 保证该桶在链表插入或红黑树操作时线程安全

------

## ✅ 7. 为什么这么设计？优点在哪？

| 优点                      | 说明                                 |
| ------------------------- | ------------------------------------ |
| 🚀 优先使用 CAS 提高性能   | 在竞争小、桶为空时，完全无锁写入     |
| 🔒 synchronized 降低锁粒度 | 只锁桶位，不锁整张表，提高并发度     |
| 💥 避免全表锁              | 相比 Hashtable，性能提升明显         |
| 🧠 分散热点桶冲突          | 锁的粒度是节点级别，不影响其他桶写入 |

------

## ✅ 8. 面试简答模板（建议背诵）

> JDK 1.8 中的 `ConcurrentHashMap` 在执行 `put()` 操作时，首先通过 `CAS` 尝试将数据插入对应桶位（当该桶为空），如果 CAS 成功，则无锁写入；如果失败或桶已非空，则使用 `synchronized` 对该桶的首节点加锁来完成插入。这种设计结合了 CAS 的高效性和 synchronized 的可靠性，实现了粒度更细、性能更高的线程安全 Map
