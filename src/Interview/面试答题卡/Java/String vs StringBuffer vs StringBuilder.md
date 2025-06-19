# ☕Java 面试答题卡：String vs StringBuffer vs StringBuilder
### **✅ 1. 三者的基本作用**
| **类型**      | **说明**                     |
| ------------- | ---------------------------- |
| String        | 不可变的字符序列（final 类） |
| StringBuffer  | 可变字符序列，**线程安全**   |
| StringBuilder | 可变字符序列，**非线程安全** |
### **✅ 2. 三者的区别（核心对比表）**
| **特性**     | **String**                  | **StringBuffer**              | **StringBuilder**        |
| ------------ | --------------------------- | ----------------------------- | ------------------------ |
| 可变性       | ❌ 不可变                    | ✅ 可变                        | ✅ 可变                   |
| 线程安全     | ✅ 安全（不可变天然安全）    | ✅ 安全（方法有 synchronized） | ❌ 不安全（适用于单线程） |
| 性能（效率） | 最慢（频繁创建新对象）      | 中等（线程安全影响性能）      | 最快（无锁，单线程场景） |
| 使用场景     | 常用于字符串常量和不变文本  | 多线程环境下频繁修改字符串    | 单线程下频繁修改字符串   |
| 底层实现     | char[]（JDK 9 后为 byte[]） | char[]                        | char[]                   |
### **✅ 3. 示例说明**
#### **String（不可变）**
```java
String s = "Hello";
s += " World";  // 实际创建了两个新的 String 对象
```
#### **StringBuffer（线程安全）**

```java
StringBuffer sb = new StringBuffer("Hello");
sb.append(" World");  // 修改原有对象
```

#### **StringBuilder（高性能）**

```java
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");  // 修改原有对象
```

### **✅ 4. 内存效率对比（模拟）**

```java
String s = "";
for (int i = 0; i < 1000; i++) {
    s += i; // 会产生大量临时对象
}

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i); // 更高效
}
```

### **✅ 5. 推荐使用场景**

| **场景**                       | **推荐类型**  |
| ------------------------------ | ------------- |
| 多线程环境下字符串频繁拼接     | StringBuffer  |
| 单线程环境下字符串频繁拼接     | StringBuilder |
| 字符串内容不会变（常量、配置） | String        |

### **✅ 6. 源码层面小结（JDK 8）**

- String：底层是 final char[] value（不可变）
- StringBuilder：继承自 AbstractStringBuilder，方法无锁
- StringBuffer：继承自 AbstractStringBuilder，方法有 synchronized