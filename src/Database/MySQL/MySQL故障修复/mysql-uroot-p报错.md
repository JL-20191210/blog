---
icon: pen-to-square
date: 2024-10-17
category:
  - MySQL
tag:
  - 踩坑
---
# mysql -uroot -p报错
>使用xshell登录MySQL时,`mysql -uroot -p`报错Can't connect to local MySQL server through socket '/tmp/mysql.sock' 
<!-- more -->

**修改my.conf配置文件（MySQL8.0）**

```shell
cd /etc/mysql/mysql.conf.d
vim mysqld.cnf
```

> 修改MySQL配置文件
>
> 将socket和port前的注释符删除
>
> 将socket值改为报错中的的地址`/tmp/mysql.sock `
>
> 重新连接即成功

```shell
[mysqld]
#
# * Basic Settings
#
user	= mysql
# pid-file	= /var/run/mysqld/mysqld.pid
socket	= /tmp/mysql.sock
port	= 3306
# datadir	= /var/lib/mysql
```

