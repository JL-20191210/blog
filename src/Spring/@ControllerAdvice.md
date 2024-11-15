---
icon: pen-to-square
date: 2024-11-14
category:
  - Spring
tag:
  - 注解
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

> 配合`@ModelAttribute`注解,实现全局数据绑定
>
> 使用` @ModelAttribute `注解标记该方法的返回数据是一个全局数据，默认情况下，这个全局数据的 key 就是返回的变量名，value 就是方法返回值，也可以通过`@ModelAttribute("myMap")`重新指定 key为myMap。
>
> 供所有Controller中注有`@RequestMapping`的方法使用

#### 3.2.1 ` @ModelAttribute` 实现

```java
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ModelAttribute {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean binding() default true;
}
```

- 作用范围：参数和方法
- 生命周期：始终不丢弃

#### 3.2.2 绑定值

```java
@ControllerAdvice
public class MyGlobalHandler {
    
    /** 方式一 **/
    @ModelAttribute
    public void presetParam(Model model){
        model.addAttribute("globalAttr","this is a global param");
    }

    /** 方式二 **/
    @ModelAttribute()
    public Map<String, String> presetParam(){
        Map<String, String> map = new HashMap<String, String>();
        map.put("key1", "map默认获取方式是modelMap.get(\"map\")");
        map.put("key2", "value2");
        map.put("key3", "value3");
        return map;
    }

    /** 方式三 **/
    @ModelAttribute("myMap")
    public Map<String, String> presetParam1(){
        Map<String, String> map = new HashMap<String, String>();
        map.put("key1", "map自定义获取方式是modelMap.get(\"myMap\")");
        map.put("key2", "value2");
        map.put("key3", "value3");
        return map;
    }
}
```

**方式一**

直接加入变量名和变量值。直接通过变量名获取变量值

**方式二**

将变量名和变量值放在map中。使用时先获取map，再从map中通过变量名获取变量值 

**方式三**

方式二中绑定值时默认的key是返回值map。方式三自定义这个key为myMap

#### 3.2.3 获取全局数据

```java
@RestController
@RequestMapping("/global")
public class AdviceController {

    /** 获取全局绑定数据 **/

    @GetMapping("/param1")
    public String getGlobalParam1(Model model){
        Map<String, Object> modelMap = model.asMap();
        return (String) modelMap.get("globalAttr");
    }

    @GetMapping("/param2")
    public String getGlobalParam2(@ModelAttribute("globalAttr") String globalAttr){
        return globalAttr;
    }

    @GetMapping("/param3")
    public String getGlobalParam3(ModelMap modelMap){
        return (String)modelMap.get("globalAttr");
    }

    @GetMapping("/param4")
    public Map getGlobalParam4(Model model){
        Map<String, Object> modelMap = model.asMap();
        Map<String,String> map  = (Map) modelMap.get("map");
        return map;
    }

    @GetMapping("/param5")
    public String getGlobalParam5(@ModelAttribute("map") Map<String,String> map){
        return  map.get("key1");
    }

    @GetMapping("/param6")
    public Map getGlobalParam6(ModelMap modelMap){
        return (Map) modelMap.get("map");
    }

    @GetMapping("/param7")
    public Map getGlobalParam7(ModelMap modelMap){
        return (Map) modelMap.get("myMap");
    }
}

```

### 3.3 请求参数预处理