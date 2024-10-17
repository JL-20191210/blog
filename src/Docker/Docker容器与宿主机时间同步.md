---
icon: pen-to-square
date: 2024-10-17
category:
  - docker
tag:
  - 经验
---
# Docker容器与宿主机时间同步
## 问题

如果在启动Docker容器的过程中没有单独配置localtime，会造成Docker容器时间与主机时间不一致的情况，UTC和CST相差8小时，即容器时间与[北京时间](https://zhida.zhihu.com/search?q=北京时间&zhida_source=entity&is_preview=1)相差8个小时

## 解决方案

### 1. 同步时间（常用）

```bash
# 方法1：直接在宿主机操作
docker cp /etc/localtime 【容器ID或NAME】:/etc/localtime
docker cp -L /usr/share/zoneinfo/Asia/Shanghai 【容器ID或NAME】:/etc/localtime

# 方法2：登录容器同步时区timezone
ln -sf /usr/share/zoneinfo/Asia/Singapore /etc/localtime

#注：此种方式同步时间后需重启docker中的服务才会生效
```

### 2.  docker run 添加参数

```bash
-v /etc/localtime:/etc/localtime

docker run -p 3306:3306 --name mysql -v /etc/localtime:/etc/localtime
```

### 3. DockerFile

```bash
# 方法1
# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai
# 使用软连接，并且将时区配置覆盖/etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TimeZone /etc/localtime && echo $TimeZone > /etc/timezone

# 方法2
# CentOS
RUN echo "Asia/shanghai" > /etc/timezone
# Ubuntu
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

### 4. docker-compose

```bash
#第一种方式(推荐)：
environment:
  TZ: Asia/Shanghai

#第二种方式：
environment:
  SET_CONTAINER_TIMEZONE=true
  CONTAINER_TIMEZONE=Asia/Shanghai

#第三种方式：
volumes:
  - /etc/timezone:/etc/timezone
  - /etc/localtime:/etc/localtime
```