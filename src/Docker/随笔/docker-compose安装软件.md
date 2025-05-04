# docker-compose安装软件

## docker-compose安装redis

<!-- more -->

```yml
version: '3.8' # Docker Compose 使用3.8版本的文件格式来解析配置

services:
  redis:
    image: redis:7.4.3  # 使用 Redis 的官方镜像
    container_name: redis7  # 设置容器名称
    restart: always  # 容器停止后总是重启
    ports:
      - "6379:6379"  # 映射主机的 6379 端口到容器的 6379 端口
    volumes:
      - ./data:/data  # 持久化存储 Redis 数据
      - ./conf/redis.conf:/etc/redis/redis.conf  # 使用自定义的 Redis 配置文件
      - ./logs:/logs  # 持久化日志
    command: redis-server /etc/redis/redis.conf --requirepass yourredispassword  # 指定配置文件启动 Redis 服务并修改密码
    networks:
      - redis-network  # 配置网络
    labels:
      createdBy: "felix"  # 自定义标签

networks:
  redis-network:
    driver: bridge  # 使用 bridge 网络模式（默认模式）

```

# docker-compose安装mysql

```yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0  # 使用 MySQL 8.0 官方镜像
    container_name: mysql8  # 设置容器名称
    restart: always  # 容器停止后总是重启
    ports:
      - "33306:3306"  # 映射主机的 3306 端口到容器的 3306 端口
    volumes:
      - ./data:/var/lib/mysql  # 持久化存储 MySQL 数据
      - ./conf/my.cnf:/etc/mysql/my.cnf  # 使用自定义的 MySQL 配置文件
      - ./logs:/var/log/mysql  # 持久化日志
    environment:
      MYSQL_ROOT_PASSWORD: "123123"  # 设置 MySQL root 用户的密码
      MYSQL_DATABASE: "test"  # 创建一个默认数据库
      MYSQL_USER: "felix"  # 创建一个非 root 用户
      MYSQL_PASSWORD: "123123"  # 为用户设置密码
    networks:
      - mysql-network  # 配置网络
    labels:
      createdBy: "felix"  # 自定义标签

networks:
  mysql-network:
    driver: bridge  # 使用 bridge 网络模式（默认模式）

```

```yml
version: '3.8'

services:
  mysql:
    image: mysql:5.7  # 使用 MySQL 5.7 官方镜像
    container_name: mysql5  # 设置容器名称
    restart: always  # 容器停止后总是重启
    ports:
      - "3306:3306"  # 映射主机的 3306 端口到容器的 3306 端口
    volumes:
      - ./data:/var/lib/mysql  # 持久化存储 MySQL 数据
      - ./conf/my.cnf:/etc/mysql/my.cnf  # 使用自定义的 MySQL 配置文件
      - ./logs:/var/log/mysql  # 持久化日志
    environment:
      MYSQL_ROOT_PASSWORD: "root_password"  # 设置 MySQL root 用户的密码
      MYSQL_DATABASE: "my_database"  # 创建一个默认数据库
      MYSQL_USER: "user"  # 创建一个非 root 用户
      MYSQL_PASSWORD: "user_password"  # 为用户设置密码
    networks:
      - mysql-network  # 配置网络
    labels:
      createdBy: "felix"  # 自定义标签

networks:
  mysql-network:
    driver: bridge  # 使用 bridge 网络模式（默认模式）

```

