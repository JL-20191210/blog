# ☕Java 面试答题卡：最少知识原则（LoD）

------

## 🧠 原则简介

**最少知识原则（LoD，Law of Demeter）：**

> 一个对象应当对其他对象有尽可能少的了解，只与直接的“朋友”通信，避免与“陌生人”交互。
>  简单来说，就是“只和你的直接朋友说话，不和朋友的朋友说话”。

------

## ❌ 反例：违反最少知识原则

```java
class Engine {
    public void start() { /* 启动引擎 */ }
}

class Car {
    private Engine engine;

    public Engine getEngine() {
        return engine;
    }
}

class Driver {
    private Car car;

    public void drive() {
        car.getEngine().start();  // 直接调用“朋友的朋友”的方法，违反LoD
    }
}
```

- `Driver` 通过 `Car` 的 `getEngine()` 方法调用 `Engine` 的 `start()`，违反了最少知识原则。

------

## ✅ 正确做法：遵循最少知识原则

```java
class Engine {
    public void start() { /* 启动引擎 */ }
}

class Car {
    private Engine engine;

    public void startEngine() {
        engine.start();
    }
}

class Driver {
    private Car car;

    public void drive() {
        car.startEngine();  // 只和直接朋友Car通信，符合LoD
    }
}
```

- `Driver` 只和直接朋友 `Car` 交互，由 `Car` 负责调用 `Engine`，符合最少知识原则。

------

## 🔗 LoD 的好处

- 减少类之间的耦合，提高系统的模块性和可维护性。
- 降低修改影响范围，使代码更灵活。
- 提升代码的清晰度和可读性。

------

## 🗣 面试总结句式

> 最少知识原则强调“只与直接朋友通信”，避免“陌生人”，从而降低系统耦合度，提高代码的健壮性和可维护性，是设计高内聚、低耦合系统的重要指导原则。