---
title: Nginx
icon: laptop-code
date: 2024-10-17
category:
  - docker
tag:
  - 经验
---
# 安装Nginx

```bash
docker run -d \ 
-p 80:80 \ 
--name nginx \
-v /docker/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /docker/nginx/conf.d:/etc/nginx/conf.d \
-v /docker/nginx/logs:/var/log/nginx \
-v /docker/nginx/html:/usr/share/nginx/html \
nginx:1.19.4 
```

> -p host_port:container_port
>
> 冒号前是宿主机端口，后为容器内部端口

