---
icon: pen-to-square
date: 2024-10-17
category:
  - Java
tag:
  - Java8特性
---

# 深入理解 Java Collector
> OS：月饼装箱还是装盒，装什么口味的，装了几个，能不能装在一起

<!-- more -->
#### 一、Collector 接口概述

>`Collector` 接口定义了将流元素汇聚到某种容器中的操作。它包括了四个主要部分：
**Supplier**：提供一个新的结果容器。
**Accumulator**：将元素添加到结果容器。
**Combiner**：将两个结果容器合并。这对于并行流处理特别重要。
**Finisher**：对结果容器进行最终转换（如果需要），通常返回 `identity` 函数，表示不进行任何转换。

典型的 `Collector` 使用场景包括将流元素收集到 `List`、`Set`、`Map`，以及汇总计算等。

#### 二、Collectors 工具类详解

`Collectors` 工具类提供了许多内置的 `Collector` 实现，可以直接用于流的终止操作 `collect()` 中。以下是一些常用的 `Collectors` 方法。

1. **toList()**将流中的元素收集到一个 `List` 中。

```java
List<String> list = Stream.of("a", "b", "c")
                          .collect(Collectors.toList());
System.out.println(list); // 输出 [a, b, c]
```

1. **toSet()**将流中的元素收集到一个 `Set` 中，自动去除重复元素。

```java
Set<String> set = Stream.of("a", "b", "c", "a")
                        .collect(Collectors.toSet());
System.out.println(set); // 输出 [a, b, c]
```

1. **toMap()**将流中的元素收集到一个 `Map` 中。通常用于将流中的对象属性作为键值对进行映射。

```java
Map<Integer, String> map = Stream.of("a", "bb", "ccc")
                                 .collect(Collectors.toMap(String::length, 
                                                           str -> str));
System.out.println(map); // 输出 {1=a, 2=bb, 3=ccc}
```

如果键有重复，可以通过提供第三个参数来处理冲突。

```java
Map<Integer, String> map = Stream.of("a", "bb", "cc")
                                 .collect(Collectors.toMap(String::length, 
                                                           str -> str,
                                                           (existing, replacement) -> existing));
System.out.println(map); // 输出 {1=a, 2=bb}
```

1. **joining()**将流中的字符串元素连接成一个字符串，可以指定分隔符、前缀、后缀。

```java
String result = Stream.of("a", "b", "c")
                      .collect(Collectors.joining(", ", "[", "]"));
System.out.println(result); // 输出 [a, b, c]
```

1. **groupingBy()**按照某个属性对流中的元素进行分组，返回一个 `Map`，其中键是分组的属性，值是该属性对应的元素列表。

```java
Map<Integer, List<String>> groupedByLength = Stream.of("a", "bb", "ccc", "dd")
                                                   .collect(Collectors.groupingBy(String::length));
System.out.println(groupedByLength); // 输出 {1=[a], 2=[bb, dd], 3=[ccc]}
```

1. **partitioningBy()**根据一个布尔条件将流中的元素分为两组，返回一个 `Map<Boolean, List<T>>`。

```java
Map<Boolean, List<Integer>> partitioned = Stream.of(1, 2, 3, 4, 5)
                                                .collect(Collectors.partitioningBy(n -> n % 2 == 0));
System.out.println(partitioned); // 输出 {false=[1, 3, 5], true=[2, 4]}
```

1. **counting()**统计流中元素的个数。

```java
long count = Stream.of("a", "b", "c")
                   .collect(Collectors.counting());
System.out.println(count); // 输出 3
```

1. **summarizingInt()、summarizingDouble()、summarizingLong()**对流中的数值元素进行汇总，返回包含计数、和、最小值、最大值及平均值的 `SummaryStatistics` 对象。

```java
IntSummaryStatistics stats = Stream.of(1, 2, 3, 4, 5)
                                   .collect(Collectors.summarizingInt(Integer::intValue));
System.out.println(stats); // 输出 IntSummaryStatistics{count=5, sum=15, min=1, average=3.000000, max=5}
```

1. **reducing()**通过累加器对流中的元素进行聚合操作。适用于需要自定义聚合逻辑的场景。

```java
int sum = Stream.of(1, 2, 3, 4, 5)
                .collect(Collectors.reducing(0, Integer::sum));
System.out.println(sum); // 输出 15
```

1. **collectingAndThen()**先执行指定的收集器，然后对其结果应用一个转换函数。适合在收集结果之后进行进一步处理的情况。

```java
List<String> unmodifiableList = Stream.of("a", "b", "c")
                                      .collect(Collectors.collectingAndThen(
                                          Collectors.toList(), 
                                          Collections::unmodifiableList));
System.out.println(unmodifiableList); // 输出 [a, b, c]
```

#### 三、自定义 Collector

除了使用 `Collectors` 提供的内置收集器，我们还可以自定义 `Collector`，以实现特定的收集逻辑。

以下是一个简单的自定义 `Collector`，将流中的字符串连接成一个大写字符串：

```java
public class ToUpperCaseStringCollector implements Collector<String, StringBuilder, String> {

    @Override
    public Supplier<StringBuilder> supplier() {
        return StringBuilder::new;
    }

    @Override
    public BiConsumer<StringBuilder, String> accumulator() {
        return (sb, s) -> sb.append(s.toUpperCase());
    }

    @Override
    public BinaryOperator<StringBuilder> combiner() {
        return StringBuilder::append;
    }

    @Override
    public Function<StringBuilder, String> finisher() {
        return StringBuilder::toString;
    }

    @Override
    public Set<Characteristics> characteristics() {
        return Collections.emptySet();
    }
}
```

使用自定义 `Collector`：

```java
String result = Stream.of("a", "b", "c")
                      .collect(new ToUpperCaseStringCollector());
System.out.println(result); // 输出 ABC
```

#### 四、总结

`Collector` 和 `Collectors` 为 Java Stream API 提供了强大的数据收集和处理功能。通过 `Collectors` 工具类，我们可以方便地将流的处理结果转换为各种数据结构，进行分组、聚合、拼接等操作。同时，了解 `Collector` 的工作原理并掌握自定义 `Collector` 的方法，可以让我们在更复杂的场景中充分发挥 Stream API 的威力。