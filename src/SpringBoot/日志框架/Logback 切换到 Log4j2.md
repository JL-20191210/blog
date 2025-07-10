---
title: 🚀从 Logback 切换到 Log4j2
date: 2025-07-05
author: JeanHu
icon: fa-solid fa-file-lines
categories:
  - Spring Boot
  - 日志系统
  - 项目实战
tags:
  - Log4j2
  - 日志归档
  - 多级日志
  - 彩色控制台
  - 日志分模块
  - 异步日志
  - Spring Boot 配置
---

# 🚀 从 Logback 切换到 Log4j2：Spring Boot 高性能日志配置实战

> Spring Boot 默认使用 Logback 作为日志实现，但 Log4j2 拥有更高的性能、更强的灵活性和更丰富的配置能力。本文将带你一步一步完成从 Logback 到 Log4j2 的切换过程，并附带实战示例。

------

<!-- more -->
## ✨ 为什么选择 Log4j2？

| 特性             | Logback    | Log4j2                           |
| ---------------- | ---------- | -------------------------------- |
| 异步日志性能     | 中等       | 🚀 极高（基于 LMAX Disruptor）    |
| 彩色控制台日志   | 支持但麻烦 | ✅ 原生支持（%highlight, %style） |
| 日志归档策略     | 较弱       | ✅ 强大（支持时间+大小组合）      |
| 动态日志控制     | 一般       | ✅ 支持脚本、自动刷新             |
| 配置灵活度       | 较高       | ✅ 更高，支持 JSON/YAML/XML       |
| Spring Boot 默认 | ✅ 是       | ❌ 需手动切换                     |

> 总之：**Logback 更适合快速上手，Log4j2 更适合中大型项目的灵活管理与高性能需求。**

------

## 🧱 1. 移除 Logback，添加 Log4j2 依赖

### ✅ 1.1 排除 Spring Boot 默认的 Logback

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter</artifactId>
  <exclusions>
    <exclusion>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-logging</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

### ✅ 1.2 引入 Log4j2 Starter

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```

------

## 📁 2. 添加 Log4j2 配置文件

在 `src/main/resources` 目录下，新增文件：

```
log4j2-spring.xml
```

### ✅ 示例配置（支持彩色控制台 + 文件日志）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" monitorInterval="30">
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout>
        <Pattern>%style{%d{HH:mm:ss}}{cyan} %highlight{[%-5level]} %style{%logger{36}}{blue} - %msg%n</Pattern>
      </PatternLayout>
    </Console>

    <RollingFile name="FileAppender"
                 fileName="logs/app.log"
                 filePattern="logs/archive/app-%d{yyyy-MM-dd}-%i.log.gz">
      <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n"/>
      <Policies>
        <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
        <SizeBasedTriggeringPolicy size="50MB"/>
      </Policies>
      <DefaultRolloverStrategy max="30"/>
    </RollingFile>
  </Appenders>

  <Loggers>
    <Root level="INFO">
      <AppenderRef ref="Console"/>
      <AppenderRef ref="FileAppender"/>
    </Root>
  </Loggers>
</Configuration>
```

------

## ⚙️ 3. 添加运行参数支持彩色输出

在 JVM 启动参数中加入：

```
-Dlog4j.skipJansi=false
```

### 💡 IDEA 中设置方式：

- 打开 `Run → Edit Configurations`

- 在 VM options 中添加：

  ```
  -Dlog4j.skipJansi=false
  ```

------

## 📦 4. 使用方式不变（Lombok 示例）

```java
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class DemoService {
    public void test() {
        log.info("Log4j2 已成功启用！");
        log.error("这是错误日志！");
    }
}
```

------

## ✅ 5. 常见问题排查

| 问题                | 原因                     | 解决方法                                                  |
| ------------------- | ------------------------ | --------------------------------------------------------- |
| 日志无法打印        | log4j2 配置文件没生效    | 文件必须命名为 `log4j2-spring.xml`，并放在 `resources` 下 |
| 控制台没有颜色      | 缺少参数或终端不支持     | 添加 `-Dlog4j.skipJansi=false`，使用支持 ANSI 的终端      |
| 日志归档太频繁      | filePattern 时间粒度太细 | 使用 `%d{yyyy-MM-dd}` 而非 `%d{HH-mm-ss}`                 |
| 仍打印 Logback 样式 | 依赖未排除干净           | 确保 `spring-boot-starter-logging` 被排除                 |

------

## 📌 小结

| 步骤                | 内容                               |
| ------------------- | ---------------------------------- |
| 1️⃣ 排除 Logback 依赖 | 使用 exclusions                    |
| 2️⃣ 添加 Log4j2 依赖  | 引入 `spring-boot-starter-log4j2`  |
| 3️⃣ 创建配置文件      | 放在 `resources/log4j2-spring.xml` |
| 4️⃣ 配置控制台输出    | 支持彩色与归档                     |
| 5️⃣ 设置 JVM 参数     | 启用颜色支持                       |
| 6️⃣ 正常使用          | 支持 `@Log4j2` 或 `@Slf4j`         |

