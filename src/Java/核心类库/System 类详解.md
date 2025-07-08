# 📚 JavaSystem类详解

java.lang.System 是 Java 标准库提供的一个工具类，它包含了一组 **与系统交互的静态方法和标准对象引用**，比如控制台输出、系统属性、环境变量、时间获取等。

## **✅ 基本特性**

| **特性**           | **说明**                    |
| ------------------ | --------------------------- |
| 是 final 类        | 不能被继承                  |
| 构造方法私有       | 不能被实例化                |
| 所有方法都是静态的 | 直接通过 System.method() 使 |

## 📦 常用字段

| **字段**   | **类型**    | **说明**                                 |
| ---------- | ----------- | ---------------------------------------- |
| System.in  | InputStream | 标准输入流（通常是键盘）                 |
| System.out | PrintStream | 标准输出流（通常是控制台）               |
| System.err | PrintStream | 错误输出流（通常也是控制台，但颜色不同） |

### 示例：

```
System.out.println("这是正常输出");
System.err.println("这是错误输出");
```

## 🧰 常用方法一览

### **🔹 1.** currentTimeMillis() **和** nanoTime()

```
long t1 = System.currentTimeMillis(); // 当前时间（毫秒） → 可用于时间戳
long t2 = System.nanoTime(); // 更高精度的时间 → 适合性能测试
```

| **方法**            | **精度** | **场景**                     |
| ------------------- | -------- | ---------------------------- |
| currentTimeMillis() | 毫秒     | 生成时间戳、日志             |
| nanoTime()          | 纳秒     | 性能监控、计时器（相对时间） |

### **🔹 2.** exit(int status)

```
System.exit(0); // 正常退出
System.exit(1); // 异常退出
```

- 退出 Java 虚拟机
- 会触发 shutdown hook（关闭钩子）

### **🔹 3.** gc()与垃圾回收

```
System.gc(); // 请求 JVM 进行垃圾回收（仅是建议）
```

- 实际由 JVM 决定是否回收
- 推荐使用 Runtime.getRuntime().gc() 或不主动调用

### **🔹 4.** arraycopy(...)数组快速复制

```
System.arraycopy(src, srcPos, dest, destPos, length);
```

比 for 循环快得多，底层是 native 方法。

#### 示例：

```
int[] src = {1, 2, 3, 4, 5};
int[] dest = new int[5];
System.arraycopy(src, 0, dest, 0, 5);
```

### **🔹 5.** getProperty() / setProperty()系统属性

```
String javaVersion = System.getProperty("java.version");
System.setProperty("env.log.path", "/tmp/logs");
```

- JVM 启动参数中的 -Dkey=value 会自动注册到 System.getProperty
- 典型用途：日志配置、环境判断

⚠️ 注意：不会影响系统环境变量，只影响当前 JVM。

:fire:重启程序后会重新注册

### **🔹 6.** getenv()获取环境变量

```
String path = System.getenv("PATH");
```

- 获取操作系统层面的环境变量（非 JVM 参数）
- 通常用于容器部署、读取系统配置等

### **🔹 7.** lineSeparator() 获取换行符

```
String sep = System.lineSeparator(); // Windows: \r\n, Unix: \n
```

## **📌 系统属性示例表（常用）**

| **属性名**     | **含义**                      |
| -------------- | ----------------------------- |
| java.version   | Java 版本                     |
| java.home      | JRE 安装路径                  |
| user.dir       | 当前工作目录                  |
| os.name        | 操作系统名称                  |
| file.separator | 文件路径分隔符（Windows: \\） |
| line.separator | 换行符                        |
| user.name      | 当前用户                      |

## **🔍 System vs Runtime**

| **功能** | **System**      | **Runtime**                     |
| -------- | --------------- | ------------------------------- |
| 属性获取 | ✅               | ❌                               |
| 日志输出 | ✅               | ❌                               |
| 退出 JVM | ✅ (System.exit) | ✅ (Runtime.getRuntime().exit()) |
| 执行命令 | ❌               | ✅ (exec(...))                   |
| 获取内存 | ❌               | ✅ (totalMemory() 等)            |

## **🚀 示例：打印所有系统属性**

```
Properties props = System.getProperties();
props.forEach((k, v) -> System.out.println(k + " = " + v));
```

## **⚠️ 注意事项**

| **问题**                     | **建议**                   |
| ---------------------------- | -------------------------- |
| System.exit() 会立即终止 JVM | 不建议在 Web 项目中使用    |
| System.gc() 不是强制         | 让 GC 自己决定更合适       |
| System.out.println 过度使用  | 会拖慢程序，建议用日志框架 |

## **✅ 总结一句话：**

> System 是 Java 中与 **JVM、系统环境和控制台输出交互**的重要类，虽然简单，但在实际开发中扮演着不可或缺的角色。