## 1. 什么是 Jenkins ?

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061717007.jpeg)

> Jenkins 是**一个开源的持续集成（Continuous Integration）工具，它的主要作用是帮助开发团队自动化构建、测试和部署软件项目**。通俗来说，Jenkins 可以在每次代码变更时，帮助我们自动进行一系列的操作，例如编译代码、运行测试、生成文档，甚至是将应用程序部署到服务器上。

## 2. 为什么要使用 Jenkins 呢？

- **自动化构建和测试：** Jenkins 可以监视版本控制系统（如 Git）中的代码变更，一旦有新的提交，就触发自动构建和测试流程。这有助于发现潜在的问题，确保代码的质量。
- **持续集成：** Jenkins 支持持续集成，即频繁地将小的代码变更合并到主干，并通过自动构建和测试来验证这些变更。这有助于减少集成问题，提高团队的协作效率。
- **自动化部署：** Jenkins 可以自动化部署应用程序到测试环境、预生产环境甚至生产环境。通过定义部署流程，可以减少人为错误，确保部署的一致性。
- **插件生态系统：** Jenkins 拥有丰富的插件生态系统，支持各种开发工具、构建工具和部署目标。这意味着你可以很容易地将 Jenkins 集成到你的开发工作流中。
- **可扩展性：** Jenkins 是开源的，并且具有强大的可扩展性。你可以根据团队的需求定制自己的构建和部署流程，满足特定项目的要求。

## 3. 拉取镜像

打开命令行工具 `PowerShell` , 执行搜索命令，如下:

```sql
docker search jenkins
```

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718191.jpeg)

注意，从搜索结果中，你会看到官方提供的 `jenkins` 镜像描述，提示我们该镜像已经过期，不再维护了。浏览器访问 [DockerHub](https://hub.docker.com/r/jenkins/jenkins) , 搜索关键字 *jenkins* , 找到目前正在维护的版本，如下图所示，提示我们通过如下命令，来下载最新的 `LTS` 长期支持版本：

```bash
docker pull jenkins/jenkins:lts-jdk17
```

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718133.jpeg)

镜像下载成功后，通过 `docker images` 命令来检查一下镜像是否下载成功：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061717360.jpeg)

## 4. 运行容器

接着，执行如下命令来运行 `jenkins` 容器：

```bash
docker run -d -u root -p 8080:8080 -p 50000:50000 -v E:\docker\jenkins2\jenkins_home:/var/jenkins_home --name jenkins2 jenkins/jenkins:lts-jdk17
```

> 解释一下每个参数的含义：
>
> - **docker run:** 运行 Docker 容器的命令。
>
> - **-d:** 在后台运行容器，即“detached”模式。
>
> - **-u root:** 以 root 用户身份运行容器。这通常用于确保容器内的进程具有足够的权限执行需要的操作。
>
> - **-p 8080:8080:** 将容器内部的 8080 端口映射到宿主机的 8080 端口。Jenkins 服务通常在 8080 端口上运行。
>
> - **-p 50000:50000:** 将容器内部的 50000 端口映射到宿主机的 50000 端口。这是 Jenkins 使用的用于构建和执行任务的端口。
>
> - **-v E:\docker\jenkins2\jenkins_home:/var/jenkins_home:** 将宿主机上的目录（E:\docker\jenkins2\jenkins_home）挂载到容器内的 /var/jenkins_home 目录。这样可以确保 Jenkins 数据和配置持久化，即使容器被删除，数据仍然保存在宿主机上。
>
> - **--name jenkins2:** 为容器指定一个名称，即 "jenkins2"。
>
>   > TIP : 因为我本地之前测试的时候，已经命名了一个容器名为 jenkins , 这里演示为了防止冲突，命名的 jenkins2 。
>
> - **jenkins/jenkins:lts-jdk17:** 指定要运行的 Docker 镜像的名称和版本。在这里，使用的是 Jenkins 的 LTS 版本，内部使用的 JDK 17。

命令执行后，执行 `docker ps` 命令来查看正在运行的容器，确认一下容器是否运行成功：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718883.jpeg)

## 5. 访问 Jenkins

然后，打开浏览器访问 [http://localhost:8080](http://localhost:8080/) , 首次访问可能速度较慢，请耐心等待一会，会出现如下页面：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718703.jpeg)

需要你提供**管理员密码** ， 密码可以通过如下命令，来查看 `jenkins2` 容器的启动日志：

```undefined
docker logs jenkins2
```

在日志中，可以看到该密码，如下图所示，将其复制粘贴到输入框中，点击*继续*按钮：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061724757.jpeg)

## 6. 安装插件

接着，进入到如下页面，点击左边的*安装推荐的插件* ：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718581.jpeg)

开始安装 `jenkins` 需要的常用插件，过程比较慢，等待其全部安装完毕：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718879.jpeg)

## 7. 配置管理员用户

插件安装完毕后，开始配置管理员用户：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718259.jpeg)

> **注意**： 后续再次登录 `jenkins` 后台需要，务必记住登录用户名和密码。

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718783.jpeg)

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718684.jpeg)

点击*开始使用 Jenkins* 按钮，进入到 `Jenkins` 后台首页，如下图所示，至此，`Jenkins` 就安装好啦，是不是很简单：

![img](https://felix-docs.oss-cn-beijing.aliyuncs.com/gitblogimg/202504061718683.jpeg)