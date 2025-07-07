# ☕ Java 面试答题卡：AQS（AbstractQueuedSynchronizer）详解

------

## ✅ 一句话概括

> AQS 是 Java 并发包 `java.util.concurrent.locks` 的核心抽象类，用于构建各种同步器，如：`ReentrantLock`、`CountDownLatch`、`Semaphore` 等，其通过一个共享的 `state` 状态字段 + FIFO 等待队列，实现线程间的同步控制。

------

## ✅ 1. 核心角色与结构

## 📦 类名：

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer
```

## 📌 设计目标：

封装同步状态管理（state）+ 阻塞线程队列（FIFO），**统一控制并发资源的访问**。

## 📐 内部结构图：

```
      +------------------------+
      |     AQS (核心)         |
      |  - state               |
      |  - head, tail (队列)   |
      +------------------------+
        ↑      ↑
  线程 A  线程 B  ...
  失败则入队排队等待
```

------

## ✅ 2. 核心组件详解

| 组件                   | 说明                                           |
| ---------------------- | ---------------------------------------------- |
| `state`                | 共享变量，表示当前同步状态，通常为锁的持有情况 |
| `Node`                 | 内部类，代表等待队列中的每个线程               |
| `head`, `tail`         | 等待队列的头尾指针                             |
| `exclusiveOwnerThread` | 独占模式下记录当前持锁线程（ReentrantLock 用） |

------

## ✅ 3. 两种模式

| 模式     | 说明                             | 典型实现                      |
| -------- | -------------------------------- | ----------------------------- |
| 独占模式 | 同一时间只能一个线程获取同步资源 | `ReentrantLock`               |
| 共享模式 | 多个线程可以同时访问资源         | `Semaphore`、`CountDownLatch` |

------

## ✅ 4. 子类需要实现的方法（模板方法）

| 方法名                  | 说明                                   |
| ----------------------- | -------------------------------------- |
| `tryAcquire(int arg)`   | 独占式获取资源                         |
| `tryRelease(int arg)`   | 独占式释放资源                         |
| `tryAcquireShared(int)` | 共享式获取资源（返回值 >= 0 表示成功） |
| `tryReleaseShared(int)` | 共享式释放资源                         |
| `isHeldExclusively()`   | 当前线程是否独占资源（可选）           |

------

## ✅ 5. 提供的核心方法（由子类调用）

| 方法名               | 说明                             |
| -------------------- | -------------------------------- |
| `acquire(int)`       | 获取独占资源，失败则加入队列等待 |
| `release(int)`       | 释放独占资源，并唤醒后继节点     |
| `acquireShared(int)` | 获取共享资源，失败则加入队列     |
| `releaseShared(int)` | 释放共享资源，唤醒所有共享节点   |
| `hasQueuedThreads()` | 是否存在等待线程                 |

------

## ✅ 6. 核心工作流程（独占模式）

## 示例：`acquire()` 获取锁流程

1. 调用子类实现的 `tryAcquire()` 尝试抢锁
2. 如果失败，则封装当前线程为 `Node` 入队
3. 自旋判断自己是否是队头节点且可获取锁（前驱释放时唤醒）
4. 获取成功 → 执行逻辑 → 调用 `release()` 释放锁

------

## ✅ 7. 自定义同步器示例（独占锁）

```java
public class MyLock extends AbstractQueuedSynchronizer {

    @Override
    protected boolean tryAcquire(int arg) {
        return compareAndSetState(0, 1); // 抢占锁
    }

    @Override
    protected boolean tryRelease(int arg) {
        setState(0); return true;        // 释放锁
    }

    public void lock() {
        acquire(1);
    }

    public void unlock() {
        release(1);
    }
}
```

------

## ✅ 8. AQS 内部队列机制（FIFO）

- 底层使用 CLH（虚拟双向队列）
- 每个节点 `Node` 代表一个等待线程
- 节点有状态（如：SIGNAL、CANCELLED）
- 使用 `LockSupport.park()` 和 `unpark()` 实现阻塞/唤醒

------

## ✅ 9. AQS 的好处

| 优势               | 说明                                 |
| ------------------ | ------------------------------------ |
| 模板方法设计       | 子类只需关注 `tryAcquire` 等少数方法 |
| 状态管理统一       | `state` 控制并发资源，统一管理       |
| 阻塞队列封装良好   | 自动实现阻塞、排队、公平性等机制     |
| 可构建多种并发组件 | 支持锁、信号量、栅栏等各种同步工具   |

------

## ✅ 10. 常见基于 AQS 的并发组件

| 类名                     | 模式      | 功能                       |
| ------------------------ | --------- | -------------------------- |
| `ReentrantLock`          | 独占      | 可重入互斥锁               |
| `Semaphore`              | 共享      | 控制并发线程数             |
| `CountDownLatch`         | 共享      | 等待其他线程完成           |
| `ReentrantReadWriteLock` | 独占+共享 | 支持读写锁分离             |
| `FutureTask`             | 独占      | 用于线程池任务返回值的同步 |

------

## ✅ 11. 面试常问问题与答题模板（建议背诵）

> AQS 是 Java 并发包的基础抽象类，用于构建锁和同步器。它通过一个 `volatile` 的 state 状态变量控制资源访问，并维护一个 FIFO 的阻塞等待队列。当线程获取失败时，会加入队列等待，通过 `LockSupport.park()` 挂起，被唤醒后再次尝试。AQS 的设计非常经典，基于模板方法，简化了同步器的开发。