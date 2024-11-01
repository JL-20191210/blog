---
icon: fa-solid fa-bug
date: 2024-11-01
category:
  - 实战
tag:
  - bug
# star: true
# sticky: true
---
# 人人fast后台注册nacos失败问题

## 问题描述

> spring boot与spring cloud版本不匹配导致nacos注册失败

<!-- more -->

## 解决方案

> `renren-fast`当前使用的`spring boot`版本为`2.6.6`，对应spring cloud版本应高于2021.0.x
>
> 其余模块中使用的`spring boot`版本为`2.1.8 RELEASE`，`spring cloud `版本为`Greenwich.SR3`

:seedling:降低renren-fast的spring boot版本至`2.1.8 RELEASE`

```pom.xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.8.RELEASE</version>
        <relativePath/> <!-- 直接从库里找而不是依赖项目中的 -->
    </parent>
```

:warning:注意修改跨域配置文件中的allowedOriginPatterns为allowedOrigins

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowCredentials(true)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .maxAge(3600);
    }
}
```

## 版本问题

[spring boot 与 spring cloud版本对应](https://spring.io/projects/spring-cloud)

| Release Train                                                | Spring Boot Generation                |
| :----------------------------------------------------------- | :------------------------------------ |
| [2023.0.x](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2023.0-Release-Notes) aka Leyton | 3.3.x, 3.2.x                          |
| [2022.0.x](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2022.0-Release-Notes) aka Kilburn | 3.0.x, 3.1.x (Starting with 2022.0.3) |
| [2021.0.x](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2021.0-Release-Notes) aka Jubilee | 2.6.x, 2.7.x (Starting with 2021.0.3) |
| [2020.0.x](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2020.0-Release-Notes) aka Ilford | 2.4.x, 2.5.x (Starting with 2020.0.3) |
| [Hoxton](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-Hoxton-Release-Notes) | 2.2.x, 2.3.x (Starting with SR5)      |
| [Greenwich](https://github.com/spring-projects/spring-cloud/wiki/Spring-Cloud-Greenwich-Release-Notes) | 2.1.x                                 |
| [Finchley](https://github.com/spring-projects/spring-cloud/wiki/Spring-Cloud-Finchley-Release-Notes) | 2.0.x                                 |
| [Edgware](https://github.com/spring-projects/spring-cloud/wiki/Spring-Cloud-Edgware-Release-Notes) | 1.5.x                                 |
| [Dalston](https://github.com/spring-projects/spring-cloud/wiki/Spring-Cloud-Dalston-Release-Notes) | 1.5.x                                 |

[CorsConfig.java]()

:beer:`allowedOriginPatterns` 方法是在 **Spring Framework 5.3** 中引入的，具体来说是在 **Spring Boot 2.4** 开始支持的。该方法允许使用模式匹配配置 CORS 的允许来源，与 `allowedOrigins` 不同，它支持通配符来匹配子域或更灵活的 URL 结构。

例如，在 Spring Boot 2.4+ 项目中，可以在 CORS 配置中使用 `allowedOriginPatterns` 来允许特定的模式：

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOriginPatterns("https://*.example.com") // 支持子域名
            .allowedMethods("GET", "POST")
            .allowedHeaders("*");
}
```

确保项目使用的是 Spring Framework 5.3 或更高版本，以便正常使用 `allowedOriginPatterns`。