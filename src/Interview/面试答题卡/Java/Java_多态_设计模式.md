# ☕Java 面试答题卡：Java 多态 + 设计模式

---

## 1️⃣ 多态基础概念

- **定义**：同一个方法调用，在运行时可表现为不同的行为。
- **实现方式**：继承/接口 + 方法重写 + 父类引用指向子类对象 + 动态绑定（虚方法表）。
- **解决的问题**：
  - 调用方式统一，行为多样
  - 实现开闭原则，增强扩展性
  - 降低耦合，提高代码复用

---

## 2️⃣ 多态与常见设计模式

| 设计模式       | 多态的体现方式                           | 关键词                    |
|----------------|------------------------------------------|---------------------------|
| 策略模式       | 一组算法实现同一接口，运行时动态替换      | interface + 多实现类      |
| 工厂模式       | 返回父类引用，实际是子类对象               | 多态返回值                |
| 模板方法模式   | 父类定义流程，子类重写细节步骤方法         | 抽象类 + 方法重写         |
| 状态模式       | 不同状态类实现同一接口，行为动态切换        | 上下文 + 多态             |
| 观察者模式     | 通知所有观察者，具体响应由各自决定          | 统一回调接口              |
| 责任链模式     | 各个处理器实现统一接口，动态传递处理请求    | next.handle()             |

---

## 3️⃣ 多态在 Spring 中的应用场景

- **多实现类 Bean 注入**：@Autowired + @Qualifier 或 `List<Interface>` 注入
- **策略模式场景**：如支付、消息推送，使用 ApplicationContext.getBeansOfType 结合接口实现
- **自动装配 + 接口扩展**：依赖注入只面向接口编程，Spring 自动注入最合适实现类
- **Controller 接口参数绑定的多态性**：通过继承/抽象类传参

---

## 4️⃣ 面试答题模板

### 常规结构：概念 + 问题 + 示例 + 总结

```
多态是 Java 的核心特性之一，主要解决的是调用方式统一、行为多样化的问题。
通过父类引用调用子类重写的方法，运行时动态决定行为，既保证了调用一致性，又提升了系统的扩展性。
在策略模式中，不同实现类实现相同接口，业务可根据需要动态切换策略，是典型的多态应用。
```
### 结尾总结句式：

> 多态不仅是面向对象的基础，更是众多设计模式落地的核心手段，使系统更灵活、更具维护性。
