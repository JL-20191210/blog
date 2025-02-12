---
icon: pen-to-square
date: 2025-02-12
category:
  - Netty
tag:
  - API
---
# ExecutorService

`ExecutorService` 是 Java 中的一个接口，它继承自 `Executor` 接口，用于提供更为高级的任务执行功能。它定义了线程池的基本操作，能够提交和管理任务，并且提供了一些额外的方法来控制和管理线程池的生命周期。下面是对 `ExecutorService` 的总结和接口文档的概述：

<!-- more -->
### 主要方法

1. **submit(Callable<T> task)**:
   - 提交一个 `Callable` 任务，并返回一个 `Future<T>` 对象，表示该任务的异步执行结果。
   - 任务会在后台线程池中执行，调用 `Future.get()` 可以获取任务的结果。

2. **submit(Runnable task)**:
   - 提交一个 `Runnable` 任务，并返回一个 `Future<?>` 对象，表示该任务的异步执行状态。
   - 任务会在后台线程池中执行，调用 `Future.get()` 可以获取任务的完成状态。

3. **invokeAll(Collection<? extends Callable<T>> tasks)**:
   - 提交一组 `Callable` 任务，并返回一个包含每个任务执行结果的 `List<Future<T>>`。
   - 所有任务会在后台线程池中执行，且任务按提交顺序等待执行。

4. **invokeAny(Collection<? extends Callable<T>> tasks)**:
   - 提交一组 `Callable` 任务并返回执行完成的第一个任务的结果。
   - 如果至少有一个任务成功执行，则返回该任务的结果。如果所有任务都失败，则抛出异常。

5. **shutdown()**:
   - 优雅地关闭线程池，停止接受新任务，并且在所有已提交的任务完成后关闭线程池。
   - 该方法不会立即终止已提交任务的执行，已提交任务会在执行完成后关闭。

6. **shutdownNow()**:
   - 尝试停止所有正在执行的任务，并返回尚未执行的任务列表。
   - 不保证会中断正在执行的任务，通常是通过中断线程来尽可能地停止任务。

7. **isShutdown()**:
   - 返回一个布尔值，表示线程池是否已经关闭（通过调用 `shutdown()` 或 `shutdownNow()`）。

8. **isTerminated()**:
   - 返回一个布尔值，表示线程池中的所有任务是否都已经完成。

9. **awaitTermination(long timeout, TimeUnit unit)**:
   - 在指定的时间内等待所有任务完成。
   - 如果所有任务在超时之前完成，则返回 `true`，否则返回 `false`。

### 继承自 `Executor` 接口的方法

- **execute(Runnable command)**:
  - 提交一个 `Runnable` 任务进行执行。与 `ExecutorService` 中的 `submit` 方法不同，它不会返回 `Future` 对象，且不能获取任务的执行结果。

### 线程池的特点

- **线程池大小管理**：`ExecutorService` 实现通常会使用一个线程池来处理提交的任务，能够有效地管理线程资源。
- **任务管理**：支持任务的排队、执行和结果返回。`ExecutorService` 的实现可以灵活地处理异步任务和结果的同步。
- **生命周期管理**：提供了线程池的生命周期管理方法，如 `shutdown` 和 `shutdownNow`，可以方便地控制线程池的关闭和任务的执行状态。

### 常用实现类

- **ThreadPoolExecutor**：最常用的线程池实现类，允许详细配置线程池的参数（如核心线程数、最大线程数、空闲线程存活时间等）。
- **ScheduledThreadPoolExecutor**：支持任务定时执行的线程池实现，能够执行周期性或延迟的任务。

### 总结

`ExecutorService` 提供了一个完整的任务执行框架，能够有效地管理线程池和任务的生命周期。通过 `submit`、`invokeAll`、`invokeAny` 等方法，可以灵活地提交任务并获得执行结果，适合用于需要异步执行并管理多个任务的场景。