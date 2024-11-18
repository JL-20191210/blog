---
icon: fa-solid fa-hashtag
date: 2024-11-14
category:
  - Spring
tag:
  - 注解
---
# 注解@RequestMapping、@PostMapping、@GetMapping

> `@RequestMapping`、`@PostMapping`和`@GetMapping`是三个非常常用的注解，用于处理[HTTP请求](https://so.csdn.net/so/search?q=HTTP请求&spm=1001.2101.3001.7020)映射。

## **@RequestMapping注解**

`@RequestMapping`是[Spring MVC](https://so.csdn.net/so/search?q=Spring MVC&spm=1001.2101.3001.7020)中用于映射web请求（如URL路径）到具体的方法上的注解。既可以标注在类上，也可以标注在方法上。常标注在类上，表示类中的所有响应请求的方法都是以该类路径为父路径。

## **@PostMapping注解**

`@PostMapping`是一个组合注解，它是`@RequestMapping(method = RequestMethod.POST)`的缩写。它用于处理HTTP POST请求的方法，只能标注在方法上。使用`@PostMapping`注解的方法将仅响应POST请求。

## **@GetMapping注解**

`@GetMapping`也是一个组合注解，它是`@RequestMapping(method = RequestMethod.GET)`的缩写。它用于处理HTTP GET请求的方法，也只能标注在方法上。使用`@GetMapping`注解的方法将仅响应GET请求。

## 示例

```java
@RestController
@RequestMapping("/admin")
@Api(tags = "后台用户模块")
public class AdminUserController {
    @Autowired
    private AdminUserService userService;


    @PostMapping("/password/update")
    @ApiOperation(value = "修改用户密码")
    @ApiOperationLog(description = "修改用户密码")
    public Response updatePassword(@RequestBody UpdateAdminUserPasswordReqVO updateAdminUserPasswordReqVO){
        return userService.updatePassword(updateAdminUserPasswordReqVO);
    }

    @GetMapping("/user/info")
    @ApiOperation(value = "获取用户信息")
    @ApiOperationLog(description = "获取用户信息")
    public Response findUserInfo(){
        return userService.findUserInfo();
    }
}
```

通常情况下使用`@GetMapping`、`@PostMapping`；对于复杂度的请求逻辑，可以使用@RequestMapping