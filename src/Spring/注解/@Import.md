# 🔍 `@Import` 注解详解

------

## 一、@Import 的作用

> **核心作用：**
>
> `@Import` 用于向 Spring 容器中 **导入一个或多个组件（Bean）**，这些组件会被注册到 Spring 的 `ApplicationContext` 中。

------

## 二、常见用法（支持 4 种类型）

| 类型                                      | 描述                                            |
| ----------------------------------------- | ----------------------------------------------- |
| 普通配置类 Class                          | 最常见，导入一个被 `@Configuration` 标注的类    |
| 实现 `ImportSelector` 的类                | 实现按条件动态返回需要注册的类名数组            |
| 实现 `DeferredImportSelector` 的类        | 更晚执行的 ImportSelector，用于自动配置场景     |
| 实现 `ImportBeanDefinitionRegistrar` 的类 | 可以手动注册 BeanDefinition，粒度最细，功能最强 |

------

## 三、基础用法示例

### ✅ 1. 导入配置类

```java
@Configuration
public class DataSourceConfig {
    @Bean
    public DataSource dataSource() {
        return new HikariDataSource();
    }
}
```

在主配置类中使用 `@Import`：

```java
@Configuration
@Import(DataSourceConfig.class)
public class MainConfig {
}
```

等效于手动注册 `DataSourceConfig` 中定义的所有 Bean。

------

### ✅ 2. 导入多个类

```java
@Import({DataSourceConfig.class, SecurityConfig.class})
```

支持批量导入。

------

## 四、ImportSelector 高级用法

```java
public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[] {
            "com.example.config.DataSourceConfig",
            "com.example.config.CacheConfig"
        };
    }
}
```

然后这样使用：

```java
@Import(MyImportSelector.class)
public class MainConfig { }
```

Spring 会把 `selectImports` 返回的类名当作配置类导入。

------

## 五、DeferredImportSelector（延迟导入）

延迟执行顺序更靠后，常用于 Spring Boot 的自动配置（如 `spring.factories` 加载的自动配置类）：

```java
public class MyDeferredImportSelector implements DeferredImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[]{"com.example.config.LateConfig"};
    }
}
```

------

## 六、ImportBeanDefinitionRegistrar（手动注册 Bean）

最强用法，可通过代码形式注册任意 Bean，灵活性最强。

```java
public class MyRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(
            AnnotationMetadata importingClassMetadata,
            BeanDefinitionRegistry registry) {

        RootBeanDefinition beanDef = new RootBeanDefinition(MyService.class);
        registry.registerBeanDefinition("myService", beanDef);
    }
}
@Import(MyRegistrar.class)
public class MainConfig { }
```

------

## 七、Spring Boot 自动配置为何也用它？

Spring Boot 的自动配置类，就是通过：

- `@EnableAutoConfiguration` → `@Import(AutoConfigurationImportSelector.class)`
- 利用 `ImportSelector` 动态导入配置类
- 再通过 `spring.factories` 加载配置类名列表

从而实现了“按需加载、自动装配”的强大能力。

------

## 八、使用场景总结

| 使用场景                            | 建议使用                          |
| ----------------------------------- | --------------------------------- |
| 将现有配置类导入到上下文中          | ✅                                 |
| 根据条件或逻辑动态决定导入哪些类    | ✅ `ImportSelector`                |
| 控制注册过程，精细定义 Bean 定义    | ✅ `ImportBeanDefinitionRegistrar` |
| 构建自己的注解组合元注解            | ✅                                 |
| 替代 `@ComponentScan`，提高加载粒度 | ✅                                 |

------

## 九、@Import 与其他注解关系

| 注解                     | 是否使用了 @Import | 说明                                            |
| ------------------------ | ------------------ | ----------------------------------------------- |
| `@EnableAsync`           | ✅                  | 导入了 `AsyncConfigurationSelector`             |
| `@EnableScheduling`      | ✅                  | 导入了 `SchedulingConfiguration`                |
| `@SpringBootApplication` | ✅ （间接）         | 含 `@EnableAutoConfiguration`，内部有 `@Import` |

------

## 十、总结

- `@Import` 是 Spring 中用于动态导入 Bean 的关键注解。
- 比 `@ComponentScan` 更灵活、粒度更细。
- 是 Spring Boot 自动装配机制的核心之一。
- 配合 `ImportSelector`、`ImportBeanDefinitionRegistrar` 可以实现高度可扩展的注册逻辑。