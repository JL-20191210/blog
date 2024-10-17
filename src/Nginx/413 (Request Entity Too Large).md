---
icon: pen-to-square
date: 2024-10-17
category:
  - Nginx
tag:
  - error
---
# 413 (Request Entity Too Large)

> 上传文件时报错：请求实体过大
>
> 修改Nginx服务器的请求实体大小限制

### 修改配置文件

> vim /etc/nginx/conf.d/default.conf

```shell
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    # 支持上传10M以内的实体
    client_max_body_size 10M;
    
    .....
    .....
}
```
### 重启Nginx服务

****

```shell 
sudo systemctl restart nginx
```



