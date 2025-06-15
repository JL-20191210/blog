# ☕Java 面试答题卡：开放封闭原则（OCP）

------

## 🧠 原则简介

**开放封闭原则（OCP，Open-Closed Principle）：**

> 软件实体（类、模块、函数等）应该对扩展开放，对修改封闭。
>  意思是说，系统功能可以通过扩展来实现，而不应该通过修改已有代码来实现。

------

## ❌ 反例：修改已有代码实现新功能

```java
class GraphicEditor {
    public void drawShape(Shape shape) {
        if (shape.type == 1) {
            drawCircle(shape);
        } else if (shape.type == 2) {
            drawRectangle(shape);
        }
        // 新增形状时需要修改此方法，违反OCP
    }

    private void drawCircle(Shape shape) { /* 画圆形 */ }

    private void drawRectangle(Shape shape) { /* 画矩形 */ }
}
```

- 每增加一种形状，都需要修改 `drawShape` 方法，违反开放封闭原则。

------

## ✅ 正确做法：通过继承和多态实现扩展

```java
abstract class Shape {
    abstract void draw();
}

class Circle extends Shape {
    @Override
    void draw() {
        System.out.println("画圆形");
    }
}

class Rectangle extends Shape {
    @Override
    void draw() {
        System.out.println("画矩形");
    }
}

class GraphicEditor {
    public void drawShape(Shape shape) {
        shape.draw();  // 多态调用，新增形状不需修改此代码
    }
}
```

- 新增形状只需新增子类，`GraphicEditor` 类代码无需修改，符合OCP。

------

## 🔗 开放封闭原则的好处

- 提高代码的可维护性和可扩展性。
- 降低修改已有代码带来的风险。
- 促进使用抽象和多态，实现灵活设计。

------

## 🗣 面试总结句式

> 开放封闭原则要求对功能扩展开放，对代码修改封闭，通常通过抽象和多态实现，避免频繁修改已有代码，提高系统的稳定性和扩展能力。