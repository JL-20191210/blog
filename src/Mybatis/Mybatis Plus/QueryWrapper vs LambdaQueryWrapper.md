---
icon: mybatis plus
date: 2024-11-26
category:
  - Mybatis
tag:
  - 查询
---
# QueryWrapper vs LambdaQueryWrapper

> 在使用 MyBatis-Plus 进行数据库操作时，查询条件的构造是一个常见的任务。MyBatis-Plus 提供了两种主要的查询条件构造器：`QueryWrapper` 和 `LambdaQueryWrapper`。

<!-- more -->
### QueryWrapper

`QueryWrapper` 是 MyBatis-Plus 最早引入的查询条件构造器之一。通过 `QueryWrapper`，我们可以手动指定字段名、条件和数值来构建查询条件。例如，`eq("name", "Alice")` 表示等于条件。

主要特点：
- 需要传递实体类的 Class 对象。
- 手动指定字段名和条件。
- 不支持 Lambda 表达式。

### LambdaQueryWrapper

`LambdaQueryWrapper` 是 MyBatis-Plus 3.4.0 版本引入的新特性，基于 Lambda 表达式的查询条件构造器。使用 `LambdaQueryWrapper`，我们可以使用 Lambda 表达式来指定条件，更加简洁和类型安全。例如，`eq(User::getName, "Alice")`。

主要特点：
- 不需要传递实体类的 Class 对象。
- 使用 Lambda 表达式指定条件。
- 类型安全，避免手动输入字段名带来的错误。

### 选择合适的查询条件构造器

根据项目的实际情况，我们可以灵活选择使用 `QueryWrapper` 或 `LambdaQueryWrapper`。如果项目使用的是 MyBatis-Plus 3.4.0 版本及以上，推荐使用 `LambdaQueryWrapper`，以便利用其简洁、类型安全的特性。而对于旧版本的项目，仍然可以继续使用 `QueryWrapper`。
