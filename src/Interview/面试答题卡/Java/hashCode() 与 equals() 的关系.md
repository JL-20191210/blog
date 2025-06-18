 # ☕ Java面试答题卡：hashCode() 与 equals() 的关系？

## ❓面试题目

> **在 Java 中，hashCode() 方法与 equals() 方法有什么关系？为什么必须同时重写？**

### **✅ 答题要点**

| **关键点**       | **说明**                                                     |
| ---------------- | ------------------------------------------------------------ |
| 逻辑含义         | equals() 用来判断**两个对象的“逻辑相等”**；hashCode() 用来计算**对象在散列表中的桶位置**。 |
| 合同（Contract） | **若 a.equals(b) 为 true，则 a.hashCode() == b.hashCode() 必须成立**。反之不要求：false 的对象可以具有相同的哈希值（允许碰撞）。 |
| 适用场景         | 所有基于哈希结构的容器（HashMap、HashSet、Hashtable、ConcurrentHashMap 等）都会**先比 hashCode，再根据 equals 判定真正相等**。 |
| 同步重写         | 只重写其一会破坏合同，引发集合语义错误或数据丢失。           |

### **1️⃣ 合同（contract）细节**

```
1. 对称性：x.equals(y) ⇔ y.equals(x)
2. 传递性：x=y 且 y=z ⇒ x=z
3. 自反性：x.equals(x) 必须为 true
4. 一致性：多次比较结果一致
5. 与 hashCode 约定：
   - 若 x.equals(y) 为 true ⇒ x.hashCode() == y.hashCode()
   - 若 x.equals(y) 为 false ⇒ 不做强制要求
```

### **2️⃣ 违反合同的后果示例**

```
class BadPoint {
    int x, y;

    // 仅重写 equals，忘记重写 hashCode
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj instanceof BadPoint p) {
            return x == p.x && y == p.y;
        }
        return false;
    }
}

BadPoint p1 = new BadPoint(1, 2);
BadPoint p2 = new BadPoint(1, 2);
Set<BadPoint> set = new HashSet<>();
set.add(p1);
set.add(p2);           // 逻辑上相等，却被当成不同元素存两份
System.out.println(set.size()); // 2（错误）
```

**原因**：p1 与 p2 的 hashCode() 不一致，各落入不同桶，equals() 来不及判重。

### **3️⃣ 正确的同步重写示例**

```
class Point {
    int x, y;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj instanceof Point p) {
            return x == p.x && y == p.y;
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y); // JDK 提供的简洁工具
    }
}
```

| **步骤**            | **容器内部逻辑**       |
| ------------------- | ---------------------- |
| ① 计算 hashCode()   | 找到桶（数组索引）     |
| ② 桶内链表 / 红黑树 | 再用 equals() 精确比较 |

### **4️⃣ 实战建议**

1. **全部或全不**
   - 若类打算放进哈希容器 → 同时重写 equals & hashCode。
   - 若保持继承自 Object 的行为 → 两者都别动。
2. **使用 IDE / Lombok**
   - 大部分 IDE 能自动生成；@EqualsAndHashCode 可减少手写错误。
3. **避免可变键**
   - 作为 HashMap 键的对象字段应尽量不可变；修改后散列位置会失效。
4. **重写 toString()**（加分）
   - 方便调试，配合 equals/hashCode 更完整。

### **☑️ 记忆口诀**

> “**相等必同码，不同可撞码**；重写要成对，哈希先分家，equals 再相认。”