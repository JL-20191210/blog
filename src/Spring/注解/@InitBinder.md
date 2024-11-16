# @InitBinder

## 前言

> 在开发中，后端通常使用专用模型对象（`FindStudentInfoReq.java`）来接收web请求参数。该对象仅声明输入所需的值，可以防止恶意客户端提供额外的值。
>
> 另一种方法是构造函数绑定
>
> `@InitBinder` 在 Spring 开发中是一个有用但**相对较少使用**的功能。这主要是因为现代 Web 开发中，很多绑定和数据处理的需求已经被更高级和专用的机制（如 `@RequestBody`、校验框架、全局拦截器等）所替代。

:tipping_hand_man:`模型对象`及其`嵌套对象图`有时也称为*命令对象*、*表单支持对象*或*POJO*（普通旧 Java 对象）。

## 概述

> `数据绑定`用于将 Web 请求绑定到模型对象
>
> 在`@Controller` 或 `@ControllerAdvice` 类可以用 `@InitBinder` 方法来初始化 `WebDataBinder` 实例

## 作用

- 请求参数绑定到模型对象
- 请求值从字符串转换为对象属性类型
- 模型对象属性类型格式化为字符串
- 拦截请求参数

## 对比@RequestBody

`@RequestBody` 和 `@InitBinder` 是 Spring MVC 中的两个完全不同的概念，分别用于处理 HTTP 请求数据的不同场景。以下是它们的详细对比和区别：

---

### **1. 概念和作用**

#### **`@RequestBody`**
- **概念**：将 HTTP 请求体（通常是 JSON、XML 或纯文本）直接解析为 Java 对象。
- **作用**：基于 **HttpMessageConverter**（如 Jackson），从请求体中提取数据并转换为目标对象。
- **常见场景**：处理 RESTful API 的请求数据。
- **示例**：
  ```java
  @PostMapping("/user")
  public String createUser(@RequestBody User user) {
      return "Received user: " + user.getName();
  }
  ```
  - 请求数据：JSON 格式
    ```json
    {
      "name": "John",
      "age": 25
    }
    ```
  - Spring 使用 Jackson（默认的 `HttpMessageConverter`）将 JSON 转换为 `User` 对象。

---

#### **`@InitBinder`**
- **概念**：用于自定义绑定逻辑，处理来自 HTTP 请求参数（表单数据或 URL 查询参数）的数据。
- **作用**：通过 WebDataBinder 提供细粒度的自定义数据绑定规则。
- **常见场景**：处理传统表单数据的绑定、忽略字段、数据格式转换等。
- **示例**：
  ```java
  @InitBinder
  public void initBinder(WebDataBinder binder) {
      binder.registerCustomEditor(String.class, new PropertyEditorSupport() {
          @Override
          public void setAsText(String text) {
              setValue(text == null ? null : text.trim());
          }
      });
  }
  
  @PostMapping("/form")
  public String submitForm(@ModelAttribute User user) {
      return "Received user: " + user.getName();
  }
  ```
  - 请求数据：表单格式
    ```
    name=  John Doe &age=25
    ```
  - `@InitBinder` 去除 `name` 的前后空格。

---

### **2. 数据来源**

| 特性             | `@RequestBody`                      | `@InitBinder`                                                |
| ---------------- | ----------------------------------- | ------------------------------------------------------------ |
| **数据来源**     | 请求体（`application/json` 或 XML） | 请求参数（URL 查询参数或表单）                               |
| **常见数据格式** | JSON、XML、纯文本                   | `application/x-www-form-urlencoded` 或 `multipart/form-data` |

---

### **3. 工作机制**

| 特性               | `@RequestBody`                             | `@InitBinder`                                   |
| ------------------ | ------------------------------------------ | ----------------------------------------------- |
| **底层机制**       | 使用 **HttpMessageConverter** 进行数据转换 | 使用 **WebDataBinder** 进行绑定和转换           |
| **适用注解或对象** | 处理 JSON/XML 转换成 Java 对象             | 自定义字段绑定逻辑，处理 `@ModelAttribute` 对象 |
| **应用范围**       | 主要用于 RESTful API                       | 用于表单数据绑定或查询参数预处理                |
| **支持的请求方法** | 任意方法（GET、POST、PUT 等）              | 主要用于 GET 和 POST 方法                       |

---

### **4. 适用场景**

| 场景                      | 使用 `@RequestBody`                 | 使用 `@InitBinder`                                |
| ------------------------- | ----------------------------------- | ------------------------------------------------- |
| **处理 JSON 或 XML 数据** | ✅ 常见场景                          | ❌ 不适用                                          |
| **处理表单数据**          | ❌ 不适用                            | ✅ 处理传统表单提交数据                            |
| **字段级预处理**          | 通过 `@JsonSetter` 或自定义序列化器 | 通过 `registerCustomEditor` 或 `DisallowedFields` |
| **忽略某些字段**          | 通过 DTO 或全局拦截逻辑实现         | ✅ 直接在 `@InitBinder` 中忽略字段                 |
| **全局预处理或转换规则**  | `RequestBodyAdvice` 更适用          | 只能局部生效                                      |

---

### **5. 示例对比**

#### 使用 `@RequestBody`
处理 JSON 数据：

```java
@RestController
@RequestMapping("/api")
public class UserController {

    @PostMapping("/user")
    public String createUser(@RequestBody User user) {
        return "User name: " + user.getName();
    }
}
```

请求示例：
```http
POST /api/user HTTP/1.1
Content-Type: application/json

{
  "name": "John",
  "age": 25
}
```

Spring 自动将 JSON 转换为 `User` 对象。

---

#### 使用 `@InitBinder`
处理表单数据：

```java
@Controller
@RequestMapping("/form")
public class FormController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) {
                setValue(text.trim());
            }
        });
    }

    @PostMapping("/user")
    public String submitForm(@ModelAttribute User user) {
        return "User name: " + user.getName();
    }
}
```

请求示例：
```http
POST /form/user HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=  John Doe &age=25
```

`@InitBinder` 去除 `name` 的前后空格。

---

### **6. 两者能否结合使用？**
- **直接结合：不支持**  
  `@InitBinder` 不会对 `@RequestBody` 生效，因为两者使用了不同的绑定机制。
  
- **间接结合：可通过其他方式**  
  如果需要对 JSON 数据进行预处理，可以使用以下方法：
  - **自定义反序列化器**：通过 Jackson 的自定义反序列化实现字段预处理。
  - **RequestBodyAdvice**：全局处理 `@RequestBody` 数据。
  - **AOP 拦截**：在控制器方法调用前对数据进行拦截和修改。

---

### **总结**
| 特性         | `@RequestBody`                                   | `@InitBinder`            |
| ------------ | ------------------------------------------------ | ------------------------ |
| **常见场景** | RESTful API，处理 JSON/XML                       | 表单数据绑定或字段预处理 |
| **数据来源** | 请求体                                           | 请求参数                 |
| **机制**     | 基于 `HttpMessageConverter`                      | 基于 `WebDataBinder`     |
| **互补性**   | 不直接兼容 `@InitBinder`，需通过其他方式间接结合 | 无法作用于 JSON 请求体   |

选择时依据场景和数据格式，针对性地使用两者。