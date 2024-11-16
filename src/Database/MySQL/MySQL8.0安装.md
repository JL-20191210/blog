---
icon: pen-to-square
date: 2024-11-16
category:
  - MySQL
tag:
  - 经验
---
# MySQL8.0安装
### 获取源安装包

- 确定当前linux系统内核版本：[root@localhost ~]# cat /etc/redhat-release
- 进入官网下载匹配的安装包：https://dev.mysql.com/downloads/repo/yum/
- 假设为centos7则对应的版本为
- ![img](https://cdn.nlark.com/yuque/0/2023/png/29495266/1683039274644-14bf0b86-9fd2-4df8-9aab-2374ae50ac35.png)

### 安装MySQL源

- 将下载完成的安装包上传至Linux
- root用户执行安装命令：[root@localhost ~]# rpm -Uvh mysql80-community-release-el7-3.noarch.rpm
- ![img](https://cdn.nlark.com/yuque/0/2023/png/29495266/1683039565021-9a2dafcc-c79a-48db-aba0-b4abe4689125.png)
- 检查是否安装成功：执行成功后会在/etc/yum.repos.d/目录下生成两个repo文件mysql-community.repo及 mysql-community-source.repo
- 查看MySQL资源：[root@localhost ~]# yum repolist enabled | grep "mysql.*-community.*"
- ![img](https://cdn.nlark.com/yuque/0/2023/png/29495266/1683039823896-f9050750-c2a6-40fe-bd6a-6e0d03d7b53d.png)

### 指定版本安装

- 使用MySQL Yum Repository安装MySQL，默认会选择当前最新的稳定版本
- 使用命令：[root@localhost ~]# yum repolist all | grep mysql，查看当前yum repolist的所有版本
- ![img](https://cdn.nlark.com/yuque/0/2023/png/29495266/1683040028830-206bb40e-f2b1-4394-91c4-f152c304f590.png)
- disable8.0版本：[root@localhost ~]# yum-config-manager --disable mysql80-community（安装8.0不执行本句）
- enable5.7版本：[root@localhost ~]# yum-config-manager --enable mysql57-community（安装8.0不执行本句）
- 安装mysql：[root@localhost ~]# yum install mysql-community-server

### 启动及配置

- 启动/停止/重启：[root@localhost ~]# systemctl start/stop/restart mysqld.service
- 查看服务状态：[root@localhost ~]# systemctl status mysqld.service
- MySQL第一次启动后会创建超级管理员账号root@localhost，初始密码存储在日志文件中：[root@localhost ~]# grep 'temporary password' /var/log/mysqld.log
- 登录MySQL：[root@localhost ~]# mysql -uroot -p
- 修改密码：mysql>ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';（如果想使用简单密码需要修改数据库密码策略）
- 查看数据库编码：mysql>SHOW VARIABLES LIKE 'character%';
- 修改配置文件：[root@localhost ~]# vim /etc/my.cnf
- 添加：

[mysqld]

character_set_server=utf8

init-connect='SET NAMES utf8'

### 设置密码策略（可使用简单密码）

- 查看管理密码的变量：mysql>SHOW VARIABLES LIKE 'validate_password%';
- ![img](https://cdn.nlark.com/yuque/0/2023/png/29495266/1683041925046-01ef7836-3f60-48e2-bfd7-88e265cf6002.png)
- VARIABLES n.变量
- 修改变量：mysql>set global validate_password_policy=LOW;
- 其他变量也可自定义
- ![img](https://cdn.nlark.com/yuque/0/2023/png/29495266/1683042108511-6c5474fb-3ce6-426e-b31c-8130c7385b22.png)

### 设置开机自动启动

[root@localhost ~]# systemctl enable mysqld

[root@localhost ~]# systemctl daemon-reload

### 允许远程登录

- 关闭防火墙：[root@localhost ~]#systemctl stop firewalld 
- 设置其他用户可连接：

切换数据库：mysql>use mysql;

查看允许访问用户：mysql> select host from user where user = 'root';

修改为所有用户可访问：mysql> update user set host = '%' where user ='root';

- 重启MySQL：[root@localhost ~]# systemctl restart mysqld