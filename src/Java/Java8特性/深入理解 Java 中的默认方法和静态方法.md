---
icon: pen-to-square
date: 2024-10-17
category:
  - Java
tag:
  - Java8特性
---

# 深入理解 Java 中的默认方法和静态方法
>OS：默认方法就是给原来抽象的方法写一个默认实现，类似默认值。静态方法不依赖接口实例及其参数，之际使用`接口名.方法名`的方式使用，适用于写工具方法

<!-- more -->
#### 一、默认方法

>**默认方法**（Default Method）是指在接口中定义的带有 `default` 关键字的方法，它允许接口提供一个默认实现。在此之前，接口中只能声明抽象方法，而具体的实现必须在实现类中提供。如果接口需要新增方法，所有实现该接口的类都必须实现这个新方法，这对接口的扩展带来了很大限制。

>**引入默认方法的原因**
>- **接口的向后兼容性**：当需要在已有接口中添加新方法时，默认方法可以提供默认实现，避免了破坏已有实现的兼容性。
>- **代码重用**：默认方法允许在接口中提供通用的实现，从而减少代码重复。

**语法**：

```java
public interface MyInterface {
    // 默认方法
    default void defaultMethod() {
        System.out.println("This is a default method in the interface.");
    }
}
```

**使用实例**：

```java
public interface Vehicle {
    default void start() {
        System.out.println("Vehicle is starting");
    }
}

public class Car implements Vehicle {
    // Car类可以选择不重写start方法，直接使用接口中的默认实现
}

public class Bike implements Vehicle {
    @Override
    public void start() {
        System.out.println("Bike is starting");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle car = new Car();
        car.start(); // 输出: Vehicle is starting

        Vehicle bike = new Bike();
        bike.start(); // 输出: Bike is starting
    }
}
```

在上面的例子中，`Car` 类使用了接口中的默认实现，而 `Bike` 类则重写了默认方法。

**注意事项**：

1. **冲突解决**：如果一个类同时实现了多个包含相同默认方法的接口，必须重写该方法来解决冲突。

```java
public interface InterfaceA {
    default void show() {
        System.out.println("Interface A");
    }
}

public interface InterfaceB {
    default void show() {
        System.out.println("Interface B");
    }
}

public class MyClass implements InterfaceA, InterfaceB {
    @Override
    public void show() {
        System.out.println("My own implementation");
    }
}
```

1. **覆盖默认方法**：实现类可以选择覆盖接口中的默认方法。

#### 二、静态方法

**静态方法**（Static Method）是在接口中使用 `static` 关键字定义的方法。与类中的静态方法类似，接口中的静态方法可以直接通过接口名调用，而不需要通过实现类的对象。

**引入静态方法的原因**：

- **工具方法**：静态方法通常用于提供一些通用的工具方法，这些方法与接口的状态无关，可以独立使用。
- **代码组织**：将相关的工具方法组织到接口中，使得接口更具有内聚性。

**语法**：

```java
public interface MyInterface {
    // 静态方法
    static void staticMethod() {
        System.out.println("This is a static method in the interface.");
    }
}
```

**使用实例**：

```java
public interface MathOperations {
    static int add(int a, int b) {
        return a + b;
    }

    static int subtract(int a, int b) {
        return a - b;
    }
}

public class Main {
    public static void main(String[] args) {
        int result1 = MathOperations.add(5, 3); // 调用接口的静态方法
        System.out.println("Addition: " + result1); // 输出: Addition: 8

        int result2 = MathOperations.subtract(5, 3);
        System.out.println("Subtraction: " + result2); // 输出: Subtraction: 2
    }
}
```

**注意事项**：

1. **不能被实现类重写**：接口中的静态方法属于接口本身，不能被实现类重写或继承。
2. **通过接口名调用**：静态方法只能通过接口名直接调用，不能通过接口的实现类或实例调用。

```java
MyInterface.staticMethod(); // 正确
MyClass.staticMethod(); // 错误
```

