---
icon: pen-to-square
date: 2024-10-16
category:
  - Java
tag:
  - Java8特性
---

# optional类
## 前言
>`Optional` 是 Java 8 引入的一个容器类，专门用于处理可能为 `null` 的值。它提供了一种优雅的方式来避免 `NullPointerException`（空指针异常）并简化对值的检查和处理。`Optional` 的使用鼓励开发者显式地处理可能为空的场景，从而使代码更加健壮和可读。

## 一、`Optional` 的引入背景

>在 Java 中，`null` 用于表示对象缺失的情况，但直接操作 `null` 很容易导致 `NullPointerException`。传统的解决方案是通过显式的 `null` 检查来避免异常，但这种方式不仅使代码冗长，还容易引发错误。

>`Optional` 类的引入提供了一种新的处理方式，通过将值封装在一个容器对象中，使得对可能缺失的值的处理更加安全和清晰。

## 二、创建 `Optional` 对象的几种方式

1. `Optional.of(T value)`用于创建一个包含非空值的 `Optional`。如果传入的值为 `null`，会抛出 `NullPointerException`。

```java
Optional<String> optional = Optional.of("Hello");
```

1. `Optional.ofNullable(T value)`用于创建一个可能为空的 `Optional`。如果传入的值为 `null`，则创建一个空的 `Optional`。

```java
Optional<String> optional = Optional.ofNullable(null); // 创建一个空的 Optional
```

1. `Optional.empty()`用于创建一个空的 `Optional`，即不包含任何值。

```java
Optional<String> optional = Optional.empty();
```

## 三、`Optional` 的常用方法

1. `isPresent()`检查 `Optional` 中是否包含值。如果包含值，返回 `true`，否则返回 `false`。

```java
Optional<String> optional = Optional.of("Hello");
if (optional.isPresent()) {
    System.out.println(optional.get()); // 输出: Hello
}
```

1. `ifPresent(Consumer<? super T> action)`如果 `Optional` 中包含值，则对其执行给定的操作（`Consumer`）。如果为空，不执行任何操作。

```java
optional.ifPresent(value -> System.out.println(value)); // 输出: Hello
```

1. `orElse(T other)`如果 `Optional` 中包含值，返回该值；否则返回指定的默认值。

```java
String result = optional.orElse("Default Value");
System.out.println(result); // 输出: Hello
```

1. `orElseGet(Supplier<? extends T> other)`如果 `Optional` 中包含值，返回该值；否则执行 `Supplier` 并返回其结果。

```java
String result = optional.orElseGet(() -> "Default Value");
System.out.println(result); // 输出: Hello
```

1. `orElseThrow(Supplier<? extends X> exceptionSupplier)`如果 `Optional` 中包含值，返回该值；否则抛出由 `Supplier` 提供的异常。

```java
String result = optional.orElseThrow(() -> new IllegalArgumentException("Value is absent"));
```

1. `map(Function<? super T, ? extends U> mapper)`如果 `Optional` 中包含值，应用 `mapper` 函数将其转换为另一种类型的 `Optional`；如果为空，返回一个空的 `Optional`。

```java
Optional<Integer> lengthOptional = optional.map(String::length);
System.out.println(lengthOptional.get()); // 输出: 5
```

1. `flatMap(Function<? super T, Optional<U>> mapper)`类似于 `map`，但 `mapper` 返回的结果是一个 `Optional`，而不是直接返回值。这避免了嵌套 `Optional` 的问题。

```java
Optional<String> nestedOptional = Optional.of("Hello");
Optional<String> flatMapped = nestedOptional.flatMap(value -> Optional.of(value.toUpperCase()));
System.out.println(flatMapped.get()); // 输出: HELLO
```

1. `filter(Predicate<? super T> predicate)`如果 `Optional` 中的值满足给定的条件，返回包含该值的 `Optional`；否则返回一个空的 `Optional`。

```java
Optional<String> filtered = optional.filter(value -> value.startsWith("H"));
System.out.println(filtered.isPresent()); // 输出: true
```

## 四、`Optional` 的最佳实践

- **避免将** `Optional` **用作方法参数或实例变量**：`Optional` 的设计初衷是用来返回可能为空的值，而不是作为方法参数或类的字段。
- **合理使用** `orElse` **和** `orElseGet`：`orElse` 总是会计算默认值，而 `orElseGet` 只有在 `Optional` 为空时才会计算默认值，选择时应注意性能影响。
- **利用** `Optional` **提升代码可读性**：使用 `Optional` 可以使代码中不再出现冗长的 `null` 检查，从而提高代码的可读性和可维护性。

## 五、总结

`Optional` 提供了一种优雅的方式来处理可能为空的值，避免了常见的 `NullPointerException`。通过合理使用 `Optional`，开发者可以编写出更加健壮、易于维护的代码。虽然 `Optional` 并不能完全取代所有 `null` 的使用场景，但它在返回值处理中显得尤为有用。理解并掌握 `Optional` 的使用，是编写现代 Java 代码的一项重要技能。