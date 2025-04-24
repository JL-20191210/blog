# Spring注解

## AOP

### @PropertySource

用于指定外部的配置文件路径，并将文件中的属性加载到 Spring 的 Environment 中，方便在应用程序中使用

### @Import

可以帮助你将多个配置类模块化地导入到一个主配置类中，避免单一配置类过于庞大

### @RunWith

`@RunWith` 的作用是为测试类指定一个自定义的 **Test Runner**，JUnit 默认使用的运行器`BlockJUnit4ClassRunner`，但可以通过 `@RunWith` 来指定其他的测试运行器

### @ContextConfiguration

`@ContextConfiguration` 是 Spring 测试框架中的一个注解，它用于指定加载 Spring 上下文的配置，通常与 `@RunWith(SpringRunner.class)` 一起使用。这个注解在进行 Spring 集成测试时非常有用，能够让测试类加载 Spring 配置，并注入 Spring 容器中的 Bean

### @Repository

`@Repository` 注解将一个类标识为 DAO 层的组件

## 事务

### @EnableTransactionManagement

设置当前Spring环境中开启注解式事务支持

:fire:事务管理器要根据使用技术进行选择，Mybatis框架使用的是JDBC事务，可以直接使用`DataSourceTransactionManager`

### @Transactional

 :cat: 为当前业务层方法添加事务

:deciduous_tree: ` @Transactional(rollbackFor = {IOException.class})`：在 Spring 的事务管理中，遇到 `IOException` 异常时，事务会进行回滚。默认Spring的事务只会对`Error异常`和`RuntimeException异常`及其子类进行事务回滚，其他的异常类型是不会回滚的

 :deciduous_tree:`@Transactional(propagation = Propagation.REQUIRES_NEW)`:propagation设置事务属性：传播行为设置为当前操作需要新事务