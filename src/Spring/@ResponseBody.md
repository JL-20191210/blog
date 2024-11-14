---
icon: pen-to-square
date: 2024-11-14
category:
  - Spring
tag:
  - 注解
---
# @ResponseBody

> 使用在使用在控制层（controller）的方法上。
>
> 是组成`@RestController`的分子
<!-- more -->
### 1. 实现

```java
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ResponseBody {
}
```

- 作用范围：类，接口，枚举类。方法
- 生命周期：始终不会丢弃

### 2. **作用**

将方法返回值用特定格式写到response的body区域，将数据返回给客户端

1. 若没有写@ResponseBody，底层会将方法返回值封装为ModelAndView对象
2. 若返回值为字符串，则直接写到客户端
3. 若返回值为对象，则转为JSON串后写到客户端

