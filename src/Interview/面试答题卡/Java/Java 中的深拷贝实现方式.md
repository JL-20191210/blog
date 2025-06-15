## ☕Java面试答题卡：Java 中的深拷贝实现方式

### ❓面试题目：

**请简述 Java 中常用的深拷贝实现方式。**

------

### ✅ 答题要点：

### 1. 手动拷贝（推荐做法，最清晰）

- 适合结构简单、可控的类。
- 对每个字段进行手动复制，**引用字段必须创建新对象并复制内容**。

```java
class Address {
    String city;
}

class Person {
    String name;
    Address address;

    public Person deepCopy() {
        Person copy = new Person();
        copy.name = this.name;
        copy.address = new Address();
        copy.address.city = this.address.city;
        return copy;
    }
}
```

------

### 2. 实现 `Cloneable` 接口 + 重写 `clone()` 方法

- Java 原生支持克隆，但必须处理引用字段的深复制。
- 缺点：语法繁琐，容易踩坑（如 `CloneNotSupportedException`、浅复制默认行为）。

```java
class Address implements Cloneable {
    String city;

    @Override
    protected Address clone() throws CloneNotSupportedException {
        return (Address) super.clone();
    }
}

class Person implements Cloneable {
    String name;
    Address address;

    @Override
    protected Person clone() throws CloneNotSupportedException {
        Person copy = (Person) super.clone();
        copy.address = address.clone(); // 深拷贝
        return copy;
    }
}
```

------

### 3. 通过序列化（适合对象较复杂时）

- 利用 Java 的序列化机制，将对象**序列化再反序列化**，创建出全新的对象副本。
- 要求类及其引用成员都实现 `Serializable` 接口。
- 可使用内存流（如 `ByteArrayOutputStream` + `ObjectInputStream`）实现。

```java
public static <T extends Serializable> T deepCopy(T obj) throws Exception {
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ObjectOutputStream out = new ObjectOutputStream(bos);
    out.writeObject(obj);

    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
    ObjectInputStream in = new ObjectInputStream(bis);
    return (T) in.readObject();
}
```

------

### 4. 使用第三方库

#### ✅ Apache Commons Lang

```java
Person copy = SerializationUtils.clone(original);
```

> 要求对象实现 `Serializable` 接口。

#### ✅ Gson 或 Jackson（JSON 方式）

```java
Gson gson = new Gson();
Person copy = gson.fromJson(gson.toJson(original), Person.class);
```

> 简单方便，但对类型嵌套深、泛型复杂的对象可能有坑。

------

### 📌 小结对比

| 方法                      | 是否推荐 | 特点                               |
| ------------------------- | -------- | ---------------------------------- |
| 手动拷贝                  | ✅ 推荐   | 可控性强，适合简单类               |
| `clone()`                 | ⚠️ 谨慎   | 默认是浅拷贝，需要小心处理引用字段 |
| 序列化                    | ✅ 可选   | 简洁，适合复杂对象                 |
| 第三方库（Gson、Commons） | ✅ 可选   | 快速方便，但受限于格式支持         |