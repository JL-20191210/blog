# `packaging` 类型

1. **`jar`**（默认值）
   - **描述**：生成一个 JAR 文件（Java ARchive），适用于普通的 Java 库项目。
   - **用途**：适用于普通的 Java 应用程序或库项目。
   
   ```xml
   <packaging>jar</packaging>
   ```

2. **`war`**（Web Application Archive）
   
   - **描述**：生成一个 WAR 文件（Web ARchive），用于 Web 应用程序。
   - **用途**：适用于基于 Servlet 的 Web 应用程序或使用类似 Spring MVC 的 Web 框架。启动Tomcat服务器时需要改为此类型
   
   ```xml
   <packaging>war</packaging>
   ```
   
3. **`ear`**（Enterprise ARchive）
   - **描述**：生成一个 EAR 文件（Enterprise ARchive），用于企业级 Java 应用，包含多个模块（如 EJB、Web 模块等）。
   - **用途**：适用于 Java EE（企业版）应用程序。
   
   ```xml
   <packaging>ear</packaging>
   ```

4. **`pom`**
   - **描述**：用于 Maven 的父项目，通常不构建任何产物，只是作为项目的管理和依赖的容器。
   - **用途**：用于构建和管理多个子模块的父项目，常用于多模块的 Maven 项目。
   
   ```xml
   <packaging>pom</packaging>
   ```

5. **`maven-plugin`**
   - **描述**：用于构建 Maven 插件。
   - **用途**：当你要创建一个自定义的 Maven 插件时，使用这个 `packaging` 类型。
   
   ```xml
   <packaging>maven-plugin</packaging>
   ```

6. **`bundle`**
   - **描述**：用于创建 OSGi（开放服务网格）包，通常用于模块化的 Java 应用程序。
   - **用途**：适用于 OSGi 模块化框架。
   
   ```xml
   <packaging>bundle</packaging>
   ```

7. **`ejb`**（Enterprise JavaBeans）
   - **描述**：生成一个 EJB 模块，适用于包含 EJB 组件的企业级应用。
   - **用途**：适用于 Java EE 应用程序中的 EJB 模块。
   
   ```xml
   <packaging>ejb</packaging>
   ```

8. **`zip`**
   - **描述**：生成一个 ZIP 文件，通常用于将项目打包为压缩文件。
   - **用途**：适用于需要将项目以压缩格式分发的情况。
   
   ```xml
   <packaging>zip</packaging>
   ```

9. **`tar`**
   - **描述**：生成一个 TAR 文件（类似 ZIP 文件），适用于打包为 TAR 格式。
   - **用途**：适用于类似于 `zip`，但是打包成 tar 格式的场景。
   
   ```xml
   <packaging>tar</packaging>
   ```

10. **`rar`**（Resource Adapter Archive）
    - **描述**：用于生成资源适配器的归档文件。
    - **用途**：适用于 Java EE 的资源适配器（JCA）项目。
    
    ```xml
    <packaging>rar</packaging>
    ```
