# BeanUtil

## 将 `Java `对象转换为 `Map`

```java
Map<String, Object> userMap = BeanUtil.beanToMap(userDTO, new HashMap<>(),
        CopyOptions.create()
                .setIgnoreNullValue(true)
                .setFieldValueEditor((fieldName, fieldValue) -> fieldValue.toString()));
```

### 解释代码的执行过程：

- `BeanUtil.beanToMap(userDTO, new HashMap<>(), options)` 会将 `userDTO` 对象转换为一个 `Map<String, Object>`。
- 通过 `CopyOptions.create()` 定义的转换选项，`null` 值的字段被忽略。
- `setFieldValueEditor` 确保所有字段值在转换为 `Map` 时都会被转换为字符串类型。