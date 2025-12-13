# Spring MVC 常用参数绑定注解总结

## 前言

在使用 **Spring MVC / Spring Boot** 开发 Web 接口时，Controller 方法里的参数从哪里来？  
Spring 提供了一整套注解，帮我们把 HTTP 请求不同位置的数据自动绑定到方法参数。

这些注解各自绑定的数据源不同，应用场景差异很大。  
这篇文章帮你梳理常用的绑定注解，配合对照表和数据来源图，让你一次记住。

---

## 1. 核心三兄弟

| 注解                | 数据来源                                | Content-Type 要求                   | 常见场景                 |
| ------------------- | --------------------------------------- | ----------------------------------- | ------------------------ |
| **`@RequestParam`** | URL 查询参数 / 普通表单字段             | `application/x-www-form-urlencoded` | 简单值提交、表单字段绑定 |
| **`@RequestBody`**  | 整个请求体                              | 通常 `application/json`             | REST API JSON 请求       |
| **`@RequestPart`**  | multipart/form-data 请求体中的某个 Part | `multipart/form-data`               | 文件上传+JSON混合提交    |

---

## 2. 常用绑定注解总览

| 注解                                              | 数据来源                            | 常见类型                            | 特点 / 场景                      |
| ------------------------------------------------- | ----------------------------------- | ----------------------------------- | -------------------------------- |
| **`@RequestParam`**                               | `?query=xx`、`form-data` 表单字段   | `String`、基本类型、`MultipartFile` | 绑定普通参数或文件（单个字段）   |
| **`@RequestBody`**                                | 整个 HTTP 请求体                    | Java 对象                           | 将 JSON/XML 请求体反序列化为对象 |
| **`@RequestPart`**                                | `multipart/form-data` 中的某个 Part | 文件、对象                          | 文件+对象混合上传                |
| **`@PathVariable`**                               | URL 路径占位符                      | 基本类型、`String`                  | `/users/{id}` 这种提取路径参数   |
| **`@RequestHeader`**                              | HTTP Header                         | `String`, `Date`                    | 获取请求头                       |
| **`@CookieValue`**                                | HTTP Cookie                         | `String` 等                         | 获取指定 Cookie 值               |
| **`@ModelAttribute`**                             | 请求参数映射到对象                  | POJO                                | 表单自动映射为对象               |
| **`@MatrixVariable`**                             | URL 矩阵变量                        | `String`                            | `/path;key=value` 格式           |
| **`@SessionAttribute`**                           | Spring MVC Session 属性             | 任意对象                            | 获取 session 中数据              |
| **`@RequestAttribute`**                           | request scope 属性                  | 任意对象                            | 获取 request 域里的属性          |
| **`@Valid` / `@Validated`**                       | 任意来源绑定的参数                  | 对象                                | 对绑定对象进行校验（JSR-303）    |
| **`@AuthenticationPrincipal`**（Spring Security） | 安全上下文                          | 用户对象                            | 获取当前登录用户                 |

---

## 3. 数据来源示意图

------

## 4. 选择建议

- **简单参数/表单字段** → `@RequestParam`

- **整段 JSON 请求体** → `@RequestBody`

- **文件 + JSON混合上传** → `@RequestPart`

- **路径里的值** → `@PathVariable`

- 特定来源数据：

  - 请求头 → `@RequestHeader`
  - Cookie → `@CookieValue`
  - 表单自动映射 → `@ModelAttribute`
  - 会话属性 → `@SessionAttribute`

- 安全相关

  ：

  - 当前用户信息 → `@AuthenticationPrincipal`

------

## 5. 总结

Spring MVC 的参数绑定注解可以覆盖 HTTP 请求几乎所有位置的数据：

- URL 路径、查询参数
- 请求体、multipart Part
- Header、Cookie
- Session / Request 域属性
- 安全上下文

熟悉它们的来源、格式要求和适用场景，能让你的 Controller 方法更简洁、更易维护。

> **记住两点**：
>
> 1. 先确定数据在 HTTP 请求的哪一部分
> 2. 再选择对应的注解绑定