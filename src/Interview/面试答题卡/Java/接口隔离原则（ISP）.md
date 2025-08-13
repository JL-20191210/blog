# ☕Java 面试答题卡：接口隔离原则（ISP）

---

## 🧠 原则简介

**接口隔离原则（ISP，Interface Segregation Principle）：**  

> 客户端不应该依赖它不需要的接口，即接口应该“小而专”，避免设计“胖接口”。

---

## ❌ 反例：胖接口导致问题

```java
interface IWorker {
    void work();
    void eat();
    void sleep();
}

class RobotWorker implements IWorker {
    @Override
    public void work() { /* 实现工作 */ }

    @Override
    public void eat() {
        throw new UnsupportedOperationException("机器人不需要吃饭");
    }

    @Override
    public void sleep() {
        throw new UnsupportedOperationException("机器人不需要睡觉");
    }
}
```

- 机器人被迫依赖它不需要的方法，违背接口隔离原则。

------

## ✅ 正确做法：拆分接口

```java
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class RobotWorker implements Workable {
    @Override
    public void work() { /* 实现工作 */ }
}

class HumanWorker implements Workable, Eatable, Sleepable {
    @Override public void work() { /* 实现工作 */ }
    @Override public void eat() { /* 实现吃饭 */ }
    @Override public void sleep() { /* 实现睡觉 */ }
}
```

- 客户端只依赖自己需要的接口，职责单一，耦合度低。

------

## 🔗 依赖注入与接口隔离

- 通过接口抽象，高层模块依赖接口而非具体实现；
- 使用依赖注入（DI）实现模块解耦和灵活替换；
- 配合 ISP 设计，让接口职责清晰，减少冗余依赖。

------

## 🗣 面试总结句式

> 接口隔离原则强调避免“胖接口”，通过拆分接口让客户端只依赖其关心的功能，从而提高系统的灵活性和可维护性。结合依赖注入，可以实现高内聚低耦合的模块设计。