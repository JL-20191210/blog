# ☕ Java 面试答题卡：CopyOnWriteArrayList详解

## **✅ 1. 什么是 CopyOnWriteArrayList？**

> CopyOnWriteArrayList 是 Java 提供的一个 **线程安全** 的 List 实现，底层通过“**写时复制（Copy-On-Write）**”机制来实现并发安全，适用于**读多写少**的场景。

它是 ArrayList 的并发替代方案，属于 java.util.concurrent 包。

## **✅ 2. 底层原理：什么是写时复制？**

> 所谓 **写时复制**：在修改（写操作）时不直接修改原始数据，而是**复制出一份副本**，修改副本，再将引用指向副本。

### **📦 举个例子：**

```
原数组 A：[1, 2, 3]
线程1 读取 A，不受影响
线程2 执行 add(4)：
  → 复制数组为 A'：[1, 2, 3, 4]
  → 用新数组 A' 替换旧数组引用
```

## **✅ 3. 核心字段**

```
private volatile transient Object[] array;
```

- 所有读操作直接基于这个 array 数组
- 所有写操作先复制，再替换（写期间不影响读）

## **✅ 4. 构造方法和用法**

```
List<String> list = new CopyOnWriteArrayList<>();

list.add("Java");
list.add("Python");
System.out.println(list.get(1)); // 输出：Python

list.remove("Java");
```

## **✅ 5. 适合的使用场景**

| **场景**                     | **是否推荐** | **说明**                         |
| ---------------------------- | ------------ | -------------------------------- |
| 多线程只读 / 读远多于写      | ✅ 推荐       | 写操作开销大，但读操作无锁、高效 |
| 数据频繁变动、增删操作频繁   | ❌ 不推荐     | 每次写都复制整个数组，性能差     |
| 迭代时不希望出现并发修改异常 | ✅ 推荐       | 支持弱一致性迭代器（快照副本）   |

## **✅ 6. 与其他集合对比**

| **特性**         | ArrayList | Vector      | CopyOnWriteArrayList   |
| ---------------- | --------- | ----------- | ---------------------- |
| 是否线程安全     | ❌         | ✅（重同步） | ✅（无锁读、写复制）    |
| 读操作效率       | 高        | 中          | ✅ 高（读不加锁）       |
| 写操作开销       | 低        | 高（加锁）  | ⚠️ 很高（复制整个数组） |
| 是否支持并发迭代 | ❌ 抛异常  | ❌ 抛异常    | ✅ 支持（快照机制）     |

## ✅ 7. 源码片段分析（以add()为例)

```
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();     // 获取当前数组
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1); // 复制新数组
        newElements[len] = e;
        setArray(newElements);              // 替换旧数组
        return true;
    } finally {
        lock.unlock();
    }
}
```

- 采用显式 ReentrantLock 加锁
- 所有修改操作都会复制整个数组并替换

## **✅ 8. 为什么迭代时不会抛异常？**

- CopyOnWriteArrayList 的迭代器基于“快照数组”
- 即使原集合被修改，迭代器仍使用原数组 → 不抛 ConcurrentModificationException

```
for (String s : list) {
    list.remove(s); // ✅ 安全，不影响当前 for-each
}
```

## **✅ 9. 面试常问问题答法**

### **🔹 Q1：CopyOnWriteArrayList 如何实现线程安全？**

> 读操作无锁，写操作通过加锁并复制新数组，然后原子替换；保证读写隔离，不发生冲突。

### **🔹 Q2：适合什么场景？**

> 读远多于写的场景，例如黑名单、配置表、订阅列表；不适合频繁写的环境。

### **🔹 Q3：为啥不抛 ConcurrentModificationException？**

> 因为它的迭代器是基于旧数组的快照，遍历的是旧数据，不受写操作影响。

## **🎯 面试答题模板（建议背诵）**

> CopyOnWriteArrayList 是 Java 中线程安全的 List 实现，通过写时复制（Copy-On-Write）机制实现读写隔离。读操作无锁、写操作通过复制新数组实现。适用于读多写少、且希望避免并发修改异常的场景，如配置缓存、订阅列表等。