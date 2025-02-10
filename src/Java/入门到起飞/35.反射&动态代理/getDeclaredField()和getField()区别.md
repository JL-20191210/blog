---
icon: fa-brands fa-java
date: 2025-02-10
category:
  - Java
tag:
  - 反射
---
# getDeclaredField()和getField()区别

在 **反射机制** 中，它们的区别在于可以访问的字段类型和访问权限。具体区别如下：

<!-- more -->
### 1. `clazz.getDeclaredField("name")`
- **访问权限**：`getDeclaredField()` 方法返回类中的所有字段，不管它们的访问修饰符是 `public`、`private`、`protected`，还是默认访问修饰符（包内可见）。
- **字段访问修饰符**：你可以使用 `getDeclaredField()` 获取私有字段（`private`）、受保护字段（`protected`）以及公共字段（`public`）。
- **需要反射访问私有字段**：对于私有字段，虽然 `getDeclaredField()` 可以返回它们，但你需要使用 `field.setAccessible(true)` 来绕过 Java 的访问控制（默认情况下，`private` 和 `protected` 字段是不可访问的）。
  
#### 示例：
```java
class Person {
    public String name;
    private int age;
}

Class<?> clazz = Person.class;
Field publicField = clazz.getDeclaredField("name");  // 访问public字段
Field privateField = clazz.getDeclaredField("age");  // 访问private字段

// 访问私有字段时，需要设置为可访问
privateField.setAccessible(true);
```

### 2. `clazz.getField("name")`
- **访问权限**：`getField()` 方法**只能访问**公共字段（`public` 修饰的字段）。
- **字段访问修饰符**：如果该字段是 `private`、`protected` 或者包内可见的（即没有显式声明访问修饰符），`getField()` 将会抛出 `NoSuchFieldException` 异常。它只能获取 `public` 修饰的字段。
- **无需反射访问私有字段**：`getField()` 不会处理私有字段，无法访问非 `public` 的字段。

#### 示例：
```java
class Person {
    public String name;
    private int age;
}

Class<?> clazz = Person.class;
Field publicField = clazz.getField("name");  // 访问public字段

// 以下会抛出NoSuchFieldException，因为age是private
Field privateField = clazz.getField("age");  // 会抛出异常
```

### 总结：
- **`getDeclaredField("name")`** 可以访问**所有字段**，包括 `private`、`protected`、`public` 字段，需要使用 `setAccessible(true)` 来访问私有字段。
- **`getField("name")`** 只能访问**`public`** 字段，且如果字段不是 `public`，会抛出 `NoSuchFieldException` 异常。

因此，选择使用哪个方法取决于你的需求：
- 如果你需要访问所有字段（包括私有字段），使用 `getDeclaredField()`。
- 如果你只关心公共字段，可以使用 `getField()`。
