# 📝 SQL CTE（Common Table Expression）全面解析

在 SQL 开发中，CTE（Common Table Expression，公共表表达式）是一种提高可读性和可维护性的工具。本文将系统介绍 CTE 的用法、优势、性能注意事项以及在不同数据库中的特性。

------

## 1️⃣ CTE 的基本概念

CTE 是 SQL-92 引入的语法糖，用于在 SQL 语句中定义一个临时的结果集，供后续查询使用。
 CTE 可以让 SQL 更清晰，尤其是在多层嵌套查询或递归查询中非常有用。

**语法示例：**

```sql
WITH cte_name AS (
    SELECT column1, column2
    FROM table
    WHERE condition
)
SELECT *
FROM cte_name
WHERE ...
```

------

## 2️⃣ 多个 CTE 的写法

一个 `WITH` 子句中可以定义多个 CTE，用逗号分隔，后面的 CTE 可以引用前面的 CTE：

```sql
WITH t1 AS (
    SELECT requester_id AS id FROM RequestAccepted
    UNION ALL
    SELECT accepter_id FROM RequestAccepted
),
t2 AS (
    SELECT id, COUNT(*) AS cnt
    FROM t1
    GROUP BY id
),
t3 AS (
    SELECT id
    FROM t2
    WHERE cnt = (SELECT MAX(cnt) FROM t2)
)
SELECT * FROM t3;
```

✅ 执行逻辑：

1. `t1`：合并 requester_id 和 accepter_id
2. `t2`：统计每个用户出现次数
3. `t3`：找出出现次数最多的用户
4. 最终查询 `t3`

------

## 3️⃣ 递归 CTE

CTE 支持递归，用于层级或树形结构查询，例如分类表、组织架构表等。

```sql
WITH RECURSIVE cte AS (
    SELECT id, parent_id FROM category WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.parent_id
    FROM category c
    JOIN cte ON c.parent_id = cte.id
)
SELECT * FROM cte;
```

- 第一部分是基准查询（anchor member）
- 第二部分是递归查询（recursive member）
- 数据库会迭代执行直到不再产生新行

------

## 4️⃣ CTE vs 子查询 vs 临时表

| 特性       | CTE                                     | 子查询             | 临时表                     |
| ---------- | --------------------------------------- | ------------------ | -------------------------- |
| 可读性     | 高，逻辑清晰                            | 中，嵌套多层时难读 | 高，但需要额外建表         |
| 可复用     | 是（在同一 SQL 内）                     | 否                 | 是（跨 SQL 可用）          |
| 性能       | 大部分数据库和子查询差不多              | 取决于优化器       | 大数据量可加索引，性能最好 |
| 递归       | 支持递归 CTE                            | 不支持             | 不支持                     |
| 支持数据库 | PostgreSQL, MySQL8+, SQL Server, Oracle | 所有               | 所有                       |

------

## 5️⃣ CTE 性能注意事项

1. **普通 CTE**：大部分数据库把它当作子查询，性能和子查询差不多。
2. **PostgreSQL < 12**：CTE 默认会物化（MATERIALIZED），相当于生成临时表，可能导致性能下降。
   - PostgreSQL 12+ 可以用 `NOT MATERIALIZED` 让优化器内联。
3. **递归 CTE**：每次迭代都会生成临时结果集，注意数据量不要过大。
4. **使用场景**：
   - 多层嵌套查询
   - 复用中间结果
   - 层级/树形结构查询

------

## 6️⃣ 面试常考点总结

- 一个 SQL 语句中 **只能有一个 `WITH` 开头**，但可以定义多个 CTE。
- 后面的 CTE 可以引用前面的 CTE。
- `JOIN`、`GROUP BY` 等操作可以在 CTE 内部完成，逻辑更清晰。
- 递归 CTE 可以解决层级查询问题。
- 性能上大部分情况下与子查询相似，PostgreSQL 旧版本需注意物化问题。

------

## 7️⃣ 面试示例回答

> “CTE 是 SQL 的公共表表达式，可以在一个 SQL 语句中定义临时表供后续查询使用。一个 WITH 子句可以定义多个 CTE，后面的 CTE 可以引用前面的 CTE。CTE 支持递归查询，适合树形结构。性能上大多数数据库和子查询差不多，PostgreSQL 12 之前默认物化，需要注意。相比子查询，CTE 可读性更好，尤其是多层嵌套或复用中间结果时。”