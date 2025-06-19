# ☕ Java 面试答题卡：代理模式（Proxy Pattern）详解

## ✅ 1. 什么是代理模式？

> **代理模式**是一种结构型设计模式，它为其他对象提供一种**代理以控制对这个对象的访问**。

简单说，代理对象在真实对象前起一个“中介”的作用，用于控制、增强或延迟对真实对象的访问。

------

## ✅ 2. 模式结构图

```java
Client → Proxy → RealSubject
```

- **Subject（抽象主题）**：接口或抽象类
- **RealSubject（真实对象）**：业务逻辑的核心
- **Proxy（代理对象）**：持有真实对象的引用，控制访问

------

## ✅ 3. 代理模式分类

| 类型              | 描述                               | 示例应用                           |
| ----------------- | ---------------------------------- | ---------------------------------- |
| 静态代理          | 编译期生成代理类，代码固定         | 日志打印、安全检查                 |
| 动态代理（JDK）   | 运行时通过反射生成实现接口的代理类 | Spring AOP 接口代理                |
| 动态代理（CGLIB） | 运行时创建子类，无需实现接口       | Spring AOP 类代理（如 Controller） |
| 虚拟代理          | 延迟初始化资源（如图片加载）       | 图片浏览器懒加载                   |
| 安全代理          | 控制权限访问                       | 登录权限拦截                       |
| 远程代理（RPC）   | 客户端通过代理调用远程服务         | RMI、Dubbo、Feign                  |
| 缓存代理          | 为调用结果加缓存                   | 缓存层封装                         |

------

## ✅ 4. 静态代理代码示例（面试必备）

```java
// 1. 抽象主题
interface Service {
    void doWork();
}

// 2. 真实对象
class RealService implements Service {
    public void doWork() {
        System.out.println("真实业务逻辑执行...");
    }
}

// 3. 代理对象
class ServiceProxy implements Service {
    private RealService realService = new RealService();

    public void doWork() {
        System.out.println("前置操作：权限校验、日志");
        realService.doWork();
        System.out.println("后置操作：记录日志");
    }
}
```

------

## ✅ 5. 动态代理（JDK）示例

```java
import java.lang.reflect.*;

interface Hello {
    void say(String name);
}

class HelloImpl implements Hello {
    public void say(String name) {
        System.out.println("Hello, " + name);
    }
}

class ProxyFactory {
    public static Hello getProxy(Hello target) {
        return (Hello) Proxy.newProxyInstance(
            target.getClass().getClassLoader(),
            target.getClass().getInterfaces(),
            (proxy, method, args) -> {
                System.out.println("日志开始");
                Object result = method.invoke(target, args);
                System.out.println("日志结束");
                return result;
            }
        );
    }
}

// 使用
Hello proxy = ProxyFactory.getProxy(new HelloImpl());
proxy.say("Java");
```

------

## ✅ 6. JDK vs CGLIB 区别

| 项目         | JDK 动态代理              | CGLIB 动态代理 |
| ------------ | ------------------------- | -------------- |
| 基于         | 接口                      | 类字节码生成   |
| 是否要求接口 | 是                        | 否             |
| 底层         | `java.lang.reflect.Proxy` | ASM 字节码操作 |
| Spring 默认  | 接口用 JDK，类用 CGLIB    |                |

------

## ✅ 7. 代理模式应用场景

- 安全控制（权限验证）
- 缓存优化（如缓存结果）
- 延迟加载（如大图片、资源）
- 日志记录、性能监控（AOP 实现）
- 远程访问（如 RPC 框架）
- 动态增强功能（如事务管理、数据统计）

------

## ✅ 8. 优缺点总结

| 优点                           | 缺点                                   |
| ------------------------------ | -------------------------------------- |
| 解耦真实对象和访问逻辑         | 增加系统复杂度                         |
| 可增强原有逻辑（如权限、缓存） | 多个代理类手动实现维护麻烦（静态代理） |
| 支持延迟加载、安全、远程等用途 | 需要一定的动态字节码生成技术支持       |

------

## 🎯 面试简答模板（可背）

> 代理模式是结构型设计模式，用于为真实对象提供一个代理控制访问，常用于权限控制、远程调用、缓存、AOP 等场景。Java 中支持静态代理和动态代理，Spring AOP 就是典型的代理应用，其中 JDK 代理用于接口，CGLIB 用于类代理。通过代理，我们可以在不修改原始类代码的前提下实现功能增强。