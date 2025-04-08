# Hibernate Validator 

## 概述

> Hibernate Validator 是 Java 中一个广泛使用的校验框架，它实现了 Bean Validation 规范（JSR 380）。Hibernate Validator 提供了丰富的内置注解用于校验常见的数据类型和格式。

## 常用注解

1. **@NotNull**：字段不能为 null，但可以是空字符串、空集合等。
   
   ```java
   @NotNull(message = "字段不能为空")
   private String name;
   ```

2. **@NotEmpty**：字段不能为 null 或空，适用于字符串、集合、数组等。

   ```java
   @NotEmpty(message = "字段不能为空或空")
   private String address;
   ```

3. **@NotBlank**：字段不能为空或只包含空白字符，适用于字符串。

   ```java
   @NotBlank(message = "字段不能是空白字符")
   private String username;
   ```

4. **@Size**：限制字符串、集合、数组等的长度或大小范围。

   ```java
   @Size(min = 2, max = 10, message = "长度必须在2到10之间")
   private String nickname;
   ```

5. **@Min** / **@Max**：限定数值的最小值和最大值。

   ```java
   @Min(value = 18, message = "年龄不能小于18")
   @Max(value = 60, message = "年龄不能超过60")
   private int age;
   ```

6. **@DecimalMin** / **@DecimalMax**：限定小数的最小值和最大值。

   ```java
   @DecimalMin(value = "1.0", message = "数值不能小于1.0")
   @DecimalMax(value = "10.0", message = "数值不能超过10.0")
   private BigDecimal salary;
   ```

7. **@Pattern**：使用正则表达式匹配字符串格式。

   ```java
   @Pattern(regexp = "^[A-Za-z0-9]+$", message = "只能包含字母和数字")
   private String code;
   ```

8. **@Email**：验证是否为合法的电子邮件地址。

   ```java
   @Email(message = "邮箱格式不正确")
   private String email;
   ```

9. **@Past** / **@Future** / **@PastOrPresent** / **@FutureOrPresent**：限制日期必须在过去、将来或包含当前日期。

   ```java
   @Past(message = "生日必须是过去的日期")
   private LocalDate birthDate;
   ```

10. **@AssertTrue** / **@AssertFalse**：字段必须为 `true` 或 `false`。

    ```java
    @AssertTrue(message = "必须接受条款")
    private boolean acceptedTerms;
    ```

11. **@Digits**：限制数值的整数位和小数位数。

    ```java
    @Digits(integer = 3, fraction = 2, message = "数值格式不正确，最多3位整数和2位小数")
    private BigDecimal discount;
    ```

12. **@Positive** / **@PositiveOrZero** / **@Negative** / **@NegativeOrZero**：限制数值必须为正、负或包含零。

    ```java
    @Positive(message = "金额必须为正数")
    private BigDecimal amount;
    ```

13. **@Length**：定义字符串的长度范围（需要 `hibernate-validator` 提供的扩展）。

    ```java
    @Length(min = 5, max = 20, message = "长度必须在5到20之间")
    private String password;
    ```

14. **@Range**：指定数值的范围（需要 `hibernate-validator` 提供的扩展）。

    ```java
    @Range(min = 1, max = 100, message = "范围必须在1到100之间")
    private int percentage;
    ```

这些注解可以组合使用，并支持自定义错误消息。