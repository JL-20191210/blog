# ☕ Java 面试答题卡：适配器模式（Adapter Pattern）详解

## ✅ 1. 什么是适配器模式？

> **适配器模式**是一种结构型设计模式，主要用于将一个类的接口转换成客户端所期望的另一个接口，从而实现**接口不兼容的类之间协同工作**。

通俗地说：**旧接口不能直接用？写个“转接头”适配上就能用了。**

------

## ✅ 2. 模式结构图

```
          ┌────────────┐
          │ Target     │<────────────┐
          │（期望接口）│              │
          └────────────┘              │
                 ▲                    │
                 │                    │
           ┌──────────┐         ┌────────────┐
           │ Adapter  │────────▶│ Adaptee    │
           │（适配器）│         │（被适配者）│
           └──────────┘         └────────────┘
```

------

## ✅ 3. 适配器模式的分类

| 方式           | 描述                                   | Java 实例                       |
| -------------- | -------------------------------------- | ------------------------------- |
| **类适配器**   | 使用继承的方式实现适配（单继承）       | 少用，适用于只需要适配一个类    |
| **对象适配器** | 使用组合方式适配（推荐）               | `InputStreamReader`、Spring AOP |
| **接口适配器** | 针对接口中方法太多，只需部分实现时使用 | `MouseAdapter`、`KeyAdapter` 等 |

------

## ✅ 4. 示例：对象适配器模式

### 背景：

我们已有一个 `V220Power` 提供 220V，但我们要使用 5V 接口（如手机充电器）。

### 代码实现：

```java
// 目标接口（客户希望的）
interface V5Power {
    int provide5V();
}

// 被适配者类（已有的）
class V220Power {
    public int provide220V() {
        return 220;
    }
}

// 适配器类
class PowerAdapter implements V5Power {
    private V220Power v220Power;

    public PowerAdapter(V220Power v220Power) {
        this.v220Power = v220Power;
    }

    @Override
    public int provide5V() {
        int power = v220Power.provide220V();
        // 模拟降压逻辑
        return power / 44;
    }
}
```

### 使用示例：

```java
public class TestAdapter {
    public static void main(String[] args) {
        V220Power power220 = new V220Power();
        V5Power adapter = new PowerAdapter(power220);
        System.out.println("输出电压: " + adapter.provide5V() + "V");
    }
}
```

------

## ✅ 5. Spring 中的适配器应用场景

| 场景                      | 描述                                       |
| ------------------------- | ------------------------------------------ |
| `HandlerAdapter`          | Spring MVC 请求处理适配器                  |
| `WebMvcConfigurerAdapter` | 简化配置类，用户只需实现感兴趣的方法       |
| `MethodAdapter`           | 将方法处理转换为统一调用入口               |
| `InputStreamReader`       | 把字节流 `InputStream` 转为字符流 `Reader` |

------

## ✅ 6. 适配器模式的优缺点

| 优点                                           | 缺点                                 |
| ---------------------------------------------- | ------------------------------------ |
| 解耦客户端与被适配类，提高复用性               | 类适配器受限于单继承                 |
| 增强已有类的功能，无需修改原有代码（开闭原则） | 增加代码结构复杂度                   |
| 提供灵活转换不同接口对象的能力                 | 有时会造成不必要的适配，带来维护成本 |

------

## ✅ 7. 面试答题模板（建议背诵）

> 适配器模式是一种结构型设计模式，用于将一个类的接口转换成客户端希望的接口，解决接口不兼容的问题。常见的实现方式有类适配器和对象适配器，Java 中 `InputStreamReader`、`HandlerAdapter` 都是典型应用。该模式遵循开闭原则，便于老代码复用和新功能适配.