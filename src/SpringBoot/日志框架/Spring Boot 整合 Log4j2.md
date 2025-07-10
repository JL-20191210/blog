---
title: Spring Boot 整合 Log4j2 日志系统实战
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

# 🚀Spring Boot 整合 Log4j2：支持彩色控制台、多级日志文件、自动归档与按模块输出

> 本文介绍如何在 Spring Boot 项目中替换默认的 Logback 日志框架为 Log4j2，并实现多目标日志输出（控制台 + 多级日志文件）、彩色日志、高级归档策略和模块级日志划分。适用于生产环境的中大型项目。

------

## 🧱 项目结构

项目整体结构如下图所示：

```
├── config
│   └── LogSystemPropertyInjector.java  // 日志属性注入器
├── service
│   └── TestService.java                // 定时输出测试日志
├── resources
│   ├── application.yml                 // 日志相关配置
│   └── log4j2-spring.xml               // Log4j2 配置文件
├── pom.xml                             // 日志相关依赖声明
```

------

## 🔧 1. 日志属性注入器

通过 Spring Boot 的 `@Value` 注解获取 `application.yml` 中配置的日志相关参数，在 `@PostConstruct` 阶段注入为 JVM 系统属性，供 Log4j2 使用：

```java
@Component
public class LogSystemPropertyInjector {
    @Value("${env.log.base:logs}")
    private String logBase;
    @Value("${env.log.retention.days:30}")
    private String logRetentionDays;
    @Value("${env.log.size.all:50MB}")
    private String logSizeAll;
    @Value("${env.log.size.warn:20MB}")
    private String logSizeWarn;
    @Value("${env.log.size.error:10MB}")
    private String logSizeError;
    @Value("${env.log.size.module:30MB}")
    private String logSizeModule;
    @Value("${spring.profiles.active:default}")
    private String activeProfile;
    @Value("${env.log.output.level:DEBUG}")
    private String outputLevel;

    @PostConstruct
    public void inject() {
        System.setProperty("log.base", logBase);
        System.setProperty("log.retention.days", logRetentionDays);
        System.setProperty("log.size.all", logSizeAll);
        System.setProperty("log.size.warn", logSizeWarn);
        System.setProperty("log.size.error", logSizeError);
        System.setProperty("log.size.module", logSizeModule);
        System.setProperty("spring.profiles.active", activeProfile);
        System.setProperty("log.output.level", outputLevel);
        System.out.println("[LOG] 系统日志属性已注入成功");
    }
}
```

------

## 🧾 2. `log4j2-spring.xml` 配置详解

日志配置支持以下特性：

### ✅ 控制台输出（仅 `dev` 环境）

- 使用 `%highlight` 实现彩色日志
- 使用 JavaScript 脚本过滤非 dev 环境输出

```xml
<Console name="Console" target="SYSTEM_OUT">
    <PatternLayout pattern="%d %highlight{%-5level} ..."/>
    <Filters>
        <Filter type="Script" onMatch="ACCEPT" onMismatch="DENY">
            <Script name="IsDevProfile" language="JavaScript">
                log4j2.getProperty('LOG_PROFILE') == 'dev';
            </Script>
        </Filter>
    </Filters>
</Console>
```

### ✅ 多级日志输出

- `all.log`：记录所有日志，按时间 + 文件大小归档
- `warn.log` / `error.log`：按日志级别独立归档
- `user.log` / `order.log`：按模块划分日志目录

每类日志文件均使用 `RollingFile` 配置，支持归档保留策略：

```xml
<RollingFile name="WarnFile" fileName="${LOG_BASE}/${DATE_FOLDER}/warn.log"
    filePattern="${LOG_BASE}/${ARCHIVE_FOLDER}/warn-%d{yyyy-MM-dd}-%i.log.gz">
    <PatternLayout pattern="..."/>
    <ThresholdFilter level="WARN" onMatch="ACCEPT" onMismatch="DENY"/>
    <Policies>
        <TimeBasedTriggeringPolicy interval="1"/>
        <SizeBasedTriggeringPolicy size="${LOG_SIZE_WARN}" minSize="5MB"/>
    </Policies>
    <DefaultRolloverStrategy max="30">
        <Delete basePath="${LOG_BASE}" maxDepth="3">
            <IfFileName glob="**/archive/warn-*.log.gz"/>
            <IfLastModified age="${LOG_RETENTION_DAYS}d"/>
        </Delete>
    </DefaultRolloverStrategy>
</RollingFile>
```

### ✅ 异步日志

通过 `Async` 包装器降低 IO 阻塞：

```xml
<Async name="AsyncWarn">
    <AppenderRef ref="WarnFile"/>
</Async>
```

------

## 📦 3. application.yml 配置

将日志参数集中配置于 `env.log` 节点，利于动态调整：

```yaml
spring:
  profiles:
    active: dev

env:
  log:
    base: ./logs
    retention:
      days: 30
    output:
      level: DEBUG
    size:
      all: 64MB
      warn: 32MB
      error: 16MB
      module: 8MB
```

------

## 📄 4. pom.xml 依赖管理

为了使用 Log4j2，需排除默认的 Logback：

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

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
    <version>2.1.1.RELEASE</version>
</dependency>
```

------

## 🧪 5. 测试：定时输出日志

定时任务每 2 秒输出一组日志，验证控制台和彩色输出是否生效：

```java
@EnableScheduling
@Log4j2
@Configuration
public class TestService {

    @Scheduled(cron = "*/2 * * * * *")
    private void output(){
        log.debug("debug..");
        log.info("info...");
        log.error("error");
    }
}
```

控制台日志输出示例（仅在 `dev` 环境）：

```
2025-07-05 14:14:01 DEBUG [main] TestService.output(23): debug..
2025-07-05 14:14:01 INFO  [main] TestService.output(24): info...
2025-07-05 14:14:01 ERROR [main] TestService.output(25): error
```

------

## 🧹 6. 日志清理策略

- 所有日志归档存放于 `logs/yyyy-MM/archive/` 目录
- 每种日志最大保留 30 个归档文件
- 超过 `${LOG_RETENTION_DAYS}` 天的文件自动清理

------

## ✅ 总结

本篇通过结合 Spring Boot 的配置注入机制与 Log4j2 强大的日志能力，搭建了一个支持：

- 多级日志划分（ALL/WARN/ERROR）
- 模块级独立日志（user/order）
- 彩色控制台输出（dev 环境）
- 按时间 + 文件大小归档
- 自动清理过期归档
- 异步日志输出提升性能

的企业级日志系统，适用于微服务和模块化项目。你可以根据实际业务模块，继续扩展独立日志通道，如：`payment`, `auth`, `gateway` 等

## ✅ 示例代码

### 🧩日志属性注入器

```java
package com.sugar.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * 日志属性类
 * @author felix
 * @date 2025/7/4 15:37
 */

@Component
public class LogSystemPropertyInjector {

    // 冒号后为当前值不存在时的默认值
    @Value("${env.log.base:logs}")
    private String logBase;

    @Value("${env.log.retention.days:30}")
    private String logRetentionDays;

    @Value("${env.log.size.all:50MB}")
    private String logSizeAll;

    @Value("${env.log.size.warn:20MB}")
    private String logSizeWarn;

    @Value("${env.log.size.error:10MB}")
    private String logSizeError;

    @Value("${env.log.size.module:30MB}")
    private String logSizeModule;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;


    @Value("${env.log.output.level:DEBUG}")
    private String outputLevel;

    @PostConstruct
    public void inject() {
        // 设置 JVM 级别的系统属性
        // 日志保存路径
        System.setProperty("log.base", logBase);
        // 日志过期时间
        System.setProperty("log.retention.days", logRetentionDays);
        // all日志归档阈值
        System.setProperty("log.size.all", logSizeAll);
        // warn日志归档阈值
        System.setProperty("log.size.warn", logSizeWarn);
        // error日志归档阈值
        System.setProperty("log.size.error", logSizeError);
        // 分模块日志归档阈值
        System.setProperty("log.size.module", logSizeModule);
        // 控制台日志输出开关，仅dev下输出
        System.setProperty("spring.profiles.active", activeProfile);
        // 日志输出级别
        System.setProperty("log.output.level", outputLevel);

        System.out.println("[LOG] 系统日志属性已注入: ");
        System.out.println("[LOG] 当前日志输出级别: " + outputLevel);
        System.out.println("[LOG] 日志保存路径: " + logBase);
        System.out.println("[LOG] 日志定时清理: " + logRetentionDays +"天");
        System.out.println("[LOG] all文件归档大小: " + logSizeAll);
        System.out.println("[LOG] 当前启动配置文件: " + activeProfile);
    }
}
```

### 📄`log4j2-spring.xml` 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" monitorInterval="30">
    <Properties>
        <!--冒号后为当前值不存在时的默认值-->
        <Property name="LOG_BASE">${sys:log.base:-logs}</Property>
        <Property name="DATE_FOLDER">${date:yyyy-MM-dd}</Property>
        <Property name="ARCHIVE_FOLDER">${date:yyyy-MM}/archive</Property>
        <!--sys后为设置的JVM级别的系统属性-->
        <Property name="LOG_RETENTION_DAYS">${sys:log.retention.days:-30}</Property>
        <Property name="LOG_SIZE_ALL">${sys:log.size.all:-50MB}</Property>
        <Property name="LOG_SIZE_WARN">${sys:log.size.warn:-20MB}</Property>
        <Property name="LOG_SIZE_ERROR">${sys:log.size.error:-10MB}</Property>
        <Property name="LOG_SIZE_MODULE">${sys:log.size.module:-30MB}</Property>
        <Property name="LOG_OUTPUT_LEVEL">${sys:log.output.level:-DEBUG}</Property>

        <!-- 不指定启动的配置文件则默认使用default       -->
        <Property name="LOG_PROFILE">${sys:spring.profiles.active:-default}</Property>
    </Properties>

    <Appenders>
        <!-- 彩色控制台，仅 dev ,test 环境打印 -->
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d %highlight{%-5level}{ERROR=Bright RED, WARN=Bright Yellow, INFO=Bright Green, DEBUG=Bright Cyan, TRACE=Bright White} %style{[%t]}{bright,magenta} %style{%c{1.}.%M(%L)}{cyan}: %msg%n"/>
            <Filters>
                <!-- 仅 dev 环境启用控制台，但不过滤任何日志级别 -->
                <Filter type="Script" onMatch="ACCEPT" onMismatch="DENY">
                    <Script name="IsDevProfile" language="JavaScript"><![CDATA[
        log4j2.getProperty('LOG_PROFILE') == 'dev';
      ]]></Script>
                </Filter>
            </Filters>
        </Console>

        <!-- ALL 日志 -->
        <!-- 写入所有日志的文件（ALL 级别） -->
        <!-- 当前写入文件 -->
        <!-- 归档文件命名，按天压缩并带序号 按每小时就把文件名改为all-%d{yyyy-MM-dd-HH}-%i.log.gz-->
        <RollingFile name="AllFile" fileName="${LOG_BASE}/${DATE_FOLDER}/all.log"
                     filePattern="${LOG_BASE}/${ARCHIVE_FOLDER}/all-%d{yyyy-MM-dd}-%i.log.gz">
            <!-- 日志输出格式 -->
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n"/>
            <!-- 滚动策略：时间 + 大小 -->
            <Policies>
                <!-- 每天滚动一次 -->
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <!-- 超过指定大小后也触发滚动，最小滚动大小 10MB，避免频繁滚动 -->
                <SizeBasedTriggeringPolicy size="${LOG_SIZE_ALL}"/>
            </Policies>
            <!-- 归档策略 -->
            <DefaultRolloverStrategy max="30"><!-- 最多保留 30 个归档 -->
                <!-- 删除 30 天前的归档文件 -->
                <Delete basePath="${LOG_BASE}" maxDepth="3">
                    <IfFileName glob="**/archive/all-*.log.gz"/>
                    <IfLastModified age="${LOG_RETENTION_DAYS}d"/>
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        <!-- WARN 日志 -->
        <RollingFile name="WarnFile" fileName="${LOG_BASE}/${DATE_FOLDER}/warn.log"
                     filePattern="${LOG_BASE}/${ARCHIVE_FOLDER}/warn-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n"/>
            <Filters>
                <ThresholdFilter level="WARN" onMatch="ACCEPT" onMismatch="DENY"/>
            </Filters>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="${LOG_SIZE_WARN}" minSize="5MB"/>
            </Policies>
            <DefaultRolloverStrategy max="30">
                <Delete basePath="${LOG_BASE}" maxDepth="3">
                    <IfFileName glob="**/archive/warn-*.log.gz"/>
                    <IfLastModified age="${LOG_RETENTION_DAYS}d"/>
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        <!-- ERROR 日志 -->
        <RollingFile name="ErrorFile" fileName="${LOG_BASE}/${DATE_FOLDER}/error.log"
                     filePattern="${LOG_BASE}/${ARCHIVE_FOLDER}/error-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n"/>
            <Filters>
                <ThresholdFilter level="ERROR" onMatch="ACCEPT" onMismatch="DENY"/>
            </Filters>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="${LOG_SIZE_ERROR}"/>
            </Policies>
            <DefaultRolloverStrategy max="30">
                <Delete basePath="${LOG_BASE}" maxDepth="3">
                    <IfFileName glob="**/archive/error-*.log.gz"/>
                    <IfLastModified age="${LOG_RETENTION_DAYS}d"/>
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        <!-- User 模块日志 -->
        <RollingFile name="UserLog" fileName="${LOG_BASE}/${DATE_FOLDER}/user/user.log"
                     filePattern="${LOG_BASE}/${ARCHIVE_FOLDER}/user/user-%d{yyyy-MM-dd-HH-mm-ss}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="${LOG_SIZE_MODULE}"/>
            </Policies>
            <DefaultRolloverStrategy max="30">
                <Delete basePath="${LOG_BASE}" maxDepth="4">
                    <IfFileName glob="**/archive/user/user-*.log.gz"/>
                    <IfLastModified age="${LOG_RETENTION_DAYS}d"/>
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        <!-- Order 模块日志 -->
        <RollingFile name="OrderLog" fileName="${LOG_BASE}/${DATE_FOLDER}/order/order.log"
                     filePattern="${LOG_BASE}/${ARCHIVE_FOLDER}/order/order-%d{yyyy-MM-dd-HH-mm-ss}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="${LOG_SIZE_MODULE}"/>
            </Policies>
            <DefaultRolloverStrategy max="30">
                <Delete basePath="${LOG_BASE}" maxDepth="4">
                    <IfFileName glob="**/archive/order/order-*.log.gz"/>
                    <IfLastModified age="${LOG_RETENTION_DAYS}d"/>
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        <!-- 异步包装器 -->
        <Async name="AsyncAll">
            <AppenderRef ref="AllFile"/>
        </Async>
        <Async name="AsyncWarn">
            <AppenderRef ref="WarnFile"/>
        </Async>
        <Async name="AsyncError">
            <AppenderRef ref="ErrorFile"/>
        </Async>
        <Async name="AsyncUser">
            <AppenderRef ref="UserLog"/>
        </Async>
        <Async name="AsyncOrder">
            <AppenderRef ref="OrderLog"/>
        </Async>
    </Appenders>

    <Loggers>
        <Logger name="com.example.user" level="INFO" additivity="false">
            <AppenderRef ref="AsyncUser"/>
        </Logger>

        <Logger name="com.example.order" level="INFO" additivity="false">
            <AppenderRef ref="AsyncOrder"/>
        </Logger>

        <Root level="DEBUG">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="AsyncAll"/>
            <AppenderRef ref="AsyncWarn"/>
            <AppenderRef ref="AsyncError"/>
        </Root>
    </Loggers>
</Configuration>
```

### ⚙️application.yml

```yaml
spring:
  profiles:
    active: dev
# 配置日志时关联了使用不同配置文件的日志输出不同，故日志配置放在与active一个文件中
env:
  log:
    base: ./logs
    retention:
      days: 30
    output:
      level: DEBUG
    size:
      all: 64MB
      warn: 32MB
      error: 16MB
      module: 8MB
```

### 📦pom.xml

```xml
    <dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>javax.annotation</groupId>
            <artifactId>javax.annotation-api</artifactId>
            <version>1.3.2</version>
        </dependency>

        <!-- 替换掉 spring-boot-starter-logging -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId> <!-- 排除 Logback -->
                </exclusion>
            </exclusions>
        </dependency>

        <!-- 引入 Log4j2 支持 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-log4j2</artifactId>
            <version>2.1.1.RELEASE</version>
        </dependency>
    </dependencies>
```

### 📦测试类

```java
package com.sugar.service;

import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * @author felix
 * @date 2025/7/4 16:41
 */
@EnableScheduling
@Log4j2
@Configuration
public class TestService {

    @Scheduled(cron = "*/2 * * * * *")
    private void output(){
        log.debug("debug..");
        log.info("info...");
        log.error("error");
    }
}
```

