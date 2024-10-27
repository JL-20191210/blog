## 1. 什么是 Dockerfile ?

![img](http://blog.xiaoxiongmaococo.com:19000/typora/202410271510023.jpeg)

Dockerfile 是用于构建 Docker 镜像的文本文件，其中包含了一系列的指令，每个指令对应着镜像构建过程中的一步操作。通过 Dockerfile，开发者可以定义镜像中包含的文件、环境变量、运行命令等配置。

## 2. 创建 Dockerfile

在 `weblog-web` 入口模块下，创建一个名为 `Dockerfile` 的文件：

![img](http://blog.xiaoxiongmaococo.com:19000/typora/202410271510987.jpeg)

内容如下：

```bash
# FROM 指定使用哪个镜像作为基准
FROM openjdk:8-jdk-alpine

# 创建目录, 并设置该目录为工作目录
RUN mkdir -p /weblog
WORKDIR /weblog

# 复制文件到镜像中
COPY weblog-web-0.0.1-SNAPSHOT.jar app.jar

# 设置时区
ENV TZ=Asia/Shanghai

# 设置 JAVA_OPTS 环境变量，可通过 docker run -e "JAVA_OPTS=" 进行覆盖
ENV JAVA_OPTS="-Xms300m -Xmx300m -Djava.security.egd=file:/dev/./urandom"

# 应用参数，可通过 docker run -e "ARGS=" 来设置，如 -e "ARGS=--spring.profiles.active=prod"
ENV ARGS=""

# 暴露 8080 端口
EXPOSE 8080

# 启动后端服务
CMD java ${JAVA_OPTS} -jar app.jar $ARGS
```

解释一下每行指令的含义：

- `FROM openjdk:8-jdk-alpine:` : 使用 `openjdk:8-jdk-alpine` 作为基础镜像，该镜像包含了 OpenJDK 8 和 Alpine Linux。
- `RUN mkdir -p /weblog` : 在容器中创建一个名为 `/weblog` 的目录。
- `WORKDIR /weblog` : 设置工作目录为 `/weblog`，后续的指令将在该目录下执行。
- `COPY weblog-web-0.0.1-SNAPSHOT.jar app.jar` : 将本地的 `weblog-web-0.0.1-SNAPSHOT.jar` 复制到容器中，并命名为 `app.jar`。
- `ENV TZ=Asia/Shanghai` : 设置时区为亚洲/上海。
- `ENV JAVA_OPTS="-Xms300m -Xmx300m -Djava.security.egd=file:/dev/./urandom"` : 设置 Java 运行时的环境变量，包括堆内存大小、堆外内存大小和随机数生成源。
- `ENV ARGS=""` ： 设置一个空的环境变量，用于存放 Java 应用程序的额外参数。
- `EXPOSE 8080` : 声明容器将监听的端口号为 8080。
- `CMD java ${JAVA_OPTS} -jar app.jar $ARGS` : 定义容器启动时默认执行的命令。在这里，它运行 Java 应用程序 `app.jar`，并传递之前设置的 Java 运行时参数和额外的参数。

## 3. 构建镜像

我们将该 `Dockerfile` 文件上传到云服务中 `jar` 包的同级目录下，并执行如下命令, 赋予该文件可执行权限

```bash
chmod +x Dockerfile
```

![img](http://blog.xiaoxiongmaococo.com:19000/typora/202410271510390.jpeg)

接着，执行如下构建镜像命令：

```plain
docker build -t weblog-web:0.0.1-SNAPSHOT .
```

解释一下：

- **docker build:**

- - 这是 Docker 的构建命令，用于根据 Dockerfile 构建一个 Docker 镜像。

- **-t weblog-web:0.0.1-SNAPSHOT:**

- - 这个参数用于指定构建的镜像的名称及标签。

- **. :**

- - 这个点表示 Docker 上下文的路径。Docker 构建时需要一个上下文，它包含了构建过程所需的文件。点表示当前目录是上下文，Docker 将在当前目录查找 Dockerfile 等构建所需的文件。

注意：别遗漏了命令最后的点 `.`

![img](http://blog.xiaoxiongmaococo.com:19000/typora/202410271510777.jpeg)

镜像构建完成后，可以通过 `docker images` 来确认一下本地是否存在该镜像：

![img](http://blog.xiaoxiongmaococo.com:19000/typora/202410271510945.jpeg)

## 4. 运行容器

有了镜像后，接下来就是通过该镜像来运行一个容器了，运行之前，别忘了将之前通过 `jar` 包启动的服务 `kill` 掉，然后执行命令如下：

```bash
docker run --restart=always -d -p 8080:8080 -e "ARGS=--spring.profiles.active=prod" -v /app/weblog:/app/weblog --name weblog-web weblog-web:0.0.1-SNAPSHOT
```

解释一下：

1. **docker run:**

- - 启动一个新的容器。

1. **--restart=always:**

- - 设置容器在退出时总是重新启动。即使 Docker 守护进程被重启，也会确保容器一直运行。

1. **-d:**

- - 在后台运行容器，即以守护态（detached）方式运行。

1. **-p 8080:8080:**

- - 将主机的 8080 端口映射到容器的 8080 端口。这样可以通过主机的 8080 端口访问容器内的服务。

1. **-e "ARGS=--spring.profiles.active=prod":**

- - 设置环境变量 `ARGS`，传递额外的启动参数给容器。在这里，它设置了 Spring Boot 应用程序的激活的配置文件为 `prod`。

1. **-v /app/weblog:/app/weblog:**

- - 将主机的 `/app/weblog` 目录挂载到容器的 `/app/weblog` 目录。这可以用于持久化存储，使得容器内的数据可以在主机和容器之间共享。

1. **--name weblog-web:**

- - 为容器指定一个名称，这里命名为 `weblog-web`。

1. **weblog-web:0.0.1-SNAPSHOT:**

- - 指定要运行的镜像的名称及版本标签。

执行完成后，通过 `docker ps` 来查看正在运行中的容器，不出意外就能看到 `weblog-web` 这个容器了。同时，通过 `tail -f` 来查看 `/app/weblog/logs` 中的日志，以及网站运行情况，确认以容器运行的服务是正常的。

![img](http://blog.xiaoxiongmaococo.com:19000/typora/202410271510883.jpeg)

至此，我们就搞定了通过 `Dockerfile` 来构建 `Spring Boot` 镜像，以及通过镜像成功运行起了后端服务。