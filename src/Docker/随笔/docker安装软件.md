# docker安装软件

## docker安装Nginx

<!-- more -->

```bash
docker run -d \  # 以后台模式（守护模式）运行容器
-p 80:80 \  # 将主机的 80 端口映射到容器的 80 端口
--name nginx \  # 设置容器的名称为 nginx
-v /docker/nginx/nginx.conf:/etc/nginx/nginx.conf \  # 将主机上的 nginx 配置文件挂载到容器的 nginx 配置文件位置
-v /docker/nginx/conf.d:/etc/nginx/conf.d \  # 将主机上的 nginx 配置目录挂载到容器的 conf.d 目录
-v /docker/nginx/logs:/var/log/nginx \  # 将主机上的日志目录挂载到容器的日志目录
-v /docker/nginx/html:/usr/share/nginx/html \  # 将主机上的网页文件目录挂载到容器的网页目录
nginx:1.19.4  # 使用 nginx 的官方镜像，并指定版本为 1.19.4


```

> -p host_port:container_port
>
> 冒号前是宿主机端口，后为容器内部端口

## docker安装jenkins

```bash
docker run -d \  # 以后台模式（守护模式）运行容器
-u root \  # 以 root 用户身份运行容器
-p 8080:8080 \  # 将主机的 8080 端口映射到容器的 8080 端口（Jenkins Web UI）
-p 50000:50000 \  # 将主机的 50000 端口映射到容器的 50000 端口（Jenkins 启动代理通信）
-v ./jenkins_home:/var/jenkins_home \  # 将主机的 Jenkins 数据目录挂载到容器的 jenkins_home 目录，持久化 Jenkins 配置和数据
--name jenkins2 \  # 设置容器的名称为 jenkins2
jenkins/jenkins:lts-jdk17  # 使用 Jenkins 官方镜像，并指定 LTS 版本与 JDK 17

```

