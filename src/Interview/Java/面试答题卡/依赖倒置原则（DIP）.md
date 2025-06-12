

# Java 面试答题卡：依赖倒置原则（DIP）

------

## 🧠 原则简介

**依赖倒置原则（DIP，Dependency Inversion Principle）**

> 高层模块不应该依赖低层模块，二者都应该依赖抽象（接口或抽象类）。
>  抽象不应该依赖细节，细节应该依赖抽象。

------

## ❌ 反例：高层模块依赖低层模块实现

```java
class MySQLDatabase {
    public void saveData(String data) {
        System.out.println("保存数据到 MySQL: " + data);
    }
}

class UserService {
    private MySQLDatabase db = new MySQLDatabase();

    public void saveUser(String user) {
        db.saveData(user);
    }
}
```

- UserService 直接依赖具体实现 MySQLDatabase，耦合度高，难以扩展和测试。

------

## ✅ 正确做法：依赖抽象，使用接口和依赖注入

```java
interface Database {
    void saveData(String data);
}

class MySQLDatabase implements Database {
    @Override
    public void saveData(String data) {
        System.out.println("保存数据到 MySQL: " + data);
    }
}

class UserService {
    private Database db;

    public UserService(Database db) {
        this.db = db;
    }

    public void saveUser(String user) {
        db.saveData(user);
    }
}
```

- UserService 依赖 Database 抽象接口，实现松耦合。

------

## 🔗 依赖倒置原则的好处

- 降低模块间耦合度，提高灵活性和可维护性。
- 方便单元测试，可以替换不同实现或使用 Mock。
- 支持多种实现切换，满足不同需求。

------

## 🗣 面试总结句式

> 依赖倒置原则强调“依赖抽象，不依赖实现”，通过接口或抽象类解耦高层与低层模块，提升代码的灵活性、扩展性和可测试性，是面向对象设计中的重要原则。