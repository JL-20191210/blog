---
title: 基于注解的 AOP 日志切面
icon: fa-solid fa-scroll
date: 2025-07-14
author: JeanHu
category:
  - Spring
  - AOP
tag:
  - AOP
  - 注解
  - 日志切面
  - Spring
  - 切点表达式
summary: 本文介绍如何基于自定义注解实现 AOP 日志切面，结合 Spring AOP 实现统一日志打印、参数脱敏与性能统计等功能，适用于企业级应用的日志增强实践。
---

# 🛠基于注解的AOP日志切面
## ✍ 1. 自定义注解 `@Loggable`

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Loggable {
    String value() default ""; // 操作描述
    boolean logResponse() default true; // 是否记录返回值
}
```

------

## 🛠 2. 扩展切面类 `LogAspect`

```java
@Aspect
@Component
@Slf4j
public class LogAspect {

    @Pointcut("@annotation(com.example.annotation.Loggable)")
    public void loggableMethods() {}

    @Around("loggableMethods()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = getRequest();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Loggable loggable = method.getAnnotation(Loggable.class);

        String description = loggable.value();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = signature.getName();
        String httpMethod = request.getMethod();
        String url = request.getRequestURI();
        String ip = getClientIp(request);
        String username = getUsername(); // 从上下文中获取用户名，可扩展

        Object[] args = joinPoint.getArgs();
        long startTime = System.currentTimeMillis();

        log.info("""
            📘[接口调用]
            🎯 描述       : {}
            🧍 操作人     : {}
            🌐 请求方式   : {}
            🔗 请求地址   : {}
            📦 类方法     : {}.{}
            💻 IP地址     : {}
            📨 请求参数   : {}
        """, description, username, httpMethod, url, className, methodName, ip, Arrays.toString(args));

        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable ex) {
            log.error("❌[异常] 方法 {}.{} 报错: {}", className, methodName, ex.getMessage(), ex);
            throw ex;
        }

        long cost = System.currentTimeMillis() - startTime;

        if (loggable.logResponse()) {
            log.info("✅[执行成功] {}.{} | 耗时: {} ms | 返回值: {}", className, methodName, cost, result);
        } else {
            log.info("✅[执行成功] {}.{} | 耗时: {} ms", className, methodName, cost);
        }

        return result;
    }

    private HttpServletRequest getRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return Objects.requireNonNull(attrs).getRequest();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return (ip == null || ip.isBlank()) ? request.getRemoteAddr() : ip.split(",")[0].trim();
    }

    private String getUsername() {
        // 示例：可从 Spring Security 或 ThreadLocal 中获取登录用户名
        return "mockUser"; // TODO: 替换为真实用户信息
    }
}
```

------

## 📌 使用示例

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Loggable("根据ID查询用户")
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return new User(id, "张三");
    }

    @Loggable(value = "更新用户信息", logResponse = false)
    @PostMapping("/update")
    public void updateUser(@RequestBody User user) {
        // 更新逻辑
    }
}
```

------

## 📊 日志输出效果示例

```
📘[接口调用]
🎯 描述       : 根据ID查询用户
🧍 操作人     : mockUser
🌐 请求方式   : GET
🔗 请求地址   : /user/1
📦 类方法     : UserController.getUser
💻 IP地址     : 192.168.1.100
📨 请求参数   : [1]

✅[执行成功] UserController.getUser | 耗时: 12 ms | 返回值: User{id=1, name='张三'}
```

------

## 🧠 拓展建议

- 可以将日志保存到数据库（通过异步线程或消息队列）。
- `getUsername()` 方法可集成 Spring Security 或 JWT 提取登录用户。
- 返回值日志可以做脱敏处理。
- 可加入 `@Loggable(type = LogType.UPDATE)` 支持多种操作类型。

------

## ✅ 总结

> 基于注解的 Spring AOP 日志切面是构建统一日志、接口审计、安全追踪的重要手段，尤其适用于企业后端服务的“低侵入”日志收集与行为监控。