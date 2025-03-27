---
icon: pen-to-square
date: 2024-10-17
category:
  - MySQL
tag:
  - 踩坑
---
# Navicat连接mysql报错
```shell
2003-Can’t connect to MySQL server on ‘XXX.XX.XX.XX’（10060）
```

<!-- more -->

## 1. **检查网络**

```shell
ping XXX.XX.XX.XX

正在 Ping XXX.XX.XX.XX 具有 32 字节的数据:
来自 XXX.XX.XX.XX 的回复: 字节=32 时间=64ms TTL=47
来自 XXX.XX.XX.XX 的回复: 字节=32 时间=86ms TTL=47
```

## 2. **检查用户组权限**

> 在`xshell`中登录`MySQL`查询下`user`表。

```shell
mysql -uroot -p
输入密码
mysql> use mysql
mysql> select host,user from user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| %         | root             |
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
+-----------+------------------+
4 rows in set (0.00 sec)
```

> `root`对应的`host`是`%`,表示所有ip都可以连接。

## 3. **检查CentOS防火墙**

> 检查防火墙，把`3306`放通，再重启防火墙。

```shell
[root@VM_0_14_centos ~]# firewall-cmd --permanent --zone=public --add-port=3306/tcp
success
[root@VM_0_14_centos ~]# firewall-cmd --reload
success
```

> `Navicat for MySQL`连接远程数据库成功