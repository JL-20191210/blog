# Java 面试答题卡：单一职责原则（SRP）

------

## 🧠 原则简介

**单一职责原则（SRP，Single Responsibility Principle）：**

> 一个类应该只有一个引起它变化的原因，即一个类只负责一项职责。

------

## ❌ 反例：职责混乱的类

```java
class UserManager {
    public void addUser() {
        // 添加用户逻辑
    }

    public void saveToDatabase() {
        // 保存用户到数据库
    }

    public void sendEmail() {
        // 给用户发送邮件
    }
}
```

- `UserManager` 同时负责用户管理、数据持久化和邮件发送，职责过多，耦合度高。

------

## ✅ 正确做法：拆分职责

```java
class UserManager {
    public void addUser() {
        // 添加用户逻辑
    }
}

class UserRepository {
    public void saveToDatabase() {
        // 保存用户到数据库
    }
}

class EmailService {
    public void sendEmail() {
        // 发送邮件
    }
}
```

- 每个类只负责单一职责，职责清晰，易于维护和扩展。

------

## 🔗 单一职责原则的好处

- 降低类的复杂度，提高代码可读性和可维护性。
- 方便单元测试，修改一项职责不会影响其他职责。
- 提升系统的灵活性和可扩展性。

------

## 🗣 面试总结句式

> 单一职责原则强调每个类只负责一项职责，减少类的耦合和复杂度，从而提升代码的可维护性和灵活性，是设计良好系统的基础。