---
icon: fa-brands fa-chart-network
date: 2024-11-05
category:
  - 中间件
tag:
  - 命令
---
# Kafka 发送和接收消息
要在两台服务器之间通过 Kafka 发送和接收消息，你需要确保以下条件满足：

1. **Kafka 集群已正确配置并运行**：Kafka 集群需要在两台服务器上正确配置，并且能够互相通信。
2. **网络配置**：确保两台服务器之间的网络是通的，Kafka broker 的端口（默认 `9092`）和 Zookeeper 的端口（默认 `2181`）可以互相访问。
3. **Kafka Topic 已创建**：确保 Kafka topic 已经创建。

以下是完整的步骤和命令：

---

### 假设
- **服务器 A**（IP: `192.168.1.100`）：用于运行 Kafka 生产者，发送消息。
- **服务器 B**（IP: `192.168.1.101`）：用于运行 Kafka 消费者，接收消息。
- Kafka 安装在两台服务器的 `/path/to/kafka` 目录下。
- Kafka broker 地址为 `192.168.1.100:9092`（服务器 A 的 IP 和端口）。
- Topic 名称为 `test-topic`。

---

### 步骤 1：在服务器 A 上启动 Kafka 生产者
在服务器 A 上运行以下命令，启动 Kafka 生产者并发送消息：

```bash
/path/to/kafka/bin/kafka-console-producer.sh --broker-list 192.168.1.100:9092 --topic test-topic
```

输入一些消息，例如：

```bash
> Hello from Server A!
> This is a test message.
> Another message from Server A.
```

按 `Ctrl+C` 退出生产者。

---

### 步骤 2：在服务器 B 上启动 Kafka 消费者
在服务器 B 上运行以下命令，启动 Kafka 消费者并接收消息：

```bash
/path/to/kafka/bin/kafka-console-consumer.sh --bootstrap-server 192.168.1.100:9092 --topic test-topic --from-beginning
```

- `--bootstrap-server 192.168.1.100:9092`：指定 Kafka broker 的地址（服务器 A 的 IP 和端口）。
- `--topic test-topic`：指定要消费的 topic。
- `--from-beginning`：从最早的消息开始消费。

如果一切正常，你应该会看到从服务器 A 发送的消息：

```bash
Hello from Server A!
This is a test message.
Another message from Server A.
```

---

### 注意事项
1. **Kafka 配置**：
   - 确保 Kafka 的 `server.properties` 文件中 `advertised.listeners` 配置正确，指向服务器 A 的 IP 地址（`192.168.1.100:9092`），以便服务器 B 可以连接到 Kafka。
   - 如果 Kafka 和 Zookeeper 分布在多台服务器上，确保 Zookeeper 的配置也正确。

2. **防火墙**：
   - 确保两台服务器的防火墙允许 Kafka broker 端口（默认 `9092`）和 Zookeeper 端口（默认 `2181`）的通信。

3. **Topic 创建**：
   
   - 如果 topic 不存在，可以在服务器 A 或服务器 B 上运行以下命令创建 topic：
   
     ```bash
     /path/to/kafka/bin/kafka-topics.sh --create --bootstrap-server 192.168.1.100:9092 --replication-factor 1 --partitions 1 --topic test-topic
     ```

---

### 总结
通过以上步骤，你可以在两台服务器之间实现 Kafka 消息的发送和接收。确保 Kafka 配置正确，并且网络通信畅通。如果有任何问题，可以检查 Kafka 日志（位于 `/path/to/kafka/logs`）以排查错误。