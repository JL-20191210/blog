---
icon: fa-file
date: 2025-01-06
category:
  - MyBatis-Plus
tag:
  - 接口文档
---

# `MetaObjectHandler` 接口文档

> `MetaObjectHandler` 接口是一个与 MyBatis-Plus 插件相关的接口，主要用于插入和更新操作中自动填充字段的处理。此接口提供了一系列的方法，供开发者在处理数据库操作时动态填充字段值。以下是接口的详细说明及方法文档。

<!-- more -->
## 接口概述

`MetaObjectHandler` 提供了对数据库实体类字段自动填充的支持，主要用于在插入或更新操作时动态地为指定字段赋值。该接口方法涵盖了插入和更新字段填充、获取和设置字段值、以及严格模式下的填充策略等。

## 方法概览

### 1. `openInsertFill()`
```java
default boolean openInsertFill()
```
**功能**: 指示是否开启插入时的字段自动填充功能。

**返回值**:  
- `true`: 开启插入填充。
- `false`: 禁用插入填充。

默认返回 `true`。

### 2. `openUpdateFill()`
```java
default boolean openUpdateFill()
```
**功能**: 指示是否开启更新时的字段自动填充功能。

**返回值**:  
- `true`: 开启更新填充。
- `false`: 禁用更新填充。

默认返回 `true`。

### 3. `insertFill(MetaObject metaObject)`
```java
void insertFill(MetaObject metaObject)
```
**功能**: 插入时的字段填充方法，必须实现此方法来完成插入时的字段填充。

### 4. `updateFill(MetaObject metaObject)`
```java
void updateFill(MetaObject metaObject)
```
**功能**: 更新时的字段填充方法，必须实现此方法来完成更新时的字段填充。

### 5. `setFieldValByName(String fieldName, Object fieldVal, MetaObject metaObject)`
```java
default MetaObjectHandler setFieldValByName(String fieldName, Object fieldVal, MetaObject metaObject)
```
**功能**: 根据字段名设置指定字段的值。

**参数**:  
- `fieldName`: 字段名称。
- `fieldVal`: 要设置的字段值。
- `metaObject`: 当前的 `MetaObject` 实例。

**返回值**: 返回当前的 `MetaObjectHandler` 实例，支持链式调用。

### 6. `getFieldValByName(String fieldName, MetaObject metaObject)`
```java
default Object getFieldValByName(String fieldName, MetaObject metaObject)
```
**功能**: 根据字段名获取字段的值。

**返回值**: 返回字段值，如果字段不存在则返回 `null`。

### 7. `findTableInfo(MetaObject metaObject)`
```java
default TableInfo findTableInfo(MetaObject metaObject)
```
**功能**: 获取当前对象的表信息（如表名、字段信息等）。

**返回值**: 返回一个 `TableInfo` 实例，包含了表相关的元数据信息。

### 8. `strictInsertFill(MetaObject metaObject, String fieldName, Class<T> fieldType, E fieldVal)`
```java
default <T, E extends T> MetaObjectHandler strictInsertFill(MetaObject metaObject, String fieldName, Class<T> fieldType, E fieldVal)
```
**功能**: 在插入操作中，严格填充指定字段的值。

**参数**:  
- `metaObject`: 当前的 `MetaObject` 实例。
- `fieldName`: 字段名。
- `fieldType`: 字段类型。
- `fieldVal`: 字段值。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 9. `strictInsertFill(MetaObject metaObject, String fieldName, Supplier<E> fieldVal, Class<T> fieldType)`
```java
default <T, E extends T> MetaObjectHandler strictInsertFill(MetaObject metaObject, String fieldName, Supplier<E> fieldVal, Class<T> fieldType)
```
**功能**: 在插入操作中，严格填充指定字段的值，字段值通过 `Supplier` 提供。

**参数**:  
- `metaObject`: 当前的 `MetaObject` 实例。
- `fieldName`: 字段名。
- `fieldType`: 字段类型。
- `fieldVal`: 通过 `Supplier` 提供的字段值。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 10. `strictInsertFill(TableInfo tableInfo, MetaObject metaObject, List<StrictFill<?, ?>> strictFills)`
```java
default MetaObjectHandler strictInsertFill(TableInfo tableInfo, MetaObject metaObject, List<StrictFill<?, ?>> strictFills)
```
**功能**: 在插入操作中，严格填充多个字段的值。

**参数**:  
- `tableInfo`: 当前表的信息。
- `metaObject`: 当前的 `MetaObject` 实例。
- `strictFills`: 一个包含多个严格填充信息的列表。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 11. `strictUpdateFill(MetaObject metaObject, String fieldName, Class<T> fieldType, E fieldVal)`
```java
default <T, E extends T> MetaObjectHandler strictUpdateFill(MetaObject metaObject, String fieldName, Class<T> fieldType, E fieldVal)
```
**功能**: 在更新操作中，严格填充指定字段的值。

**参数**:  
- `metaObject`: 当前的 `MetaObject` 实例。
- `fieldName`: 字段名。
- `fieldType`: 字段类型。
- `fieldVal`: 字段值。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 12. `strictUpdateFill(MetaObject metaObject, String fieldName, Supplier<E> fieldVal, Class<T> fieldType)`
```java
default <T, E extends T> MetaObjectHandler strictUpdateFill(MetaObject metaObject, String fieldName, Supplier<E> fieldVal, Class<T> fieldType)
```
**功能**: 在更新操作中，严格填充指定字段的值，字段值通过 `Supplier` 提供。

**参数**:  
- `metaObject`: 当前的 `MetaObject` 实例。
- `fieldName`: 字段名。
- `fieldType`: 字段类型。
- `fieldVal`: 通过 `Supplier` 提供的字段值。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 13. `strictUpdateFill(TableInfo tableInfo, MetaObject metaObject, List<StrictFill<?, ?>> strictFills)`
```java
default MetaObjectHandler strictUpdateFill(TableInfo tableInfo, MetaObject metaObject, List<StrictFill<?, ?>> strictFills)
```
**功能**: 在更新操作中，严格填充多个字段的值。

**参数**:  
- `tableInfo`: 当前表的信息。
- `metaObject`: 当前的 `MetaObject` 实例。
- `strictFills`: 一个包含多个严格填充信息的列表。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 14. `strictFill(boolean insertFill, TableInfo tableInfo, MetaObject metaObject, List<StrictFill<?, ?>> strictFills)`
```java
default MetaObjectHandler strictFill(boolean insertFill, TableInfo tableInfo, MetaObject metaObject, List<StrictFill<?, ?>> strictFills)
```
**功能**: 根据插入或更新操作，严格填充指定字段。

**参数**:  
- `insertFill`: 是否是插入操作。
- `tableInfo`: 当前表的信息。
- `metaObject`: 当前的 `MetaObject` 实例。
- `strictFills`: 需要填充的字段列表。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 15. `fillStrategy(MetaObject metaObject, String fieldName, Object fieldVal)`
```java
default MetaObjectHandler fillStrategy(MetaObject metaObject, String fieldName, Object fieldVal)
```
**功能**: 根据字段值是否为空，决定是否进行字段填充。

**参数**:  
- `metaObject`: 当前的 `MetaObject` 实例。
- `fieldName`: 字段名。
- `fieldVal`: 字段值。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

### 16. `strictFillStrategy(MetaObject metaObject, String fieldName, Supplier<?> fieldVal)`
```java
default MetaObjectHandler strictFillStrategy(MetaObject metaObject, String fieldName, Supplier<?> fieldVal)
```
**功能**: 在严格模式下，根据字段值是否为空，决定是否进行字段填充，字段值通过 `Supplier` 提供。

**参数**:  
- `metaObject`: 当前的 `MetaObject` 实例。
- `fieldName`: 字段名。
- `fieldVal`: 通过 `Supplier` 提供的字段值。

**返回值**: 返回当前的 `MetaObjectHandler` 实例。

## 总结

> `MetaObjectHandler` 接口为 MyBatis-Plus 提供了灵活的自动填充功能，支持在插入和更新操作中自动填充字段，且支持严格模式下的字段填充。