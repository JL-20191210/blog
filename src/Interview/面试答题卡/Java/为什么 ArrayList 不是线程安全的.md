# ☕ Java面试答题卡：为什么ArrayList不是线程安全的？

##  ✅ 1. 结论先行

> ArrayList **不是线程安全的**，因为它的**增删查改操作没有任何同步控制**，多个线程同时修改共享的 ArrayList 实例，可能导致：
- 数据丢失
- 越界异常
- 并发修改异常（ConcurrentModificationException）
- 元素覆盖或脏读

## **✅ 2. 哪些方法不安全？举例说明**

来看 ArrayList 常用方法的源码（简化版）：

### **🔸 add(E e)**

```
public boolean add(E e) {
    ensureCapacityInternal(size + 1);
    elementData[size++] = e;
    return true;
}
```

- **未加锁**
- size++ 是非原子操作
- 多线程同时 add()，可能导致数据丢失或数组越界

### **🔸 get(int index)**

```
public E get(int index) {
    return elementData[index]; // 也未加锁
}
```

- 如果此时其他线程在删除或扩容，可能读到错误值或抛出 IndexOutOfBoundsException

### **🔸 remove(int index)**

```
public E remove(int index) {
    E oldValue = elementData[index];
    int numMoved = size - index - 1;
    System.arraycopy(elementData, index + 1, elementData, index, numMoved);
    elementData[--size] = null;
    return oldValue;
}
```

- 未加锁，且牵涉到数组移动和 size--
- 多线程操作时，可能导致：
  - 元素丢失
  - 位置错乱
  - 脏数据访问

## **✅ 3. 多线程下的实际例子（数据丢失）**

```
List<Integer> list = new ArrayList<>();

Runnable task = () -> {
    for (int i = 0; i < 1000; i++) {
        list.add(i);
    }
};

Thread t1 = new Thread(task);
Thread t2 = new Thread(task);

t1.start();
t2.start();
t1.join();
t2.join();

System.out.println("实际大小：" + list.size()); // 小于 2000，说明丢数据了！
```

## **✅ 4. 为何不是线程安全的核心原因？**

| **原因**                  | **描述**                                          |
| ------------------------- | ------------------------------------------------- |
| 没有加锁机制              | 所有方法中没有 synchronized、ReentrantLock 等控制 |
| size++ 非原子             | 并发下会覆盖写入或跳过更新                        |
| 内部数组 elementData 暴露 | 无保护机制，导致并发读写冲突                      |
| 缺乏并发读写隔离          | 没有使用 volatile、不可变结构或复制机制           |

## **✅ 5. 如何让它线程安全？**

### **✅ 方式一：使用包装器**

```
List<String> safeList = Collections.synchronizedList(new ArrayList<>());
```

- 内部方法加了 synchronized
- 迭代时仍需手动加锁（否则仍可能抛异常）：

```
synchronized (safeList) {
    for (String s : safeList) {
        // 安全迭代
    }
}
```

### **✅ 方式二：使用并发集合**

```
List<String> list = new CopyOnWriteArrayList<>();
```

- 读写隔离，读无锁，写复制，适合读多写少的场景

## **✅ 6. 面试答题模板（建议背诵）**

> [!important]
>
> ArrayList 不是线程安全的，因为它没有任何同步机制。在多线程环境下同时进行 add()、remove() 或 get() 操作，会导致数据丢失、数组越界、并发修改异常等问题。主要原因是内部操作如 size++ 和数组移动是非原子的。解决方案包括使用 Collections.synchronizedList() 包装，或使用 CopyOnWriteArrayList 等并发集合类。

