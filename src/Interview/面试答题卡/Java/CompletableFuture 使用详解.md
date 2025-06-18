# 📝 Java 面试答题卡：CompletableFuture使用详解

### **✅ 1. 简介**

- CompletableFuture 是 Java 8 引入的异步编程 API，属于 java.util.concurrent 包。
- 支持非阻塞、链式编程风格。
- 是 Future 的增强版，支持回调、组合多个任务结果、异常处理等。

### **✅ 2. 常用方法分类总结**

| **类型**     | **方法**                          | **描述**                        |
| ------------ | --------------------------------- | ------------------------------- |
| 创建异步任务 | supplyAsync() / runAsync()        | 异步获取值 / 异步执行无返回任务 |
| 任务串联     | thenApply() / thenAccept()        | 接收上一步结果并继续处理        |
| 组合任务     | thenCombine() / allOf() / anyOf() | 多个任务并发执行与组合          |
| 异常处理     | exceptionally() / handle()        | 捕获并处理异常                  |
| 阻塞获取结果 | get() / join()                    | 获取最终结果（同步）            |

### **✅ 3. 快速示例**

#### **🔹 3.1 创建异步任务**

```
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // 模拟耗时任务
    sleep(1000);
    return "Hello";
});
```

#### **🔹 3.2 thenApply：串行转换**

```
future.thenApply(result -> result + " World")
      .thenAccept(System.out::println);
```

#### **🔹 3.3 thenCombine：合并两个任务结果**

```
CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> "A");
CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> "B");

f1.thenCombine(f2, (a, b) -> a + b)
  .thenAccept(System.out::println); // 输出 AB
```

#### **🔹 3.4 allOf：等待多个任务全部完成**

```
CompletableFuture<Void> all = CompletableFuture.allOf(f1, f2);
all.join(); // 阻塞直到所有任务完成
```

#### **🔹 3.5 exceptionally：处理异常**

```
CompletableFuture<String> failFuture = CompletableFuture.supplyAsync(() -> {
    if (true) throw new RuntimeException("出错了");
    return "OK";
});

failFuture
    .exceptionally(e -> "默认值")
    .thenAccept(System.out::println); // 输出：默认值
```

### **✅ 4. 使用场景总结**

| **场景**                        | **解决方案**               |
| ------------------------------- | -------------------------- |
| 异步执行后台任务                | supplyAsync()              |
| 多个任务并发执行 + 等待全部完成 | allOf()                    |
| 多个任务取一个最快返回结果      | anyOf()                    |
| 异步回调处理 / 串联结果         | thenApply() / thenAccept() |
| 异常恢复机制                    | exceptionally() / handle() |

### **✅ 5. 阻塞 vs 非阻塞方法区别**

| **方法** | **类型** | **说明**             |
| -------- | -------- | -------------------- |
| get()    | 阻塞     | 会抛异常             |
| join()   | 阻塞     | 不抛检查异常（推荐） |


### **✅ 6. 推荐写法（链式、非阻塞）**

```
CompletableFuture.supplyAsync(() -> "Step 1")
    .thenApply(s -> s + " + Step 2")
    .thenAccept(System.out::println);
```

### **✅ 7. 和 Future 的区别（重点）**

| **特性**   | Future             | CompletableFuture            |
| ---------- | ------------------ | ---------------------------- |
| 异步       | 有限支持           | 完全支持                     |
| 阻塞       | 只能 get()         | 可非阻塞、回调               |
| 串联任务   | ❌ 不支持           | ✅ thenApply() 等支持链式调用 |
| 异常处理   | ❌ 不方便           | ✅ 支持 exceptionally()       |
| 多任务组合 | ❌ 无法处理多个任务 | ✅ allOf()、anyOf() 等        |


### **🎯 总结一段话答法（面试回答模板）**
> Java 中的 CompletableFuture 是对 Future 的增强，支持异步执行、任务链式组合、回调处理与异常捕获等功能，适合在多线程并发任务处理、微服务调用聚合等场景中使用。它是 Java 8 函数式编程 + 异步模型结合的重要工具，尤其适合替代传统的 Future.get() 的阻塞调用。
