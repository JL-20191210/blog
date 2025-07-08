---
icon: fa-solid fa-hashtag
date: 2025-07-08
category:
  - SpringBoot
tag:
  - 注解
---
# `@EnableConfigurationProperties` 

## 一、简介

`@EnableConfigurationProperties` 是 Spring Boot 提供的注解，用于**手动注册使用 `@ConfigurationProperties` 注解的配置类**到 Spring 容器中。

> **作用：**
>
> - 让 `@ConfigurationProperties` 注解的类生效并被注入为 Bean。
> - 可替代在配置类上加 `@Component` 的方式。

------

## 二、为什么需要它？

在使用 `@ConfigurationProperties` 时，有两种方式使配置类生效：

### ✅ 方式一：加 `@Component`（自动注册为 Bean）

```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties { ... }
```

但这种方式耦合了 Spring 扫描机制，不适合：

- 将配置类放到 **非组件扫描路径下**
- 想让配置类保持 **纯粹的 POJO**，不带 Spring 注解

### ✅ 方式二：使用 `@EnableConfigurationProperties` 显式注册

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties { ... }
```

然后在主配置类或启动类上启用：

```java
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class Application { ... }
```

这样也能让 `AppProperties` 成为 Spring Bean。

------

## 三、使用方式详解

### ✅ 1. 配置类定义（不加 @Component）

```java
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int timeout;

    // getters and setters
}
```

### ✅ 2. 在启动类或配置类中启用绑定

```java
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

------

## 四、底层原理简析

`@EnableConfigurationProperties` 的底层使用了 Spring Boot 的条件配置机制，核心逻辑：

1. 会将传入的类注册为 Bean
2. 标记为 `@ConfigurationProperties` 的类会被绑定到配置文件的对应前缀
3. 不再依赖 `@Component` 注解，也不会被包扫描器控制

源码片段（来自 Spring Boot）：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import(EnableConfigurationPropertiesRegistrar.class)
public @interface EnableConfigurationProperties {
    Class<?>[] value() default {};
}
```

可见它通过导入一个注册器 `EnableConfigurationPropertiesRegistrar` 来实现手动注册逻辑。

------

## 五、适用场景

| 适用情况                     | 是否推荐使用 `@EnableConfigurationProperties` |
| ---------------------------- | --------------------------------------------- |
| 配置类在组件扫描路径下       | ❌ 可直接用 `@Component`                       |
| 配置类在非扫描包中           | ✅ 推荐                                        |
| 多个配置类集中注册           | ✅ 推荐                                        |
| 需要保持配置类为纯 Java Bean | ✅ 推荐                                        |

------

## 六、与 @ConfigurationProperties 的关系

| 注解                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `@ConfigurationProperties`       | 指定配置绑定的前缀，**负责属性绑定**          |
| `@EnableConfigurationProperties` | 将配置类注册为 Spring Bean，**负责注册 Bean** |

两者需要配合使用，缺一不可。

------

## 七、推荐用法（结合@Configuration）

```java
@Configuration
@EnableConfigurationProperties({AppProperties.class, DbProperties.class})
public class ConfigBinding {
    // 可以在这里注入使用 AppProperties
}
```

------

## 八、总结

- `@EnableConfigurationProperties` 用于手动注册配置类，避免必须加 `@Component`
- 推荐在 Spring Boot 启动类或配置类中集中启用配置类绑定
- 使用它能让配置类更干净、更解耦，适合组件库开发和公共配置模块