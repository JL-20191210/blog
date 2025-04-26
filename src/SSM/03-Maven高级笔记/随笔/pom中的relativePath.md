# Pom中的relativePath

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.6</version>
        <relativePath/>
    </parent>
```



1. **不写 `<relativePath/>`**（默认行为）：
   - Maven 默认会在上一级目录（`../pom.xml`）查找父 POM 文件。

2. **`<relativePath/>` 置空（`<relativePath/>` 或 `<relativePath></relativePath>`）**：
   - Maven 不会在本地查找父 POM 文件，而是直接从远程仓库下载父 POM 文件。

3. **`<relativePath/>` 不为空（指定路径）**：
   - Maven 会根据指定的路径查找父 POM 文件，路径可以是相对路径或绝对路径。