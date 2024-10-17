---
icon: pen-to-square
date: 2024-10-17
category:
  - Java
tag:
  - Java8特性
---
> 摘要
> list中存储实例对象，将list中实例对象的两个属性提取出来组成一个新的map
<!-- more -->
# Java Stream API
## 归约(**Reduction**)

> list中存储实例对象，将list中实例对象的两个属性提取出来组成一个新的map

```java
import java.util.*;
import java.util.stream.Collectors;

class Person {
    private int id;
    private String name;

    public Person(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建一个 Person 对象的 List
        List<Person> personList = new ArrayList<>();
        personList.add(new Person(1, "Alice"));
        personList.add(new Person(2, "Bob"));
        personList.add(new Person(3, "Charlie"));

        // 使用 Java 8 的流 API 来提取属性并组成一个新的 Map
        Map<Integer, String> personMap = personList.stream()
        .collect(Collectors.toMap(Person::getId, Person::getName));

        // 输出结果
        personMap.forEach((id, name) -> System.out.println("ID: " + id + ", Name: " + name));
    }
}
```

`Map<Integer, String> personMap = personList.stream().collect(Collectors.toMap(Person::getId, Person::getName));` 
这一行代码属于 **收集（Collect）操作** 中的 **归约（Reduction）操作**，具体来说，是使用 `collect` 方法结合 `Collectors.toMap` 进行的归约。它的主要特征和用法如下：

### 收集（Collect）操作

- **终端操作**：`collect` 是一个终端操作，它会触发流的计算，并且消耗流中的元素。终端操作意味着执行完该操作后，流将不再可用。
- **收集器（Collector）**：`collect` 方法需要一个收集器作为参数，`Collectors.toMap` 是一个收集器。收集器用于将流中的元素累积到某种容器中（如 `List`、`Set` 或 `Map`），或者进行某种特定的归约操作。

### `Collectors.toMap` 方法

- **键值对映射**：`Collectors.toMap` 方法需要两个函数作为参数，一个用于生成键，另一个用于生成值。在你的例子中，`Person::getId` 用于生成 `Map` 的键（`Integer` 类型），`Person::getName` 用于生成 `Map` 的值（`String` 类型）。
- **处理重复键**：如果流中生成的键有重复的情况，`Collectors.toMap` 默认会抛出 `IllegalStateException`。如果需要处理重复键，可以提供第三个参数（合并函数）来解决冲突。

### 总结

该代码段的用法体现了以下 Java Stream API 的特性：

1. **声明式编程**：通过使用流和收集器，代码的意图更加清晰，不需要编写显式的循环和条件逻辑。
2. **函数式编程**：使用方法引用（`Person::getId` 和 `Person::getName`）以及 `Collectors` 提供的收集器，将数据处理的逻辑抽象成函数。
3. **灵活性和可组合性**：流和收集器的组合使用，使得数据处理的流程更具灵活性，易于扩展和修改。

这段代码展示了如何使用 Stream API 和收集器来从 `List` 中提取属性，并将它们组合成 `Map` 的一种常见且高效的模式。

## 分组(**Grouping**)

> 新加一个classename属性，并将`list<person>`按照classname进行分组组成一个新的`map<string,list<person>>`

```java
class Person {
    private int id;
    private String name;
    private String className; // 新增的属性

    public Person(int id, String name, String className) {
        this.id = id;
        this.name = name;
        this.className = className; // 修改构造函数
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getClassName() {
        return className; // 新增的 getter 方法
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建一个 Person 对象的 List
        List<Person> personList = new ArrayList<>();
        personList.add(new Person(1, "Alice", "ClassA"));
        personList.add(new Person(2, "Bob", "ClassB"));
        personList.add(new Person(3, "Charlie", "ClassA"));
        personList.add(new Person(4, "David", "ClassC"));
        personList.add(new Person(5, "Eve", "ClassB"));

        // 使用 Java 8 的流 API 来按照 className 分组
        Map<String, List<Person>> groupedByClassName = personList.stream()
                .collect(Collectors.groupingBy(Person::getClassName));

        // 输出结果
        groupedByClassName.forEach((className, persons) -> {
            System.out.println("Class Name: " + className);
            persons.forEach(person -> System.out.println("ID: " + person.getId() + ", Name: " + person.getName()));
        });
    }
}
```

> `Map<String, List<Person>> groupedByClassName = personList.stream().collect(Collectors.groupingBy(Person::getClassName));` 这一行代码属于 **收集（Collect）操作** 中的 **分组（Grouping）操作**，具体使用了 `collect` 方法结合 `Collectors.groupingBy` 来完成。以下是对这一类用法的详细解释：
>
> ### 收集（Collect）操作
>
> - **终端操作**：`collect` 是流（Stream）的终端操作之一。当它被调用时，流中的元素会被处理，流会被消耗，操作完成后流将不可再次使用。
> - **收集器（Collector）**：`collect` 方法使用一个收集器来指定如何将流中的元素累积成最终的结果。在这个例子中，`Collectors.groupingBy` 是一个用于分组的收集器。
>
> ### `Collectors.groupingBy` 方法
>
> - **分组（Grouping）**：`Collectors.groupingBy` 用于根据某个属性对流中的元素进行分组。这个方法接受一个分类函数作为参数，该函数定义了分组的依据。
> - **返回结果**：分组的结果是一个 `Map`，其中键是分类函数返回的值（这里是 `Person` 对象的 `className` 属性），值是具有相同键的元素的列表。
> - **函数式编程**：`Collectors.groupingBy` 使用了函数式编程的思想，通过将分类函数作为参数传递，使代码更加灵活和简洁。
>
> ### 总结
>
> 1. **声明式编程**：通过使用流和收集器，代码的意图非常清晰，可以直接看到数据是如何处理和分组的。
> 2. **函数式编程**：通过方法引用（`Person::getClassName`）来指定分组的依据，使代码更加简洁。
> 3. **灵活性和可扩展性**：`Collectors.groupingBy` 可以轻松地根据不同的属性进行分组，并且可以与其他收集器组合使用，以实现更复杂的分组和归约操作。
>
> 这种用法充分利用了 Java Stream API 和函数式编程的特性，使得数据处理过程更加高效和易于维护。

## **排序（Sorting）**

> 再加一个属性arriveTime，在classname分组基础上，按照` map<String,list<person>>中list<person>`的arriveTime属性将`list<person>`进行降序排列

```java
import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        // 创建一个 Person 对象的 List
        List<Person> personList = new ArrayList<>();
        personList.add(new Person(1, "Alice", "ClassA", new Date(2024, 7, 12, 8, 30)));
        personList.add(new Person(2, "Bob", "ClassB", new Date(2024, 7, 12, 9, 15)));
        personList.add(new Person(3, "Charlie", "ClassA", new Date(2024, 7, 12, 7, 45)));
        personList.add(new Person(4, "David", "ClassC", new Date(2024, 7, 12, 10, 0)));
        personList.add(new Person(5, "Eve", "ClassB", new Date(2024, 7, 12, 8, 20)));

        // 按照 className 分组，并对每个组中的 List<Person> 按照 arriveTime 进行降序排序
        Map<String, List<Person>> groupedByClassName = personList.stream()
                .collect(Collectors.groupingBy(Person::getClassName,
                        Collectors.collectingAndThen(Collectors.toList(),
                                list -> {
                                    list.sort(Comparator.comparing(Person::getArriveTime).reversed());
                                    return list;
                                }
                        )
                ));

        // 输出结果
        groupedByClassName.forEach((className, persons) -> {
            System.out.println("Class Name: " + className);
            persons.forEach(person -> System.out.println("ID: " + person.getId() +
                    ", Name: " + person.getName() + ", Arrive Time: " + person.getArriveTime()));
        });
    }
}

class Person {
    private int id;
    private String name;
    private String className;
    private Date arriveTime; // 新增的属性

    public Person(int id, String name, String className, Date arriveTime) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.arriveTime = arriveTime; // 修改构造函数
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getClassName() {
        return className;
    }

    public Date getArriveTime() {
        return arriveTime; // 新增的 getter 方法
    }
}
```

>这部分c代码是 Java Stream API 中的一个典型示例，展示了 **收集（Collect）操作** 中的 **分组（Grouping）和排序（Sorting）组合**。具体来说，它属于以下几种用法的组合：
>### 1. 收集（Collect）操作
>- **终端操作**：`collect` 是流的终端操作之一，用于将流中的元素累积成一个结果容器。流在调用该操作后会被消耗，且不可重用。
>### 2. 分组（Grouping）操作
>- `Collectors.groupingBy`：这是一个用于将流中的元素根据某个属性进行分组的收集器。这里使用了 `Person::getClassName` 作为分类函数，将 `Person` 对象根据其 `className` 属性进行分组。
>### 3. 排序（Sorting）操作
>- `Collectors.collectingAndThen`：该方法接受一个收集器和一个转换函数。首先使用提供的收集器收集流中的元素，然后将收集的结果通过转换函数进行转换。
>- `Collectors.toList()`：这是一个收集器，用于将流中的元素收集到一个 `List` 中。
>- **转换函数**：在这里，转换函数是一个 lambda 表达式，接收一个 `List<Person>`，对其进行排序（降序排列），然后返回排序后的列表。
>- `Comparator.comparing` 用于创建一个比较器，比较器通过 `Person::getArriveTime` 访问每个 `Person` 对象的 `arriveTime` 属性。`reversed()` 方法用于将排序顺序反转，实现降序排列。
>### 4. 组合用法
>- 这段代码将分组和排序的操作结合在一起，在对 `className` 分组的同时，对每个分组的 `List<Person>` 进行 `arriveTime` 的降序排列。整个操作体现了函数式编程的思路，极大地提高了代码的可读性和简洁性。

>### 总结
>- 这种用法展示了如何使用 Java Stream API 的高级特性来对数据进行复杂的处理和转换，包括分组和排序等操作。通过这种方式，开发者可以以声明式的风格编写代码，减少了对中间状态的显式管理，使得代码更加简洁明了。

