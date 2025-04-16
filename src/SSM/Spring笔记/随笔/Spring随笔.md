# Spring随笔

## AOP

### AOP通知获取数据

` @Before("pt()")`获取参数使用`JoinPoint`

` @Around("pt()")`获取次参数使用`ProceedingJoinPoint`

```java
@Component
@Aspect
public class MyAdvice {
    @Pointcut("execution(* com.itheima.dao.BookDao.findName(..))")
    private void pt(){}

    @Before("pt()")
    public void before(JoinPoint jp) 
        Object[] args = jp.getArgs();
        System.out.println(Arrays.toString(args));
        System.out.println("before advice ..." );
    }

    @Around("pt()")
    public Object around(ProceedingJoinPoint pjp)throws Throwable {
        Object[] args = pjp.getArgs();
        System.out.println(Arrays.toString(args));
        Object ret = pjp.proceed();
        return ret;
    }
	//其他的略
}
```

`pjp.proceed()`方法是有两个构造方法，一个有参一个无参

* 调用无参数的proceed，当原始方法有参数，会在调用的过程中自动传入参数

* 所以调用这两个方法的任意一个都可以完成功能

* 但是当需要修改原始方法的参数时，就只能采用带有参数的方法,如下:

### 获取返回值

### 返回后通知获取返回值

(1)参数名的问题

![1630237320870](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504092354604.png)

(2)`afterReturning`方法参数类型的问题

参数类型可以写成`String`，但是为了能匹配更多的参数类型，建议写成Object类型

(3)`afterReturning`方法参数的顺序问题

![1630237586682](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504092354958.png)

## 事务

### JdbcConfig类中配置事务管理器

```java
public class JdbcConfig {
    @Value("${jdbc.driver}")
    private String driver;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String userName;
    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource dataSource(){
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(userName);
        ds.setPassword(password);
        return ds;
    }

    //配置事务管理器，mybatis使用的是jdbc事务
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource){
        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(dataSource);
        return transactionManager;
    }
}
```

:whale2:事务管理器要根据使用技术进行选择，Mybatis框架使用的是JDBC事务，可以直接使用`DataSourceTransactionManager`

:fire:目前的事务管理是基于`DataSourceTransactionManager`和`SqlSessionFactoryBean`使用的是同一个数据源。