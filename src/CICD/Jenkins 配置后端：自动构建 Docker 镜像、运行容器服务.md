---
title: Jenkins配置后端
date: 2025-04-06
category:
  - DevOps
tag:
  - CICD
  - Jenkins
---
# Jenkins 配置后端：自动构建 Docker 镜像、运行容器服务

重新配置一下该构建任务，在上传完 `jar` 包后，将 `Dockerfile` 文件也上传到云服务器中，并构建镜像， 最终启动新的容器。

<!-- more -->
## 1. 删除之前的启动命令脚本

登录 `Jenkins` 后台，点击 `weblog-springboot` 构建任务，点击*配置*：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061730010.jpeg)

滑动到后面，将上传 `jar` 包后，需要执行的 `Exec command` 脚本命令*清空*掉：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061730700.jpeg)

## 2. 上传 Dockerfile , 构建镜像，启动容器

接着，在上面的构建步骤后面，再次*点击增加构建步骤 | Send files or execute commands over SSH* :

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061730443.jpeg)

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061730767.jpeg)

> - ①： 勾选想要上传的云服务器；
>
> - ②：想要上传的文件，这里定位到 `Dockerfile` 文件；
>
>   > **注意**：需先把上小节新增的 `Dockerfile` 文件提交到远程仓库，并合并到 `master` 分支。
>
> - ③：删除前缀文件夹；
>
> - ④：想要上传到云服务器中哪个目录下；
>
> - ⑤：上传完成后，需要执行的 `sh` 脚本，内容如下；
>
>   ```bash
>   #!/bin/bash
>   IMAGE_NAME=weblog-web:0.0.1-SNAPSHOT
>   
>   cd /app/weblog
>   chmod +x Dockerfile
>   docker build -t $IMAGE_NAME .
>   docker rm -f weblog-web
>   docker run --restart=always -d -p 8080:8080 -e "ARGS=--spring.profiles.active=prod" -v /app/weblog:/app/weblog --name weblog-web $IMAGE_NAME
>   docker images|grep none|awk '{print $3 }'|xargs docker rmi
>   ```
>
>   > 解释一下脚本所做的工作：
>   >
>   > - 定义镜像名称；
>   > - 进入到 `/app/weblog` 目录下；
>   > - 赋予 `Dockerfile` 文件可执行权限；
>   > - 构建镜像；
>   > - 强制删除正在运行的，名为 `weblog-web` 的容器；
>   > - 重新运行一个 `weblog-web` 容器；
>   > - 删除所有名称、标签为 `<none>` 的**无用**镜像；
>
> - ⑥： 点击保存；

至此，`Jenkins` 配置构建 `Docker` 镜像，并重新运行 `Docker` 容器的流水线就配置完成了，快去测试一波吧~