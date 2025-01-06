---
icon: fa-solid fa-hashtag
date: 2025-01-06
category:
  - MyBatis-Plus
tag:
  - 注解
---
# @TableField

> `@TableField` 是 MyBatis-Plus 提供的注解，用于指定实体类字段与数据库表列之间的映射关系，并可以进行一些字段属性的控制。它的常用方法可以帮助我们灵活地配置字段的行为，特别是在执行数据库操作时，如何映射字段、处理自动填充等。

### `@TableField` 常用属性总结

1. **value**: 
   
   - **说明**：指定字段对应的数据库表列名。
   - **类型**：`String`
   - **示例**：
     ```java
     @TableField("user_name")
     private String userName;
     ```
   
2. **exist**: 
   - **说明**：指定该字段是否参与数据库映射。默认值是 `true`，表示该字段会参与数据库操作。
   - **类型**：`boolean`（默认为 `true`）
   - **示例**：
     ```java
     @TableField(exist = false)
     private String tempField; // 该字段不会映射到数据库
     ```

3. **fill**: 
   - **说明**：指定字段的自动填充策略，可以通过 `FieldFill` 枚举来设置填充操作的时机。
   
   - **类型**：`FieldFill`
   - **常用值**：
     - `FieldFill.INSERT`: 插入时填充。
     - `FieldFill.UPDATE`: 更新时填充。
     - `FieldFill.INSERT_UPDATE`: 插入或更新时填充。
     - `FieldFill.DEFAULT`: 默认行为，通常不进行自动填充。
   - **示例**：
     ```java
     @TableField(fill = FieldFill.INSERT)
     private Long createTime;  // 只在插入时自动填充
     ```
   
4. **updateStrategy**: 
   - **说明**：指定更新时的策略。主要用于在更新操作时，决定是否更新该字段。
   - **类型**：`FieldStrategy`
   - **常用值**：
     - `FieldStrategy.NOT_NULL`: 更新时只有非 `null` 的字段才会更新。
     - `FieldStrategy.IGNORED`: 更新时忽略该字段。
     - `FieldStrategy.NOT_EMPTY`: 更新时只有字段非空时才会更新。
     - `FieldStrategy.DEFAULT`: 默认行为。
   - **示例**：
     ```java
     @TableField(updateStrategy = FieldStrategy.NOT_NULL)
     private String name;  // 更新时仅当该字段不为null时才会更新
     ```

5. **insertStrategy**:
   - **说明**：指定插入时的策略。与 `updateStrategy` 类似，但它是在插入操作时生效的。
   - **类型**：`FieldStrategy`
   - **常用值**：
     - `FieldStrategy.NOT_NULL`: 插入时只有非 `null` 的字段才会插入。
     - `FieldStrategy.IGNORED`: 插入时忽略该字段。
     - `FieldStrategy.NOT_EMPTY`: 插入时只有字段非空时才会插入。
     - `FieldStrategy.DEFAULT`: 默认行为。
   - **示例**：
     ```java
     @TableField(insertStrategy = FieldStrategy.NOT_NULL)
     private String email;  // 插入时仅当该字段不为null时才会插入
     ```

6. **select**: 
   - **说明**：指定该字段在查询时是否参与查询操作。默认为 `true`，表示该字段会参与查询。
   - **类型**：`boolean`
   - **示例**：
     ```java
     @TableField(select = false)
     private String password; // 查询时不包含该字段
     ```

7. **typeHandler**: 
   - **说明**：指定字段使用的 `TypeHandler`，用于处理数据库类型与 Java 类型之间的转换。一般用于特殊类型的字段，例如枚举类型、JSON 类型等。
   - **类型**：`Class<? extends TypeHandler<?>>`
   - **示例**：
     ```java
     @TableField(typeHandler = MyEnumTypeHandler.class)
     private MyEnum status; // 自定义 TypeHandler 用于 MyEnum 类型的字段
     ```

8. **el**:
   - **说明**：指定字段在 SQL 语句中是否作为 `null` 使用。可选值为：
     - `true`：字段在 SQL 中作为 `null` 处理。
     - `false`：字段在 SQL 中不会作为 `null` 使用。
   - **类型**：`boolean`
   - **示例**：
     ```java
     @TableField(el = "status!=null")
     private Integer status; // 如果 status 不为 null 则会在 SQL 语句中作为字段插入
     ```

---

### 综合示例

下面是一个使用 `@TableField` 注解的实际示例：

```java
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.enums.FieldFill;
import com.baomidou.mybatisplus.enums.FieldStrategy;

@TableName("user")
public class User {

    private Long id;

    @TableField("user_name")
    private String userName;

    @TableField(exist = false)
    private String tempField;  // 不映射到数据库

    @TableField(fill = FieldFill.INSERT)
    private Long createTime; // 只在插入时填充

    @TableField(fill = FieldFill.UPDATE)
    private Long updateTime; // 只在更新时填充

    @TableField(updateStrategy = FieldStrategy.NOT_NULL)
    private String name;  // 更新时仅当该字段不为null时才会更新

    @TableField(select = false)
    private String password;  // 查询时不返回该字段

    @TableField(typeHandler = MyEnumTypeHandler.class)
    private MyEnum status; // 自定义枚举类型处理器

    // getter 和 setter
}
```

---

### 总结

`@TableField` 注解的常用属性有：

- `value`: 映射数据库字段名。
- `exist`: 是否参与数据库映射。
- `fill`: 自动填充策略（`FieldFill` 枚举）。
- `updateStrategy`: 更新时的策略（`FieldStrategy` 枚举）。
- `insertStrategy`: 插入时的策略（`FieldStrategy` 枚举）。
- `select`: 是否参与查询操作。
- `typeHandler`: 自定义类型处理器。
- `el`: SQL 语句中字段的 `null` 处理方式。

这些属性可以帮助你精确控制实体类字段与数据库表字段之间的映射关系，以及执行操作时字段的行为。