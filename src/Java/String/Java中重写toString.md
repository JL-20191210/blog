# Java中重写 toString

在 Java 中，`toString()` 方法是 `Object` 类中的一个方法，所有的 Java 类都继承自 `Object` 类，因此每个类都可以使用 `toString()` 方法。默认情况下，`Object` 类的 `toString()` 方法返回的是类的名称和该对象的哈希码，例如：

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

### 1. **为什么要重写 `toString()` 方法**
- **提高可读性**：默认的 `toString()` 方法返回的信息对调试和日志记录并没有太多帮助，而重写 `toString()` 方法可以返回对象的有意义的描述信息，便于调试。
- **便于打印对象信息**：当你打印对象时，如果没有重写 `toString()`，输出的只是一个类似 `ClassName@Hashcode` 的字符串，而重写 `toString()` 后，可以输出更为直观的对象内容。

### 2. **如何重写 `toString()` 方法**

#### 示例：
假设你有一个 `Person` 类，它有两个属性：`name` 和 `age`。

```java
public class Person {
    private String name;
    private int age;

    // 构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 重写 toString() 方法
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}
```

在这个例子中，`toString()` 被重写以返回对象的详细信息，包括 `name` 和 `age`。

#### 调用：
```java
Person person = new Person("Alice", 30);
System.out.println(person.toString());
```

输出：
```
Person{name='Alice', age=30}
```

### 3. **最佳实践**
- **提供有意义的输出**：`toString()` 方法应返回该对象的核心属性，以便可以通过字符串来描述对象。
- **避免打印过多信息**：不需要返回所有字段，特别是如果对象中有敏感或不必要的数据。
- **使用 `StringBuilder`**：当需要拼接多个字符串时，使用 `StringBuilder` 而不是直接用 `+` 进行字符串拼接，这样性能会更好，尤其是在多个字段拼接时。

#### 使用 `StringBuilder` 的例子：
```java
@Override
public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("Person{");
    sb.append("name='").append(name).append('\'');
    sb.append(", age=").append(age);
    sb.append('}');
    return sb.toString();
}
```

### 4. **`toString()` 的常见用途**
- **调试**：可以在调试过程中，打印对象的 `toString()` 输出，帮助快速了解对象的状态。
- **日志记录**：可以在日志中记录对象的详细信息，以便后续排查和分析。
- **集合打印**：在打印集合时，通常会遍历集合中的每个对象并调用其 `toString()` 方法。

例如，打印一个 `Person` 类型的集合：
```java
List<Person> people = Arrays.asList(new Person("Alice", 30), new Person("Bob", 25));
System.out.println(people);
```

输出：
```
[Person{name='Alice', age=30}, Person{name='Bob', age=25}]
```

### 5. **注意事项**
- **避免返回敏感数据**：如果对象包含敏感信息（如密码、银行卡号等），请小心不要将它们暴露在 `toString()` 中。
- **考虑性能**：对于大型对象，尽量避免在 `toString()` 方法中执行耗时的操作，如过多的计算或数据库查询。
