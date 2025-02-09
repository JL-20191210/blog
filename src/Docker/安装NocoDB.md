# 安装NocoDB

> NocoDB是一个网页端的数据库管理

### 步骤1：安装Docker
首先，你需要在本地环境中安装Docker。Docker是一个用于部署应用程序的开源平台，它可以帮助你轻松地创建、部署和运行容器化的应用程序。
你可以从Docker官方网站下载并安装适合你操作系统的Docker版本。安装完成后，你可以通过在终端中运行以下命令来验证Docker是否已成功安装：
`docker --version`

### 步骤2：拉取Nocodb镜像
接下来，你需要从Docker Hub拉取Nocodb镜像。Docker Hub是Docker提供的一个用于共享和管理Docker镜像的公共注册表。
在终端中运行以下命令来拉取Nocodb镜像：
`docker pull nocodb/nocodb`

### 步骤3：运行Nocodb容器
在拉取Nocodb镜像后，你可以通过运行以下命令来创建并运行Nocodb容器：
`docker run -p 8080:8080 --name nocodb -d nocodb/nocodb`
上述命令将创建一个名为nocodb的容器，并将容器内的8080端口映射到主机的8080端口。这意味着你可以通过访问http://localhost::8080来访问Nocodb的Web
界面。

### 步骤4：访问Nocodb
现在，你可以通过在Web浏览器中访问http:/localhost::8080来打开Nocodb的Web界面。
在首次打开界面时，你将被要求设置管理员用户名和密码。设置完成后，你可以使用这些凭据登录到Nocodb。

### 步骤5：连接数据库
在成功登录到Nocodb后，你可以通过单击“Add Connection”按钮来添加需要管理的数据库连接。