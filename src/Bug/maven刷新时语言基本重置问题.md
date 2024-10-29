# Maven刷新时语言级别重置

> Maven项目中reload项目或者依赖时，使用Java8的项目版本会重置为Java11

## 解决方案

### 修改Maven配置文件

在setting.xml添加配置指定编译时使用的Java版本

```xml
<profiles>
    ...
    <profile>
        <id>jdk-1.8</id>
        <activation>
            <activeByDefault>true</activeByDefault>
            <jdk>1.8</jdk>
        </activation>
        <properties>
            <maven.compiler.source>1.8</maven.compiler.source>
            <maven.compiler.target>1.8</maven.compiler.target>
            <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
        </properties>
    </profile>
    ...
</profiles>

```

### 修改项目中pom.xml文件

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```

![image-20241028213348292](maven刷新时语言基本重置问题.assets\202410282134486.png)

:warning:注意上述箭头，勾选则优先使用pom文件中的配置，否则从setting..xml中获取配置