# Spring Boot无数据源启动



> springboot会自动注入数据源，如果没有配，就会抛出该异常

**不需要数据库支持，可以让他不注入数据源**

```java
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

