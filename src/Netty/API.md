# API

---

### `scheduleAtFixedRate` 

```java
ScheduledFuture<?> scheduleAtFixedRate(Runnable var1, long var2, long var4, TimeUnit var6);
```

#### 参数：
- **`var1`** (`Runnable`): 要调度执行的任务。此任务是一个实现了 `Runnable` 接口的对象，`run()` 方法将定期执行。  
- **`var2`** (`long`): 第一次任务执行前的初始延迟。任务将在调用此方法后，等待 `var2` 参数指定的时间量后开始执行。单位由 `var6` 参数指定。
- **`var4`** (`long`): 任务执行之间的固定时间间隔。每次任务执行完毕后，系统将等待 `var4` 参数指定的时间量后再执行下一次任务。单位由 `var6` 参数指定。
- **`var6`** (`TimeUnit`): 时间单位，用于指定 `var2` 和 `var4` 的时间单位。可以是以下之一：
  - `TimeUnit.NANOSECONDS`
  - `TimeUnit.MILLISECONDS`
  - `TimeUnit.SECONDS`
  - `TimeUnit.MINUTES`
  - `TimeUnit.HOURS`
  - `TimeUnit.DAYS`

#### 返回值：
- **`ScheduledFuture<?>`**: 返回一个 `ScheduledFuture` 对象，代表已调度的任务。`ScheduledFuture` 提供了对任务的控制，可以查询任务的状态、取消任务等。

#### 异常：
- **`NullPointerException`**: 如果 `var1`（即任务）为 `null`，抛出此异常。
- **`RejectedExecutionException`**: 如果任务不能被执行（例如任务调度器已关闭或其他原因），抛出此异常。
- **`IllegalArgumentException`**: 如果 `var2` 或 `var4` 为负值，抛出此异常。

#### 描述：
该方法将任务 `var1` 在一个特定的延迟后执行，随后每隔固定的时间间隔执行一次。调度的时间间隔是根据 **上次任务执行结束后的时间** 来计算的，而不是上一次调度的起始时间。执行的任务间隔由 `var4` 参数指定。

此方法适用于需要按照固定时间间隔重复执行的任务。若任务的执行时间较长，并且希望任务间隔保持固定时间，可能会发生延迟。

#### 示例：

```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
scheduler.scheduleAtFixedRate(() -> {
    System.out.println("Task executed at: " + System.currentTimeMillis());
}, 1, 3, TimeUnit.SECONDS);
```

此代码示例会在首次执行任务前等待 **1 秒**，然后每 **3 秒** 执行一次任务。

```java
//1.创建事件循环组
NioEventLoopGroup group = new NioEventLoopGroup(2); // io事件，普通任务，定时任务

group.next().scheduleAtFixedRate(()->{
    log.debug("yes");
},10,1, TimeUnit.SECONDS);
```

这个方法会在 **10 秒后** 首次执行任务 `log.debug("yes")`，然后每 **1 秒** 执行一次。

#### 注意：

- `scheduleAtFixedRate` 方法调度的任务，通常执行时间是相对于上次任务结束后的时间间隔。如果任务的执行时间过长，下一次任务的开始时间将根据任务结束后的间隔进行调整。
- 如果任务的执行时间较长，可以考虑使用 `scheduleWithFixedDelay`，该方法会基于上次任务结束后的延迟时间来调度任务，而不是固定间隔。

