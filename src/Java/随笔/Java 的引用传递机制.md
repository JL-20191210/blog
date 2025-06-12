# Java 的引用传递机制，以及四种引用类型对 GC 的影响

------

## 🌀 一、Java 是值传递还是引用传递？

这个问题常让人困惑——**Java 永远是值传递（pass by value）！**

### 👇 区分关键：

- 对于 **基本类型**，传的是值的副本（直接数据）。
- 对于 **引用类型**，传的是对象引用的副本（对象地址的拷贝）。

### ✍️ 示例说明：

```java
public void change(Person p) {
    p.name = "张三";     // 改变的是堆中对象的字段 ✅
    p = new Person();    // 改变的是引用本身 ❌（只在方法内有效）
    p.name = "李四";
}

Person person = new Person();
person.name = "原名";
change(person);
System.out.println(person.name); // 输出：张三
```

🔎 解释：

- `p.name = "张三"` 作用到了原对象。
- `p = new Person()` 只改变了 p 的地址副本，`person` 本身不受影响。

------

## 🌪️ 二、Java 中的四种引用类型（JDK 1.2 引入）

Java 的 `java.lang.ref` 包定义了四种引用类型，对象被 GC 的时机取决于引用的强弱程度：

| 引用类型   | 类名                  | 是否会阻止 GC      | 常用场景                                 |
| ---------- | --------------------- | ------------------ | ---------------------------------------- |
| **强引用** | 普通变量（默认）      | ✅ 是               | 常规对象                                 |
| **软引用** | `SoftReference<T>`    | ❌ 内存不足才回收   | 缓存，如图片缓存、对象池                 |
| **弱引用** | `WeakReference<T>`    | ❌ 下一次 GC 即回收 | ThreadLocal、Map key 等                  |
| **虚引用** | `PhantomReference<T>` | ❌ 不可访问         | 与 `ReferenceQueue` 配合，做资源回收监控 |

------

### ✅ 强引用（Strong Reference）—— 默认的引用类型

```java
Person p = new Person();
```

- 只要有强引用指向对象，它就**绝不会被回收**。

------

### ✅ 软引用（Soft Reference）

```java
SoftReference<Person> sr = new SoftReference<>(new Person());
```

- 如果内存不足，GC 会尝试回收软引用指向的对象。
- 常用于**缓存机制**（如图片缓存、网页缓存）。

------

### ✅ 弱引用（Weak Reference）

```java
WeakReference<Person> wr = new WeakReference<>(new Person());
```

- **下一次 GC 就会回收**（即使内存足够）。
- 用于内存敏感场景，如：
  - `ThreadLocalMap` 中的 key
  - 防止内存泄漏

------

### ✅ 虚引用（Phantom Reference）

```java
ReferenceQueue<Person> queue = new ReferenceQueue<>();
PhantomReference<Person> pr = new PhantomReference<>(new Person(), queue);
```

- 对象无法通过虚引用获取（`get()` 总是返回 null）。
- 常用于**对象回收后清理资源**，类似 C++ 的析构器。

------

## 🚀 三、GC Roots 的判定标准（决定对象是否存活）

以下对象被视为 GC Roots，只有 **没有任何 GC Root 引用路径的对象** 才可能被回收：

- 当前线程栈中的引用（局部变量）
- 静态字段引用（类加载器相关）
- JNI（本地代码）中的引用
- 活跃线程引用

------

## 🧠 总结图示（引用强度对 GC 的影响）

```
引用强度:   强 > 软 > 弱 > 虚
回收时机:   不回收 > 内存紧张时 > 下一次GC > 到达ReferenceQueue
```

------

## 📌 实战应用建议

| 应用场景                   | 建议使用引用类型  |
| -------------------------- | ----------------- |
| 对象绝不能被回收           | 强引用（默认）    |
| 内存充足时可用，不足时回收 | 软引用            |
| 需要防止内存泄漏           | 弱引用            |
| 需要监控对象是否被回收     | 虚引用 + 引用队列 |

