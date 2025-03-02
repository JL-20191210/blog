# 解决 Java 反射问题：`InaccessibleObjectException` 和 `--add-opens` 配置

在 Java 9 及更高版本中，Java 引入了模块化系统（Jigsaw），这让 Java 程序能够更好地管理模块间的访问权限。然而，这也带来了一些问题，特别是在使用反射时，某些类、字段或方法会因为模块化系统的限制而变得不可访问。今天我们就来讨论一个常见的 Java 异常 —— `java.lang.reflect.InaccessibleObjectException`，以及如何通过 IntelliJ IDEA 配置解决这个问题。
<!-- more -->
### 问题描述

当我们在 Java 程序中使用反射时，常常会遇到一些访问权限的问题。具体来说，错误信息通常会提示你无法访问某个字段或方法，原因是该类或字段被模块化系统保护了。例如，假设我们遇到了以下错误：

```
Unable to make field private java.util.concurrent.Callable java.util.concurrent.FutureTask.callable accessible: module java.base does not "opens java.util.concurrent" to unnamed module
```

从错误信息可以看出，程序试图通过反射访问 `java.util.concurrent.FutureTask` 中的 `callable` 字段，但是因为 Java 9 引入了模块化系统，`java.base` 模块并没有“开放”`java.util.concurrent` 包给外部模块，导致反射访问被拒绝。

### 解决方案：使用 `--add-opens`

在 Java 9 及更高版本中，模块化系统控制了包的访问权限。为了通过反射访问被模块化保护的包，可以使用 `--add-opens` 选项显式允许访问这些包。

例如，如果你希望访问 `java.util.concurrent` 包中的类，可以在运行时通过添加 `--add-opens` 选项来解决该问题。

#### 1. 命令行解决方案

如果你是在命令行下运行 Java 程序，可以通过以下命令启动程序：

```bash
java --add-opens java.base/java.util.concurrent=ALL-UNNAMED -jar your-application.jar
```

这条命令的意思是：“允许所有未命名模块访问 `java.base` 模块中的 `java.util.concurrent` 包”。

#### 2. 在 IntelliJ IDEA 中配置 `--add-opens`

如果你使用 IntelliJ IDEA 作为开发工具，可以按照以下步骤配置 `--add-opens` 选项：

##### 步骤 1: 打开运行/调试配置

1. 打开 IntelliJ IDEA，并加载你的项目。
2. 在右上角找到 **运行/调试配置** 下拉菜单，选择你要修改的配置（通常是你的主程序类或者测试类），然后点击 **编辑配置**（或者从菜单中选择 **Run > Edit Configurations**）。

##### 步骤 2: 修改 VM 选项

1. 在 **Run/Debug Configurations** 窗口中，选择需要修改的配置项。
2. 在右侧的 **VM options** 输入框中添加以下内容：

   ```bash
   --add-opens java.base/java.util.concurrent=ALL-UNNAMED
   ```

   这条配置将允许你的程序访问 `java.util.concurrent` 包中的类。

##### 步骤 3: 保存并运行

1. 点击 **OK** 保存修改。
2. 重新运行程序，你应该不再遇到 `InaccessibleObjectException` 错误。

#### 3. 多个 `--add-opens` 配置

如果你需要同时访问多个包，可以在 **VM options** 中通过空格分隔多个 `--add-opens` 配置。例如：

```bash
--add-opens java.base/java.util.concurrent=ALL-UNNAMED --add-opens java.base/java.lang=ALL-UNNAMED
```

这样，程序将能够访问 `java.util.concurrent` 和 `java.lang` 包中的类。

### 总结

当你在 Java 9 及更高版本中遇到 `java.lang.reflect.InaccessibleObjectException` 错误时，通常是因为反射访问了受模块化系统保护的类或字段。解决这个问题的一种常见方法是使用 `--add-opens` 选项，显式地打开访问权限，允许反射操作受保护的包。

在 IntelliJ IDEA 中，你可以通过修改 **VM options** 配置来轻松解决这个问题，确保你的程序能够通过反射访问所需的字段或方法。这种方法不仅适用于当前的问题，也能帮助你更好地理解和应对 Java 模块化系统带来的挑战。