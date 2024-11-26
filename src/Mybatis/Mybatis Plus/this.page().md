---
icon: mybatis plus
date: 2024-11-26
category:
  - Mybatis
tag:
  - 查询
---
# this.page()

# 分页

在 **MyBatis-Plus** 中，`this.page()` 是 `BaseMapper` 或 `Service` 接口提供的分页查询方法，用于简化分页操作。其主要作用是查询指定页的数据，并返回分页结果。

---

<!-- more -->
### **`this.page()` 的常用用法**
#### **语法**
```java
IPage<T> page(IPage<T> page, Wrapper<T> queryWrapper);
```

- `page`: 分页对象，包含分页信息（当前页、每页条数）。
- `queryWrapper`: 查询条件构造器（可以为空，不传表示查询全部数据）。

---

### **示例代码**

#### **1. 基本分页查询**
```java
// 假设你的实体类是 User
Page<User> page = new Page<>(1, 10); // 查询第 1 页，每页 10 条
IPage<User> result = this.page(page);

List<User> users = result.getRecords(); // 当前页数据
long total = result.getTotal();         // 总记录数
long pages = result.getPages();         // 总页数
long current = result.getCurrent();     // 当前页号
long size = result.getSize();           // 每页条数
```

**生成的 SQL**：
```sql
SELECT * FROM user LIMIT 0, 10; -- MySQL 示例
```

---

#### **2. 带条件的分页查询**
```java
Page<User> page = new Page<>(1, 10); // 查询第 1 页，每页 10 条
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.eq("status", 1).like("username", "admin");

IPage<User> result = this.page(page, wrapper);
List<User> users = result.getRecords();
```

**生成的 SQL**：
```sql
SELECT * FROM user WHERE status = 1 AND username LIKE '%admin%' LIMIT 0, 10;
```

---

### **分页对象的常用方法**

#### **创建分页对象**
```java
Page<T> page = new Page<>(currentPage, pageSize);
```

- `currentPage`: 当前页号（从 1 开始）。
- `pageSize`: 每页条数。

#### **`IPage<T>` 的方法**
1. **`getRecords()`**: 获取当前页的记录列表。
2. **`getTotal()`**: 获取总记录数。
3. **`getPages()`**: 获取总页数。
4. **`getCurrent()`**: 获取当前页号。
5. **`getSize()`**: 获取每页条数。

---

### **高级用法**
#### **排序分页**
`Page` 支持排序功能：
```java
Page<User> page = new Page<>(1, 10);
page.addOrder(OrderItem.asc("username")); // 按 username 升序排序
page.addOrder(OrderItem.desc("create_time")); // 按 create_time 降序排序

IPage<User> result = this.page(page);
```

**生成的 SQL**：
```sql
SELECT * FROM user ORDER BY username ASC, create_time DESC LIMIT 0, 10;
```

---

### **适用场景**
1. **分页展示数据**：如列表页、表格组件。
2. **大数据查询优化**：通过分页限制查询范围，避免查询过多数据。
3. **动态条件组合**：结合 `QueryWrapper` 构造灵活查询条件。

---

### **注意事项**
1. **分页从 1 开始**：分页对象的 `currentPage` 从 1 开始，而不是从 0。
2. **性能优化**：对于大表分页，尽量使用索引字段进行排序（避免全表扫描）。
3. **分页插件配置**：确保项目中已启用 MyBatis-Plus 的分页插件。

这是 `this.page()` 的常见用法，如果需要其他扩展功能可以告诉我！