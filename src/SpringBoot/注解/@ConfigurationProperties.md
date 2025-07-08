---
icon: fa-solid fa-hashtag
date: 2025-07-08
category:
  - SpringBoot
tag:
  - 注解
---
# @ConfigurationProperties

在 Spring Boot 项目中，配置文件（如 `application.properties` 或 `application.yml`）承载着大量环境和业务相关的参数。如何优雅、类型安全地将这些配置映射到 Java 对象中，成为每个开发者必须掌握的技能。`@ConfigurationProperties` 正是解决这一需求的利器。

本文将带你深入理解 `@ConfigurationProperties` 的原理、使用方法及最佳实践。

------

## 什么是 @ConfigurationProperties？

`@ConfigurationProperties` 是 Spring Boot 提供的一个注解，用于将配置文件中的属性按前缀绑定到 Java POJO 类的字段上。它支持：

- 结构化的配置映射，支持复杂嵌套对象和集合类型
- 自动类型转换，避免手动解析
- 结合校验框架，保证配置有效性
- 减少硬编码，提升项目可维护性

------

## 1. 基本使用示例

假设我们在 `application.yml` 中有如下配置：

```yaml
app:
  name: MyApplication
  timeout: 3000
```

我们定义对应的配置类：

```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String name;
    private int timeout;

    // getter & setter
}
```

Spring Boot 会自动将 `app.name` 和 `app.timeout` 映射到对应字段。

然后我们可以在其他组件中通过注入 `AppProperties` 使用这些配置：

```java
@Autowired
private AppProperties appProperties;

public void printConfig() {
    System.out.println("App name: " + appProperties.getName());
}
```

------

## 2. 支持复杂类型绑定

除了简单属性，`@ConfigurationProperties` 还能绑定集合和嵌套对象：

```yaml
app:
  servers:
    - server1
    - server2
  security:
    username: admin
    password: secret
```

对应配置类：

```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private List<String> servers;
    private Security security;

    public static class Security {
        private String username;
        private String password;
        // getter & setter
    }
    // getter & setter
}
```

------

## 3. 校验配置有效性

通过结合 `@Validated` 和 JSR-303 注解，可以在启动时自动校验配置：

```java
@Component
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {

    @NotBlank
    private String name;

    @Min(1000)
    private int timeout;

    // getter & setter
}
```

如果配置不满足条件，应用启动时将抛出异常，避免运行时错误。

------

## 4. 注册配置类的多种方式

- **@Component + @ConfigurationProperties**
   直接让配置类成为 Spring Bean。

  ```java
  @Component
  @ConfigurationProperties(prefix = "app")
  public class AppProperties {}
  ```

- **@EnableConfigurationProperties**
   在某个配置类或启动类上添加：

  ```java
  @SpringBootApplication
  @EnableConfigurationProperties(AppProperties.class)  // 启用绑定
  public class DemoApplication {
      public static void main(String[] args) {
          SpringApplication.run(DemoApplication.class, args);
      }
  }
  ```

  适合不想给配置类加 `@Component` 时使用。

------

## 5. 与 @Value 的区别

| 方面     | @Value         | @ConfigurationProperties   |
| -------- | -------------- | -------------------------- |
| 绑定方式 | 单个配置项     | 批量绑定，支持结构化       |
| 类型安全 | 需要手动转换   | 自动转换，类型安全         |
| 适用场景 | 简单、零散配置 | 复杂配置，尤其是结构化配置 |

------

## 总结

`@ConfigurationProperties` 是管理 Spring Boot 配置的核心注解，能让你的配置更加规范、灵活且安全。合理利用它，可以极大提升项目的可维护性和健壮性。

------

### 参考文档

- [Spring Boot 官方文档 - Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config)
- [Spring Boot @ConfigurationProperties 源码解析](https://www.baeldung.com/configuration-properties-in-spring-boot)