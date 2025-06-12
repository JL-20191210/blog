# Java 面试答题卡：设计原则反例 —— 里氏替换原则（LSP）

---

## 🧠 原则简介

**LSP（Liskov Substitution Principle）—— 里氏替换原则：**  
> 所有引用基类的地方必须能透明地使用其子类对象，且不会引发错误或改变程序原有逻辑。

---

## ❌ 经典反例：正方形继承矩形

### 代码示例：

```java
class Rectangle {
    protected int width;
    protected int height;

    public void setWidth(int w) { this.width = w; }
    public void setHeight(int h) { this.height = h; }
    public int getArea() { return width * height; }
}

class Square extends Rectangle {
    @Override
    public void setWidth(int w) {
        this.width = w;
        this.height = w;  // 强制长宽相等
    }

    @Override
    public void setHeight(int h) {
        this.width = h;
        this.height = h;  // 同样强制长宽相等
    }
}

public void resize(Rectangle r) {
    r.setWidth(5);
    r.setHeight(10);
    System.out.println(r.getArea()); // 预期输出 50
}
```

- `resize(new Rectangle())` 输出 50 ✅
- `resize(new Square())` 输出 100 ❌

### 🚨 问题分析：

虽然数学上正方形是矩形的特例，但在程序中，**正方形不能独立修改宽和高**，这破坏了 `Rectangle` 的使用契约。
 因此，把 `Square` 替换为 `Rectangle` 使用时行为改变 —— **违反 LSP**。

------

## ✅ 正确做法（组合优于继承）

```java
class Square {
    private int side;

    public void setSide(int s) { this.side = s; }
    public int getArea() { return side * side; }
}
```

- 不再继承 `Rectangle`
- 将其作为独立类设计，职责更明确，不破坏父类行为契约

------

## 🗣 面试总结句式

> 正方形继承矩形是经典违反 LSP 的例子。在 OO(面向对象) 设计中，子类必须能完全替代父类，且不改变其原有行为逻辑。正方形因约束太强，无法满足矩形对宽高独立修改的预期，容易导致系统潜在 bug，应采用组合替代继承。
