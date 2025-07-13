---
title: RequiredArgsConstructor
icon: fa-solid fa-code
date: 2025-07-10
author: JeanHu
category:
  - Java
  - Lombok
tag:
  - Lombok
  - 注解
  - 构造函数
  - 自动生成
summary: 本文介绍 Lombok 提供的 @RequiredArgsConstructor 注解的作用、使用方式与注意事项，帮助开发者简化代码并提升构造器管理效率。
---

# 🎯 `@RequiredArgsConstructor`

## 🔍 什么是 `@RequiredArgsConstructor`

`@RequiredArgsConstructor` 是 Lombok 提供的注解，用于**自动生成包含所有 `final` 字段和带 `@NonNull` 注解字段的构造函数**，简化代码书写，尤其适用于 Spring 的构造函数依赖注入。

------
<!-- more -->
## 🌟 主要特点

- ✅ 只包含 `final` 和 `@NonNull` 字段作为参数的构造函数。
- ✅ 生成的构造函数帮助实现依赖注入时的**依赖显式声明**。
- ✅ 避免手写构造函数样板代码。
- ✅ 与 Spring 框架配合使用时非常便利，无需显式写 `@Autowired`。

------

## 🧱 与其他 Lombok 构造注解对比

| 注解                       | 生成构造函数参数字段          |
| -------------------------- | ----------------------------- |
| `@NoArgsConstructor`       | 无参数构造函数                |
| `@AllArgsConstructor`      | 所有字段（包括非 `final`）    |
| `@RequiredArgsConstructor` | 仅 `final` 和 `@NonNull` 字段 |

------

## 🛠️ 作用

> 💡 使用了 Lombok 的 `@RequiredArgsConstructor` 注解后，**无需再在构造函数或字段上写 `@Autowired` 注解**，Spring 容器依然可以正确完成依赖注入。

### 🧾 传统写法（需要写 `@Autowired`）

```java
@Service
public class UserService {

    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
}
```

### ✅ 使用 `@RequiredArgsConstructor`（无需写 `@Autowired`）

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
}
```

------

## 📦 使用示例

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final OrderMapper orderMapper;

    // Lombok 自动生成如下构造函数：
    // public UserService(UserMapper userMapper, OrderMapper orderMapper) { ... }
}
```

📌 Spring 容器会自动调用生成的构造函数完成依赖注入。

------

## 🌈 优势

- ✅ **简化代码结构**：无需手写构造函数和 `@Autowired` 注解，减少样板代码。
- ✅ **依赖关系清晰**：所有依赖通过构造函数暴露，避免依赖“隐藏”在字段中。
- ✅ **提升代码安全性**：构造注入支持 `final` 字段，避免依赖被误修改，符合不可变设计原则。
- ✅ **便于单元测试**：可直接通过构造函数传入 mock 对象，无需依赖 Spring 容器。
- ✅ **自动空值检查（配合 @NonNull）**：防止运行时出现 `NullPointerException`。
- ✅ **充分利用 Spring 自动注入机制**：Spring 会自动识别唯一构造函数，无需手动标注 `@Autowired`。
- ✅ **降低出错概率**：由 Lombok 自动生成构造函数，避免漏注、参数顺序错等问题。
- ✅ **统一团队代码风格**：团队内统一使用构造注入，代码规范清晰一致。
- ✅ **与依赖倒置原则契合**：通过构造器暴露依赖，更符合 SOLID 原则中的 DIP（依赖倒置原则）。

------

## ⚠️ 注意事项

- 📦 需要添加 Lombok 依赖，并在 IDE 中安装 Lombok 插件。
- 🔧 如果类中有多个构造函数或特殊需求，可以结合使用其他构造注解。
- 🧊 如果需要无参构造函数（例如序列化），需显式添加 `@NoArgsConstructor`。
- ✋ 手动编写构造函数会阻止 Lombok 生成对应构造函数。

------

## ✅ 总结

> `@RequiredArgsConstructor` 是简化 Spring 构造函数注入的利器，让依赖声明更清晰、代码更简洁、易于维护，是现代 Java 开发的常用实践。