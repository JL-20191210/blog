# ☕ Java 面试答题卡： PriorityQueue详解

## **✅ 1. 简介：什么是 PriorityQueue？**

> PriorityQueue 是 Java 中基于**优先级堆（最小堆或最大堆）实现的队列结构**，属于 java.util 包，实现了 Queue 接口。

它保证每次出队（poll()）返回**优先级最高（或最低）的元素，而不是按元素入队顺序**返回。

## **✅ 2. 特性总结**

| **特性**     | **描述**                                               |
| ------------ | ------------------------------------------------------ |
| 内部结构     | 默认使用 **最小堆**（小顶堆），基于数组实现            |
| 元素顺序     | 入队无序，出队有序（优先级高的先出）                   |
| 默认排序方式 | 元素需实现 Comparable 接口                             |
| 自定义排序   | 可通过构造方法传入 Comparator                          |
| 允许重复元素 | ✅ 允许                                                 |
| 线程安全性   | ❌ 非线程安全（需手动加锁或使用 PriorityBlockingQueue） |

## **✅ 3. 构造方法**

```
PriorityQueue()                            // 默认容量 11，元素需实现 Comparable
PriorityQueue(int initialCapacity)         // 指定初始容量
PriorityQueue(Comparator<? super E> comp)  // 自定义比较器
PriorityQueue(Collection<? extends E> c)   // 从已有集合创建
```

## **✅ 4. 使用示例（默认最小堆）**

```
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(3);
pq.offer(1);
pq.offer(5);

while (!pq.isEmpty()) {
    System.out.println(pq.poll());  // 输出：1 3 5
}
```

## **✅ 5. 自定义最大堆**

```
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
maxHeap.addAll(Arrays.asList(2, 9, 1, 6));

System.out.println(maxHeap.poll()); // 输出 9（最大堆）
```

## **✅ 6. 自定义对象排序**



```
class Task {
    String name;
    int priority;
    public Task(String name, int priority) {
        this.name = name;
        this.priority = priority;
    }
}

// 优先级从小到大
PriorityQueue<Task> tasks = new PriorityQueue<>(Comparator.comparingInt(t -> t.priority));

tasks.add(new Task("A", 5));
tasks.add(new Task("B", 1));
tasks.add(new Task("C", 3));

System.out.println(tasks.poll().name); // 输出 B
```

## **✅ 7. 底层原理（简要）**

- 底层是一个 **最小堆（heap）** 实现，使用 **数组** 保存元素。

- 核心操作：

  

  - offer(): 插入元素 → siftUp（上浮）保持堆序
  - poll(): 弹出堆顶元素 → 将末尾元素置顶，再 siftDown（下沉）

  

- 堆排序规则依赖 Comparable 或 Comparator

## **✅ 8. 时间复杂度分析**

| **操作**     | **时间复杂度** |
| ------------ | -------------- |
| offer()      | O(log n)       |
| poll()       | O(log n)       |
| peek()       | O(1)           |
| 遍历所有元素 | 无序（O(n)）   |

## **✅ 9. 注意事项**

- PriorityQueue **不保证插入顺序**，迭代器输出是无序的。
- 不支持 null 元素，否则抛 NullPointerException。
- 不适合用于并发场景（请用 PriorityBlockingQueue）。
- 执行排序需满足**一致性比较规则**（否则抛 ClassCastException 或排序错乱）。

## **🎯 面试简答模板（建议背诵）**

> PriorityQueue 是 Java 中的优先级队列，底层使用最小堆实现，保证每次出队的都是优先级最高或最低的元素。它不保证插入顺序，但能快速获取最小/最大值。支持自定义比较器，也可用 Comparable 约定排序规则。该结构适合用于任务调度、路径算法等需要动态最值的数据结构场景。

