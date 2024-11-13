icon: pen-to-square
date: 2024-11-14
category:
  - Spring
tag:
  - 总结
---
# @ControllerAdvice

## 1. 概述

> `@ControllerAdvice`，是Spring3.2提供的新注解，它是一个Controller增强器，可对controller进行增强处理。
>
> `@ControllerAdvice`注解将作用在所有`Controller层`的方法上
<!-- more -->
### 实现

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface ControllerAdvice {
    @AliasFor("basePackages")
    String[] value() default {};

    @AliasFor("value")
    String[] basePackages() default {};

    Class<?>[] basePackageClasses() default {};

    Class<?>[] assignableTypes() default {};

    Class<? extends Annotation>[] annotations() default {};
}
```

- 本质是一个Component，会被当成组件扫描
- 作用范围：类，接口，枚举
- 生命周期：始终不丢弃

## 2. 作用

- 配合`@ExceptionHandler`注解，进行全局异常处理。
- 配合`@InitBinder`注解，用来设置WebDataBinder，用于自动绑定前台请求参数到Model中，`全局数据预处理`，多用于表单提交数据或者url传参。 
- 配合`@ModelAttribute`注解，让Controller类中所有的方法都可以获取到通过@ModelAttribute注解设置的值，进行`全局数据绑定`。

## 3. 使用

 ### 3.1 `@ExceptionHandler` 实现全局异常处理

#### 3.1.1 **实现**

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExceptionHandler {
    Class<? extends Throwable>[] value() default {};
}
```

- 作用范围：类，接口，枚举
- 生命周期：始终不丢弃

#### 3.1.2 使用实例

若没有使用@ResponseBody，底层会将方法返回值封装为ModelAndView对象

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ModelAndView handleException(IllegalArgumentException e){
        ModelAndView modelAndView = new ModelAndView("error");
        modelAndView.addObject("errorMessage", "参数不符合规范!");
        return modelAndView;
    }
}
```

若使用@ResponseBody，底层会将方法返回值转换为JSON对象

```java
@RestControllerAdvice(basePackages = "com.atguigu.gulimall.product.controller")
#@ControllerAdvice(basePackages = "com.atguigu.gulimall.product.controller")
#@ResponseBody
public class GulimallExceptionControllerAdvice {
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public R handleValidException(MethodArgumentNotValidException e){
        BindingResult bindingResult = e.getBindingResult();
        Map<String, String> errorMap = new HashMap<>();
        bindingResult.getFieldErrors().forEach(fieldError -> {
            errorMap.put(fieldError.getField(),fieldError.getDefaultMessage());
        });
        return R.error(BizCodeEnum.VALID_EXCEPTION.getCode(), BizCodeEnum.VALID_EXCEPTION.getMsg()).put("data",errorMap);
    }
}
```

:warning:`@RestControllerAdvice = @ControllerAdvice + @ResponseBody`

### 3.2 预设全局数据

### 3.3 请求参数预处理