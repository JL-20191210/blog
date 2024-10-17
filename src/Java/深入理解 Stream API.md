---
icon: pen-to-square
date: 2024-10-17
category:
  - Java
tag:
  - Java8特性
---

# 深入理解 Stream API
>OS：面粉放到传送带上，做成月饼，分出五仁和枣泥，打包变成月饼礼盒

<!-- more -->
#### 一、Stream API 简介

>Stream 是 Java 中处理集合（如数组、列表等）元素的序列。与传统的集合不同，Stream 并不存储数据，而是通过一系列操作（如过滤、映射等）将数据从一个形式转换为另一个形式。Stream 提供了非常丰富的操作类型，可以用于简化集合数据的处理。

#### 二、创建流

Stream 的创建有多种方式，可以从集合、数组、生成器、Map 等多种数据源创建流。下面是一些常用的流创建方式：

1. **从集合创建流**

```java
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream = list.stream();
```

1. **从数组创建流**

```java
String[] array = {"a", "b", "c"};
Stream<String> stream = Arrays.stream(array);
```

1. **使用 Stream.of() 创建流**

```java
Stream<String> stream = Stream.of("a", "b", "c");
```

1. **生成流**使用 `Stream.generate()` 或 `Stream.iterate()` 可以创建无限流。

```java
// 使用 generate() 生成一个随机数流
Stream<Double> randomStream = Stream.generate(Math::random).limit(5);

// 使用 iterate() 生成一个从 0 开始的整数流
Stream<Integer> iterateStream = Stream.iterate(0, n -> n + 1).limit(5);
```

1. **从 Map 创建流**Map 作为一种常见的数据结构，也可以轻松地转换为 Stream。在处理键值对时，可以通过 Map 的 `entrySet()`、`keySet()` 或 `values()` 方法创建相应的流。

```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.put("b", 2);
map.put("c", 3);

// 通过 entrySet() 创建包含键值对的流
Stream<Map.Entry<String, Integer>> entryStream = map.entrySet().stream();
entryStream.forEach(entry -> System.out.println(entry.getKey() + "=" + entry.getValue()));
// 输出 a=1, b=2, c=3

// 通过 keySet() 创建包含键的流
Stream<String> keyStream = map.keySet().stream();
keyStream.forEach(System.out::println);
// 输出 a, b, c

// 通过 values() 创建包含值的流
Stream<Integer> valueStream = map.values().stream();
valueStream.forEach(System.out::println);
// 输出 1, 2, 3
```

#### 三、中间操作

>中间操作是指对流中的数据进行转换或过滤，返回一个新的流。中间操作是惰性求值的，只有当终止操作执行时才会真正计算。

1. **filter()**`filter()` 用于过滤流中的元素，只有满足条件的元素才会被保留。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> evenNumbers = numbers.stream()
                                     .filter(n -> n % 2 == 0);
evenNumbers.forEach(System.out::println); // 输出 2, 4
```

1. **map()**`map()` 用于将流中的元素映射为另一种形式。

```java
List<String> words = Arrays.asList("hello", "world");
Stream<String> upperCaseWords = words.stream()
                                     .map(String::toUpperCase);
upperCaseWords.forEach(System.out::println); // 输出 HELLO, WORLD
```

1. **sorted()**`sorted()` 用于对流中的元素进行排序。

```java
List<Integer> numbers = Arrays.asList(5, 3, 1, 4, 2);
Stream<Integer> sortedNumbers = numbers.stream()
                                       .sorted();
sortedNumbers.forEach(System.out::println); // 输出 1, 2, 3, 4, 5
```

1. **distinct()**`distinct()` 用于去除流中的重复元素。

```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 4, 5);
Stream<Integer> distinctNumbers = numbers.stream()
                                         .distinct();
distinctNumbers.forEach(System.out::println); // 输出 1, 2, 3, 4, 5
```

1. **limit() 和 skip()**`limit()` 用于限制流的大小，而 `skip()` 用于跳过前 N 个元素。

```java
Stream<Integer> limitedStream = Stream.iterate(1, n -> n + 1)
                                      .limit(5);
limitedStream.forEach(System.out::println); // 输出 1, 2, 3, 4, 5

Stream<Integer> skippedStream = Stream.iterate(1, n -> n + 1)
                                      .skip(2)
                                      .limit(3);
skippedStream.forEach(System.out::println); // 输出 3, 4, 5
```

#### 四、终止操作

>终止操作会触发流的计算，并返回一个非流的结果，如数值、集合或副作用（如打印）。

1. **forEach()**`forEach()` 用于遍历流中的每一个元素，并执行指定的操作。

```java
List<String> list = Arrays.asList("a", "b", "c");
list.stream()
    .forEach(System.out::println); // 输出 a, b, c
```

1. **collect()**`collect()` 用于将流转换为其他形式，如列表、集合、字符串等。

```java
List<String> list = Arrays.asList("a", "b", "c");
List<String> resultList = list.stream()
                              .collect(Collectors.toList());
System.out.println(resultList); // 输出 [a, b, c]
```

1. **reduce()**`reduce()` 用于将流中的元素组合起来，生成一个结果。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = numbers.stream()
                 .reduce(0, Integer::sum);
System.out.println(sum); // 输出 15
```

1. **count()**`count()` 用于计算流中的元素数量。

```java
List<String> list = Arrays.asList("a", "b", "c");
long count = list.stream()
                 .count();
System.out.println(count); // 输出 3
```

1. **findFirst() 和 findAny()**`findFirst()` 返回流中的第一个元素，而 `findAny()` 返回流中的任意一个元素。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Optional<Integer> first = numbers.stream()
                                 .findFirst();
first.ifPresent(System.out::println); // 输出 1

Optional<Integer> any = numbers.stream()
                               .findAny();
any.ifPresent(System.out::println); // 输出 1（在顺序流中）
```

