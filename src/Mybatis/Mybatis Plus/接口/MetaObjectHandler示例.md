---
icon: fa-screwdriver-wrench
date: 2025-01-06
category:
  - MyBatis-Plus
tag:
  - 接口示例
---
# MetaObjectHandler示例

> `MetaObjectHandler` 是 MyBatis-Plus 提供的一个接口，用于处理自动填充（自动填充字段）功能。通过实现这个接口，可以在执行插入或更新操作时，自动为指定字段填充数据，比如填充创建时间、更新时间等常见字段。

<!-- more -->
### `MetaObjectHandler` 的作用

1. **自动填充功能**：
   - MyBatis-Plus 提供了自动填充机制，允许在执行数据库操作时（如插入或更新）自动为特定字段填充数据。这对于常见的字段（例如 `create_time`、`update_time`、`create_by`、`update_by` 等）非常有用，避免了每次手动设置这些字段值。
   
2. **增强实体类字段与数据库操作的一致性**：
   - 使用 `MetaObjectHandler` 统一处理字段的自动填充，不仅减少了重复代码，还确保了字段填充的一致性。

### `MetaObjectHandler` 的实现

`MetaObjectHandler` 是一个接口，需要实现该接口并重写 `insertFill` 和 `updateFill` 方法，分别用于插入和更新操作时的自动填充。

#### 1. `insertFill(MetaObject metaObject)` 方法
该方法在插入操作时会被调用，可以在其中对实体类中的字段进行自动填充。

#### 2. `updateFill(MetaObject metaObject)` 方法
该方法在更新操作时会被调用，可以在其中对实体类中的字段进行自动填充。

### 实现 `MetaObjectHandler` 示例

假设我们有一个 `User` 实体类，其中有 `create_time` 和 `update_time` 字段，我们希望在插入和更新时自动填充这两个字段。

```java
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    // 插入时自动填充
    @Override
    public void insertFill(MetaObject metaObject) {
        // 获取当前时间，填充 create_time 字段
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        // 填充 update_time 字段
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }

    // 更新时自动填充
    @Override
    public void updateFill(MetaObject metaObject) {
        // 获取当前时间，填充 update_time 字段
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

### 说明：

1. **`strictInsertFill`** 和 **`strictUpdateFill`**：
   - 这两个方法是 `MetaObjectHandler` 提供的辅助方法，用于自动填充字段。
   - `strictInsertFill`：用于插入时自动填充字段，传入的参数是：
     - `metaObject`：包含了实体对象的元数据。
     - `fieldName`：需要填充的字段名称。
     - `fieldType`：字段的数据类型。
     - `value`：要填充的字段值。
   - `strictUpdateFill`：用于更新时自动填充字段，功能与 `strictInsertFill` 类似。

2. **`MetaObject`**：
   - `MetaObject` 是 MyBatis 提供的一个对象，它封装了对实体类对象的反射操作。在 `insertFill` 和 `updateFill` 方法中，我们通过它来访问和操作实体类中的字段。

3. **自动填充的时机**：
   - 在执行插入操作时，`insertFill` 会被调用，自动为 `createTime` 和 `updateTime` 字段填充值。
   - 在执行更新操作时，`updateFill` 会被调用，自动为 `updateTime` 字段填充值。

### 配置 `MetaObjectHandler`

要使 `MetaObjectHandler` 工作，通常需要做如下配置：

1. **将实现 `MetaObjectHandler` 的类标记为 Spring Bean**：
   - 可以通过 `@Component` 或其他方式将实现类注册为 Spring 管理的 Bean，以便 MyBatis-Plus 能够找到并使用它。

2. **MyBatis-Plus 自动识别**：
   - 只要 `MetaObjectHandler` 被实现并作为 Spring Bean 加载，MyBatis-Plus 会自动识别并在插入、更新操作时调用相应的方法。

### 完整示例

假设我们有一个 `User` 实体类，代码如下：

```java
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

@TableName("user")
public class User {

    private Long id;
    
    private String username;
    
    private String password;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    // getter and setter
}
```

然后我们实现 `MetaObjectHandler`：

```java
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    // 插入时自动填充
    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }

    // 更新时自动填充
    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

### 总结

- `MetaObjectHandler` 允许在插入和更新操作时自动填充实体类字段的值。
- 只需要实现 `insertFill` 和 `updateFill` 方法来定义填充逻辑。
- MyBatis-Plus 提供了便捷的方法来进行字段的自动填充，常用于处理创建时间、更新时间等字段。