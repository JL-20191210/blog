---
icon: laptop-code
date: 2024-11-23
category:
  - docker
tag:
  - 镜像
---
# pull
下面是关于使用 `docker pull` 命令的总结：

### `docker pull` 命令概述

`docker pull` 命令用于从 Docker 镜像仓库下载镜像到本地。它是 Docker 的基本命令之一，允许用户获取所需的镜像以便在本地运行容器。

<!-- more -->
### 基本语法

```bash
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

- **NAME**: 镜像的名称，通常包括仓库名和镜像名。
- **TAG**: 可选，指定镜像的版本或标签，默认为 `latest`。
- **DIGEST**: 可选，指定镜像的唯一标识符。

### 常用选项

- `--platform`: 指定要拉取的镜像平台，例如 `linux/arm/v7`，用于确保下载适合特定架构的镜像。
- `--all-tags`: 拉取指定镜像的所有标签。

### 示例

1. **拉取最新版本的镜像**：

   ```bash
   docker pull nginx
   ```

2. **拉取指定版本的镜像**：

   ```bash
   docker pull nginx:1.21
   ```

3. **拉取特定架构的镜像**：

   ```bash
   docker pull --platform linux/arm/v7 filebrowser/filebrowser:v2.31.2
   ```

4. **拉取所有标签**：

   ```bash
   docker pull --all-tags filebrowser/filebrowser
   ```

### 验证拉取的镜像

使用以下命令查看本地镜像：

```bash
docker images
```

### 注意事项

- 确保 Docker 引擎正在运行。
- 网络连接正常，以便从 Docker Hub 或其他镜像仓库下载镜像。

通过 `docker pull` 命令，你可以方便地获取和管理 Docker 镜像，为容器化应用的运行做好准备。