# Spring面试题及总结

## Spring IoC

### 什么是Spring IoC?

> - **IoC（Inversion of Control:控制反转）** 是一种设计思想，而不是一个具体的技术实现
>
> - IoC 的思想就是将原本在程序中手动创建对象的控制权，交由 Spring 框架来负责
> - 它是通过依赖注入实现的。
> - IoC容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件或注解即可，完全不用考虑对象是如何被创建出来的。 
> - IoC 容器实际上就是个 Map（key，value），Map 中存放的是各种对象。



**为什么叫控制反转？**

- **控制**：指的是对象创建（实例化、管理）的权力
- **反转**：控制权交给外部环境（Spring 框架、IoC 容器）

![IoC 图解](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/frc-365faceb5697f04f31399937c059c162.png)

---

### 什么是 Spring Bean？

> Bean 指的就是那些被 IoC 容器所管理的对象



我们需要告诉 IoC 容器帮助我们管理哪些对象，这个是通过配置元数据来定义的。配置元数据可以是 XML 文件、注解或者 Java 配置类。

```xml
<!-- Constructor-arg with 'value' attribute -->
<bean id="..." class="...">
   <constructor-arg value="..."/>
</bean>
```

下图简单地展示了 IoC 容器如何使用配置元数据来管理对象。

![](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/062b422bd7ac4d53afd28fb74b2bc94d.png)

`org.springframework.beans`和 `org.springframework.context` 这两个包是 IoC 实现的基础，如果想要研究 IoC 相关的源码的话，可以去看看

---

### 将一个类声明为 Bean 的注解有哪些?

- `@Component`：通用的注解，可标注任意类为 `Spring` 组件。如果一个 Bean 不知道属于哪个层，可以使用`@Component` 注解标注。
- `@Repository` : 对应持久层即 Dao 层，主要用于数据库相关操作。
- `@Service` : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- `@Controller` : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 `Service` 层返回数据给前端页面。

---

### @Component 和 @Bean 的区别是什么？

- `@Component` 用于类级别，而`@Bean`用于方法级别。
- `@Component` 更常用于**自动化的**、**基于注解的**配置，通常适用于希望 Spring 自动管理的类，尤其适合较简单的场景。
- `@Bean` 更多用于**手动配置**和**细粒度控制** Bean 的创建过程，通常用于 Java 配置类中显式注册 Bean。
- `@Bean` 注解比 `@Component` 注解的自定义性更强，而且很多地方我们只能通过 `@Bean` 注解来注册 bean。比如当我们引用第三方库中的类需要装配到 `Spring`容器时，则只能通过 `@Bean`来实现。



`@Bean`注解使用示例：

```java
@Configuration
public class AppConfig {
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }

}
```

上面的代码相当于下面的 xml 配置

```xml
<beans>
    <bean id="transferService" class="com.acme.TransferServiceImpl"/>
</beans>
```

下面这个例子是通过 `@Component` 无法实现的。`@Component` 注解的核心是 Spring 的自动装配，它会自动实例化这些类，且不支持像下述代码中的动态逻辑（即基于 `status` 选择不同的实现）。换句话说，`@Component` 不适合动态地选择不同的实现。

```java
@Bean
public OneService getService(status) {
    case (status)  {
        when 1:
                return new serviceImpl1();
        when 2:
                return new serviceImpl2();
        when 3:
                return new serviceImpl3();
    }
}
```

---

### 注入 Bean 的注解有哪些？

> - Spring 内置的 `@Autowired` 
> -  JDK 内置的 `@Resource` 和 `@Inject` 都可以用于注入 Bean
> - `@Autowired` 和`@Resource`使用的比较多一些



| Annotation   | Package                            | Source       |
| ------------ | ---------------------------------- | ------------ |
| `@Autowired` | `org.springframework.bean.factory` | Spring 2.5+  |
| `@Resource`  | `javax.annotation`                 | Java JSR-250 |
| `@Inject`    | `javax.inject`                     | Java JSR-330 |

---

### @Autowired 和 @Resource 的区别是什么？

> [!note]
>
> - `@Autowired` 是 Spring 提供的注解，`@Resource` 是 JDK 提供的注解。
> - `Autowired` 默认的注入方式为`byType`（根据类型进行匹配），`@Resource`默认注入方式为 `byName`（根据名称进行匹配）。
> - 当一个接口存在多个实现类的情况下，`@Autowired` 和`@Resource`都需要通过名称才能正确匹配到对应的 Bean。`Autowired` 可以通过 `@Qualifier` 注解来显式指定名称，`@Resource`可以通过 `name` 属性来显式指定名称。
> - `@Autowired` 支持在**构造函数、方法、字段和参数**上使用。`@Resource` 主要用于**字段和方法**上的注入，不支持在构造函数或参数上使用。



`Autowired` 属于 Spring 内置的注解，默认的注入方式为`byType`（根据类型进行匹配），也就是说会优先根据接口类型去匹配并注入 Bean （接口的实现类）。

**这会有什么问题呢？** 当一个接口存在多个实现类的话，`byType`这种方式就无法正确注入对象了，因为这个时候 Spring 会同时找到多个满足条件的选择，默认情况下它自己不知道选择哪一个。

这种情况下，注入方式会变为 `byName`（根据名称进行匹配），这个名称通常就是类名（首字母小写）。就比如说下面代码中的 `smsService` 就是我这里所说的名称，这样应该比较好理解了吧。

```java
// smsService 就是我们上面所说的名称
@Autowired
private SmsService smsService;
```

举个例子，`SmsService` 接口有两个实现类: `SmsServiceImpl1`和 `SmsServiceImpl2`，且它们都已经被 Spring 容器所管理。

```java
// 报错，byName 和 byType 都无法匹配到 bean
@Autowired
private SmsService smsService;
// 正确注入 SmsServiceImpl1 对象对应的 bean
@Autowired
private SmsService smsServiceImpl1;
// 正确注入  SmsServiceImpl1 对象对应的 bean
// smsServiceImpl1 就是我们上面所说的名称
@Autowired
@Qualifier(value = "smsServiceImpl1")
private SmsService smsService;
```

我们还是建议通过 `@Qualifier` 注解来显式指定名称而不是依赖变量的名称。

`@Resource`属于 JDK 提供的注解，默认注入方式为 `byName`。如果无法通过名称匹配到对应的 Bean 的话，注入方式会变为`byType`。

`@Resource` 有两个比较重要且日常开发常用的属性：`name`（名称）、`type`（类型）。

```java
public @interface Resource {
    String name() default "";
    Class<?> type() default Object.class;
}
```

如果仅指定 `name` 属性则注入方式为`byName`，如果仅指定`type`属性则注入方式为`byType`，如果同时指定`name` 和`type`属性（不建议这么做）则注入方式为`byType`+`byName`。

```java
// 报错，byName 和 byType 都无法匹配到 bean
@Resource
private SmsService smsService;

// 正确注入 SmsServiceImpl1 对象对应的 bean
@Resource
private SmsService smsServiceImpl1;

// 正确注入 SmsServiceImpl1 对象对应的 bean（比较推荐这种方式）
@Resource(name = "smsServiceImpl1")
private SmsService smsService;
```

---

### @Qualifier注解有什么作用？

> [!note]
>
> @Qualifier注解的主要作用是在依赖注入时消除歧义。当一个类型有多个实现时，@Qualifier注解可以指定需要注入哪一个具体的Bean



例如，当Service有多个实现类的时候，可以通过@Qualifier指定名称选择对应的实现Bean

```java
@Component
public class client{
    private final Service service;

    @Autowired
    public client(@Qualifier("serviceImpl1")Service service){
        this.service = service;
    }
    
    public void dosomething(){
    	service.serve();
    }
}
```

---

### 注入Bean的方式有哪些？

> 1. **构造函数注入**：通过类的构造函数来注入依赖项
> 1. **Setter 注入**：通过类的 Setter 方法来注入依赖项
> 1. **Field（字段） 注入**： 通过`@Autowired` 或 `@Resource`来标记字段
> 1. **方法注入：** 通过`@Autowired` 或 `@Resource`来标记方法



构造函数注入示例：

```java
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Setter 注入示例：

```java
@Service
public class UserService {

    private UserRepository userRepository;

    // 在 Spring 4.3 及以后的版本，特定情况下 @Autowired 可以省略不写
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Field 注入示例：

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //...
}
```

---

### 构造函数注入还是 Setter 注入？

> **Spring 官方推荐构造函数注入**，因为它提供了一些显著的优势，主要包括：
>
> 1. **依赖完整性**：构造函数注入确保在对象创建时，所有必需的依赖项都已注入，避免了空指针异常的风险。
> 2. **不可变性**：通过构造函数注入，可以将依赖项设置为不可变的，这有助于创建线程安全的对象。
> 3. **初始化保证**：构造函数注入确保对象在使用之前已经完全初始化，这减少了因未初始化依赖项而导致的潜在错误。
> 4. **测试便利性**：构造函数注入非常适合单元测试。你可以直接通过构造函数传入模拟的依赖项，而不需要依赖 Spring 容器来进行注入。
>
> **构造函数注入**：推荐用于**必需**的依赖项，具有确保对象完整性、线程安全性、初始化保障等优点。
>
> **Setter 注入**：适用于**可选**依赖项，适合需要动态配置或可以为空的场景。

---

### Bean 的作用域有哪些?

> - **单例作用域（Singleton Scope）** : IoC 容器中只有唯一的 bean 实例。Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。
> - **原型作用域（Prototype Scope）** : 每次请求都会创建一个新的 bean 实例。每个请求都返回一个新的实例，适用于需要多个独立对象的场景。
> - **请求作用域（Request Scope）** : 每个 HTTP 请求都会创建一个新的 bean 实例，并在请求结束时销毁。通常用于 Web 应用中，每个请求需要独立处理的 Bean。
> - **会话作用域（Session Scope）** : 每个 HTTP 会话（浏览器会话）都会创建一个新的 bean 实例。适用于 Web 应用中，跨多个请求保存状态的 Bean，如用户会话信息等。
> - **全局应用作用域（Application Scope）** : Spring 应用上下文中只有一个实例，整个应用范围内共享该 Bean。类似于单例，但作用范围为整个应用。
> - **自定义作用域（Custom Scope）** : 开发者可以创建自定义的作用域，满足特定需求。通过实现 `Scope` 接口和注册到 Spring 容器中来定义 Bean 的生命周期。



| 作用域           | 描述                               | 生命周期                       | 线程安全 | 适用场景                         |
| ---------------- | ---------------------------------- | ------------------------------ | -------- | -------------------------------- |
| **Singleton**    | 默认作用域，一个实例，整个应用共享 | 容器创建时创建，容器销毁时销毁 | 否       | 应用全局共享的 Bean              |
| **Prototype**    | 每次请求一个新实例                 | 每次请求时创建                 | 是       | 每次需要独立实例的场景           |
| **Request**      | 与 HTTP 请求绑定，每个请求一个实例 | 请求结束时销毁                 | 是       | Web 应用中的请求级别数据         |
| **Session**      | 与 HTTP 会话绑定，每个会话一个实例 | 会话结束时销毁                 | 是       | Web 应用中会话级别的数据         |
| **Application**  | 在整个应用上下文共享一个实例       | 应用上下文销毁时销毁           | 否       | 整个应用范围内共享的 Bean        |
| **自定义作用域** | 用户定义的特殊作用域               | 按照定义的规则创建和销毁       | 根据实现 | 特殊的需求，默认作用域无法满足时 |

**如何配置 bean 的作用域呢？**

xml 方式：

```xml
<bean id="..." class="..." scope="singleton"></bean>
```

注解方式：

```java
@Bean
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public Person personPrototype() {
    return new Person();
}
```

---

### Bean 是线程安全的吗？

> **Spring Bean** 是否线程安全，取决于 **Bean** 的作用域和实现方式。
>
> **单例作用域**的 Bean **通常不是线程安全的**。默认情况下，Spring 的 Bean 是单例的，即 Spring 容器中每个 Bean 只有一个实例。
>
> **原型作用域**的 Bean 本身是线程安全的，因为每次请求都会产生一个新的实例。
>
> 对于**请求作用域**、**会话作用域**等，Spring 会为每个线程或请求提供独立的实例，通常也可以认为是线程安全的，但需要留意外部共享资源的访问。



---

#### 1. Singleton 作用域与线程安全问题

在 Spring 中，**Singleton 作用域**下，IoC 容器只会创建一个 Bean 实例。虽然这使得资源的使用更为高效，但如果这个 Bean 是**有状态**的，那么就可能会存在**线程安全问题**。

##### 有状态 Bean

**有状态 Bean**是指那些包含可变成员变量的对象，因为它们的状态可以在多个线程中共享，这可能导致资源竞争或数据不一致的问题。

##### 有状态 Bean 示例：

```java
// 定义了一个购物车类，其中包含一个保存用户购物车中商品的 List
@Component
public class ShoppingCart {
    private List<String> items = new ArrayList<>();

    public void addItem(String item) {
        items.add(item);
    }

    public List<String> getItems() {
        return items;
    }
}
```

在这个示例中，`ShoppingCart` 类包含一个可变的成员变量 `items`，因此它是有状态的。如果多个线程同时访问这个 Bean，就可能导致线程安全问题。

##### 无状态 Bean

大部分 Bean 实际上是无状态的（即没有可变的成员变量）。例如，**Dao** 或 **Service** 类通常不包含任何改变对象状态的操作，这使得它们本身是线程安全的。

##### 无状态 Bean 示例：

```java
// 定义一个用户服务类，它仅包含业务逻辑而不保存任何状态。
@Component
public class UserService {

    public User findUserById(Long id) {
        // 业务逻辑
    }
    // 其他方法...
}
```

#### 2. 有状态单例 Bean 的线程安全问题解决方案

对于有状态的单例 Bean，线程安全问题可以通过以下三种常见方法来解决：

1. **避免可变成员变量**：将 Bean 设计为无状态。无状态 Bean 本身是线程安全的，因此这是最简单的解决办法。
2. **使用 `ThreadLocal`**：将每个线程的状态信息保存在 `ThreadLocal` 中，确保每个线程有独立的变量副本。
3. **使用同步机制**：通过 `synchronized` 或 `ReentrantLock` 等同步机制来控制线程对共享资源的访问，确保线程安全。

##### 使用 `ThreadLocal` 的示例

`ThreadLocal` 可以确保每个线程都拥有自己独立的变量副本，从而避免线程间的竞争。以下是一个使用 `ThreadLocal` 存储用户登录信息的例子：

```java
public class UserThreadLocal {

    private UserThreadLocal() {}

    private static final ThreadLocal<SysUser> LOCAL = ThreadLocal.withInitial(() -> null);

    public static void put(SysUser sysUser) {
        LOCAL.set(sysUser);
    }

    public static SysUser get() {
        return LOCAL.get();
    }

    public static void remove() {
        LOCAL.remove();
    }
}
```

在这个示例中，`ThreadLocal` 用于为每个线程存储一个独立的 `SysUser` 对象。这样，即使多个线程同时访问该 Bean，它们也不会互相影响，从而避免了线程安全问题。

---

### TODO:说下Spring Bean的生命周期？

> 1. **创建 Bean 的实例**：Bean 容器首先会找到配置文件中的 Bean 定义，然后使用 Java 反射 API 来创建 Bean 的实例。
> 2. **Bean 属性赋值/填充**：为 Bean 设置相关属性和依赖，例如`@Autowired` 等注解注入的对象、`@Value` 注入的值、`setter`方法或构造函数注入依赖和值、`@Resource`注入的各种资源。
> 3. **Bean 初始化**：
>    - 如果 Bean 实现了 `BeanNameAware` 接口，调用 `setBeanName()`方法，传入 Bean 的名字。
>    - 如果 Bean 实现了 `BeanClassLoaderAware` 接口，调用 `setBeanClassLoader()`方法，传入 `ClassLoader`对象的实例。
>    - 如果 Bean 实现了 `BeanFactoryAware` 接口，调用 `setBeanFactory()`方法，传入 `BeanFactory`对象的实例。
>    - 与上面的类似，如果实现了其他 `*.Aware`接口，就调用相应的方法。
>    - 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行`postProcessBeforeInitialization()` 方法
>    - 如果 Bean 实现了`InitializingBean`接口，执行`afterPropertiesSet()`方法。
>    - 如果 Bean 在配置文件中的定义包含 `init-method` 属性，执行指定的方法。
>    - 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行`postProcessAfterInitialization()` 方法。
> 4. **销毁 Bean**：销毁并不是说要立马把 Bean 给销毁掉，而是把 Bean 的销毁方法先记录下来，将来需要销毁 Bean 或者销毁容器的时候，就调用这些方法去释放 Bean 所持有的资源。
>    - 如果 Bean 实现了 `DisposableBean` 接口，执行 `destroy()` 方法。
>    - 如果 Bean 在配置文件中的定义包含 `destroy-method` 属性，执行指定的 Bean 销毁方法。或者，也可以直接通过`@PreDestroy` 注解标记 Bean 销毁之前执行的方法。



`AbstractAutowireCapableBeanFactory` 的 `doCreateBean()` 方法中能看到依次执行了这 4 个阶段：

```java
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
    throws BeanCreationException {

    // 1. 创建 Bean 的实例
    BeanWrapper instanceWrapper = null;
    if (instanceWrapper == null) {
        instanceWrapper = createBeanInstance(beanName, mbd, args);
    }

    Object exposedObject = bean;
    try {
        // 2. Bean 属性赋值/填充
        populateBean(beanName, mbd, instanceWrapper);
        // 3. Bean 初始化
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }

    // 4. 销毁 Bean-注册回调接口
    try {
        registerDisposableBeanIfNecessary(beanName, bean, mbd);
    }

    return exposedObject;
}
```

`Aware` 接口能让 Bean 能拿到 Spring 容器资源。

Spring 中提供的 `Aware` 接口主要有：

1. `BeanNameAware`：注入当前 bean 对应 beanName；
2. `BeanClassLoaderAware`：注入加载当前 bean 的 ClassLoader；
3. `BeanFactoryAware`：注入当前 `BeanFactory` 容器的引用。

`BeanPostProcessor` 接口是 Spring 为修改 Bean 提供的强大扩展点。

```java
public interface BeanPostProcessor {

	// 初始化前置处理
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	// 初始化后置处理
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```

- `postProcessBeforeInitialization`：Bean 实例化、属性注入完成后，`InitializingBean#afterPropertiesSet`方法以及自定义的 `init-method` 方法之前执行；
- `postProcessAfterInitialization`：类似于上面，不过是在 `InitializingBean#afterPropertiesSet`方法以及自定义的 `init-method` 方法之后执行。

`InitializingBean` 和 `init-method` 是 Spring 为 Bean 初始化提供的扩展点。

```java
public interface InitializingBean {
 // 初始化逻辑
	void afterPropertiesSet() throws Exception;
}
```

指定 `init-method` 方法，指定初始化方法：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="demo" class="com.chaycao.Demo" init-method="init()"/>

</beans>
```

**如何记忆呢？**

1. 整体上可以简单分为四步：实例化 —> 属性赋值 —> 初始化 —> 销毁。
2. 初始化这一步涉及到的步骤比较多，包含 `Aware` 接口的依赖注入、`BeanPostProcessor` 在初始化前后的处理以及 `InitializingBean` 和 `init-method` 的初始化操作。
3. 销毁这一步会注册相关销毁回调接口，最后通过`DisposableBean` 和 `destory-method` 进行销毁。

最后，再分享一张清晰的图解（图源：[如何记忆 Spring Bean 的生命周期](https://chaycao.github.io/2020/02/15/如何记忆Spring-Bean的生命周期.html)）。

![](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/spring-bean-lifestyle.png)

