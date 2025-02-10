---
icon: fa-brands fa-java
date: 2025-02-10
category:
  - Java
tag:
  - 反射
---
# getMethods()和getDeclaredMethods()的区别

> `getMethods()` 和 `getDeclaredMethods()` 都是 Java 反射中 `Class` 类的方法，用于获取类中定义的方法。它们之间的主要区别在于**访问权限**和**方法范围**。下面是它们的区别详细解释：

<!-- more -->
### 1. `getMethods()`
- **返回值**：返回的是 **所有** 公共（`public`）方法，包括：
  - **类自身**定义的公共方法。
  - **继承自父类的公共方法**。
  - **接口定义的公共方法**（如果类实现了接口）。
- **访问权限**：只包含 `public` 修饰符的方法，不会返回类中的 `private`、`protected` 或默认访问修饰符（包内可见）的方法。
- **方法范围**：会返回从类的继承链（父类、接口）中继承来的公共方法。

#### 示例：
```java
class Parent {
    public void publicMethod() {}
    private void privateMethod() {}
}

class Child extends Parent {
    public void childMethod() {}
}

Class<?> clazz = Child.class;
Method[] methods = clazz.getMethods();  
// 返回publicMethod()、childMethod() 和继承的public方法
// 不包括privateMethod()，因为它是私有方法
```

### 2. `getDeclaredMethods()`
- **返回值**：返回的是 **类自身** 所有的声明方法，包括：
  - **公共方法**（`public`）。
  - **私有方法**（`private`）。
  - **受保护的方法**（`protected`）。
  - **默认访问修饰符（包内可见）的方法**。
- **访问权限**：不会返回继承自父类或实现的接口中的方法，只返回当前类中声明的方法，**包括私有方法**。如果需要访问私有方法，你可以使用 `setAccessible(true)`。
- **方法范围**：只包括当前类中定义的方法，不会包含继承自父类或者实现自接口的方法。

#### 示例：
```java
class Parent {
    public void publicMethod() {}
    private void privateMethod() {}
}

class Child extends Parent {
    public void childMethod() {}
}

Class<?> clazz = Child.class;
Method[] methods = clazz.getDeclaredMethods();  
// 返回childMethod()、publicMethod()、privateMethod() 
// 不包括继承自父类的publicMethod()，如果是private方法也能返回
```



<Badge text="important" type="important" /> 

### 总结：

- **`getMethods()`**：返回类的所有 **公共** 方法，包括继承的公共方法。
- **`getDeclaredMethods()`**：返回类中 **所有声明** 的方法（包括 `public`、`private`、`protected` 和默认访问），不包括继承的父类或接口中的方法。

选择使用哪个方法，取决于你需要访问的方法的范围：
- 如果只关心类的公共方法以及从父类或接口继承的公共方法，使用 `getMethods()`。
- 如果需要访问类中所有声明的方法（包括私有方法），使用 `getDeclaredMethods()`。