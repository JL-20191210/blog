---
title: Spring 三级缓存解决循环依赖详解
icon: fa-solid fa-layer-group
date: 2025-07-14
author: JeanHu
category:
  - Spring
  - 依赖注入
tag:
  - Spring
  - 三级缓存
  - 循环依赖
  - 依赖注入
summary: 本文详细讲解 Spring 框架中三级缓存机制如何解决 Bean 循环依赖问题，涵盖缓存原理、创建流程。帮助开发者深入理解依赖注入底层细节。
---

# ☕ Spring 三级缓存解决循环依赖详解

------

## ✅ 一句话概括

> Spring 通过三级缓存（单例池、提前暴露的半成品缓存、工厂缓存）机制，有效解决单例 Bean 在创建过程中因相互依赖导致的循环依赖问题。

> [!important]
>
> 自始至终BeanA和BeanB都只有一个对象实例。
>
> **A 还没完全初始化完时，就能被 B 引用**
>
>
> 提前暴露的半成品 Bean 其实就像是一个“承诺”，告诉其他依赖它的 Bean：“我已经实例化了，你可以先引用我，后续我会完善你看到的功能。”

------
<!-- more -->
## 🧱 三个缓存说明

| 缓存名称                          | 作用                               | 存储对象                 |
| --------------------------------- | ---------------------------------- | ------------------------ |
| 一级缓存（singletonObjects）      | 存放完全初始化好的单例 Bean        | 完整的 Bean 实例（成品） |
| 二级缓存（earlySingletonObjects） | 存放提前暴露的 Bean 实例（半成品） | 尚未完成依赖注入的 Bean  |
| 三级缓存（singletonFactories）    | 存放可以创建 Bean 的工厂对象       | ObjectFactory 接口对象   |

------

## 🔍 三级缓存解决循环依赖的流程

1. **实例化 Bean**
    Spring 创建 Bean 实例，但还未进行依赖注入（属性填充）。
2. **放入三级缓存**
    将创建好的 Bean 工厂对象（ObjectFactory）放入三级缓存 `singletonFactories`。
3. **提前暴露半成品 Bean**
    当另一个 Bean 需要此 Bean 时，先从三级缓存获取 ObjectFactory，调用其 `getObject()` 方法，生成并放入二级缓存 `earlySingletonObjects`。
4. **依赖注入完成**
    完成依赖注入，Bean 初始化完成后，移除三级缓存和二级缓存，放入一级缓存（成品池）。

------

## 📈 简单示意图

```
BeanA -> 需要 BeanB
BeanB -> 需要 BeanA

创建 BeanA 实例（未填充属性）
  ↓
放入三级缓存 singletonFactories（工厂）
  ↓
BeanA 依赖 BeanB，创建 BeanB 实例，放入三级缓存
  ↓
BeanB 依赖 BeanA，从三级缓存取 ObjectFactory，暴露 BeanA 半成品
  ↓
属性填充完成，BeanA、BeanB 均完成初始化，放入一级缓存
```

------

## ⚠️ 注意事项

- 仅**单例 Bean**支持通过三级缓存解决循环依赖，原型 Bean 不支持。
- 三级缓存中的 ObjectFactory 能够延迟创建对象，避免死循环。
- Spring 只能解决构造器注入（constructor injection）外的循环依赖问题，构造器注入的循环依赖会抛异常。

------

## 📝 面试答题模板

> Spring 通过三级缓存机制解决循环依赖问题。首先在实例化 Bean 时，将其 ObjectFactory 放入三级缓存，允许提前暴露半成品 Bean。当其他 Bean 需要注入时，可以先从三级缓存拿到半成品 Bean 进行依赖注入。注入完成后，Bean 移入一级缓存，完成生命周期。该机制只适用于单例 Bean，且不能解决构造器注入的循环依赖。