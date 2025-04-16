# SpringMVC注解

## @EnableWebMvc

`@EnableWebMvc` 注解会启用 Spring MVC 的默认配置，包括：

- **配置 DispatcherServlet**：Spring MVC 的核心控制器，负责处理 HTTP 请求。
- **启用视图解析器**：默认的 `InternalResourceViewResolver`，用于解析 JSP 或其他视图。
- **启用注解驱动的控制器**：允许使用 `@Controller`, `@RequestMapping` 等注解来定义请求处理方法。
- **启用消息转换器**：支持请求和响应的 JSON、XML 等格式的转换。

:airplane: 适用于传统的 Spring MVC 应用程序

:seedling: 在 Spring Boot 中，不建议显式使用 `@EnableWebMvc`，因为 Spring Boot 自动配置已经处理了 Spring MVC 的配置。