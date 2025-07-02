# ☕ Java 面试答题卡：`synchronized` 详解


## ✅ 1. `synchronized` 是什么？

> `synchronized` 是 Java 提供的一种**内置锁机制**，用于实现线程之间的**互斥与可见性**。它可以修饰方法或代码块，确保同一时间只能有一个线程访问被锁定的资源。

## ✅ 2. 三种基本用法

| 用法形式                    | 说明                                    |
| --------------------------- | --------------------------------------- |
| `synchronized 方法`         | 修饰实例方法，锁的是**当前对象 this**   |
| `synchronized static 方法`  | 修饰静态方法，锁的是**类对象 Class<?>** |
| `synchronized (obj)` 代码块 | 显式锁定某个对象                        |

### 示例代码：

```java
public synchronized void instanceMethod() { }          // 锁 this
public static synchronized void staticMethod() { }     // 锁 类的 Class 对象
public void customLock() {
    synchronized (lockObj) { ... }                     // 锁指定对象
}
```

## ✅ 3. `synchronized` 保证了哪些？

| 作用   | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| 互斥   | 同一时刻只有一个线程能进入被锁定的临界区                     |
| 可见性 | 锁释放前，线程对共享变量的修改对其他线程立即可见（JMM 保证） |
| 原子性 | 被 `synchronized` 包裹的操作是不可中断的（不会被打断执行一半） |

## ✅ 4. 底层原理JDK 1.6+）

`synchronized` 的锁是基于**对象头中的 monitor（监视器锁）** 实现的。

### 锁的状态（偏向锁 → 轻量级锁 → 重量级锁）

| 锁状态   | 特点                     | 适用场景             |
| -------- | ------------------------ | -------------------- |
| 无锁     | 默认状态，无竞争         | 单线程场景           |
| 偏向锁   | 第一次加锁记录线程 ID    | 线程长期访问一个对象 |
| 轻量级锁 | 多线程尝试加锁，使用自旋 | 多线程短时间竞争     |
| 重量级锁 | 自旋失败，阻塞其他线程   | 高竞争，线程频繁切换 |

> JVM 会根据竞争情况自动升级和降级锁状态，无需开发者干预。


## ✅ 5. 对应字节码指令

- `synchronized` 代码块 → `monitorenter` / `monitorexit`
- `synchronized` 方法 → `ACC_SYNCHRONIZED` 标志位

```java
public synchronized void foo() { } 
// 编译后在字节码中标记方法为 ACC_SYNCHRONIZED
```

## ✅ 6. synchronized 与 volatile 的区别

| 特性     | `synchronized`     | `volatile`           |
| -------- | ------------------ | -------------------- |
| 互斥性   | ✅ 有               | ❌ 无                 |
| 可见性   | ✅ 有               | ✅ 有                 |
| 原子性   | ✅ 有               | ❌ 无                 |
| 使用场景 | 多线程访问共享资源 | 状态标志、单变量读写 |

## ✅ 7. 性能优化（JDK 1.6 后）

JVM 针对 `synchronized` 做了大量优化：

- **锁粗化（Lock Coarsening）**
- **锁消除（Lock Elimination）**
- **偏向锁 / 轻量级锁 / 自旋锁**
- **TLAB（线程本地分配缓存）**

这些优化使得 `synchronized` 的性能大大提升，**不再是“低性能代名词”**！


## ✅ 8. 面试常问问题与答案

### Q1：synchronized 和 Lock 有什么区别？

| 维度       | `synchronized` | `ReentrantLock`               |
| ---------- | -------------- | ----------------------------- |
| 可重入     | ✅ 支持         | ✅ 支持                        |
| 中断响应   | ❌ 不支持       | ✅ 支持中断                    |
| 是否公平锁 | ❌ 非公平       | ✅ 可配置为公平                |
| 可尝试获取 | ❌ 不支持       | ✅ tryLock() 支持超时/失败控制 |
| 条件变量   | ❌ 内部条件单一 | ✅ 可创建多个 Condition        |


### Q2：synchronized 会锁住整个对象吗？

不是。它的锁粒度取决于加在哪：

- 加在实例方法：锁住的是**当前对象（this）**
- 加在静态方法：锁住的是**类对象（Class）**
- 加在代码块：锁的是**指定对象引用**


### Q3：锁升级机制能否手动控制？

不能，JVM 会**自动**根据线程竞争情况进行升级（从偏向锁→轻量级锁→重量级锁），开发者只能控制是否开启偏向锁（通过 JVM 参数）。


## ✅ 9. 示例：synchronized 的可重入性

```java
public class ReentrantExample {
    public synchronized void method1() {
        System.out.println("method1");
        method2();
    }

    public synchronized void method2() {
        System.out.println("method2");
    }

    public static void main(String[] args) {
        new ReentrantExample().method1();
    }
}
```

输出：

```
method1
method2
```

说明：同一个线程进入了两次锁（**可重入性**）。

## 🎯 面试答题模板（建议背诵）

> `synchronized` 是 Java 提供的内置锁机制，用于保证多线程访问共享资源时的线程安全。它可以修饰方法或代码块，分别锁住实例或类对象。底层通过对象的 Monitor 实现，并支持锁的升级（偏向锁、轻量级锁、重量级锁）以提高性能。与 Lock 相比，synchronized 使用更简单，但灵活性略差。

