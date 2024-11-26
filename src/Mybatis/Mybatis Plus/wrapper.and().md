---
icon: mybatis plus
date: 2024-11-26
category:
  - Mybatis
tag:
  - 查询
---
# wrapper.and()

在 **MyBatis-Plus** 中，`wrapper.and` 是用来添加分组条件的，它的主要作用是将多个条件逻辑分组，以便生成带括号的 SQL 语句。

<!-- more -->
### **`and` 的基本用法**
`and` 方法的核心是接受一个 `Consumer<QueryWrapper<T>>` 类型的参数，你可以在这个 `Consumer` 中继续定义查询条件。`and` 会在生成的 SQL 中用括号将这些条件包裹起来。

#### **语法**
```java
wrapper.and(consumer -> {
    consumer.eq("字段1", 值1)
            .or()
            .like("字段2", 值2);
});
```

#### **生成的 SQL**
```sql
WHERE (字段1 = 值1 OR 字段2 LIKE '%值2%')
```

---

### **`and` 的常见场景**
#### **1. 单独一组条件**
当你希望对某些条件加括号分组时使用：
```java
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.and(obj -> obj.eq("username", "admin").or().like("email", "admin"));
```

**生成 SQL**：
```sql
WHERE (username = 'admin' OR email LIKE '%admin%')
```

---

#### **2. 与其他条件组合**
结合 `and` 与外部条件：
```java
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.eq("status", 1) // 主条件
       .and(obj -> obj.eq("username", "admin").or().like("email", "admin"));
```

**生成 SQL**：
```sql
WHERE status = 1 AND (username = 'admin' OR email LIKE '%admin%')
```

---

#### **3. 根据条件动态添加 `and` 分组**
使用 `if` 动态添加分组：
```java
QueryWrapper<User> wrapper = new QueryWrapper<>();
boolean needGroup = true; // 是否需要分组条件
wrapper.eq("status", 1); // 主条件

if (needGroup) {
    wrapper.and(obj -> obj.eq("username", "admin").or().like("email", "admin"));
}
```

**生成 SQL**：
- 当 `needGroup = true` 时：
```sql
WHERE status = 1 AND (username = 'admin' OR email LIKE '%admin%')
```
- 当 `needGroup = false` 时：
```sql
WHERE status = 1
```

---

### **注意事项**
1. **分组语法的作用**：`and` 中的条件会被括号包围，方便与外部条件正确地逻辑结合，避免产生意外的优先级问题。
2. **链式调用规则**：在 `and` 内部可以继续使用 `eq`、`like`、`or` 等方法，外部也可以继续链式调用主条件。
3. **不要忘记逻辑运算符**：在 `and` 内部需要明确用 `.or()` 等方法指定条件之间的逻辑关系。

如果有更复杂的查询需求，可以进一步细化条件结构。