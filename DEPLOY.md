# 🐧 Linux 服务器 Docker 部署指南

本文档将指导你如何将这个 Bun + React 全栈应用部署到 Linux 服务器（如 Ubuntu/CentOS/Debian）。

## 1. 环境准备

首先，你需要登录到你的 Linux 服务器。

### 安装 Docker 和 Docker Compose

如果你的服务器还没有安装 Docker，请执行以下命令（以 Ubuntu 为例）：

```bash
# 1. 更新软件包索引
sudo apt-get update

# 2. 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. 启动 Docker 并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker

# 4. 验证安装
sudo docker --version
sudo docker compose version
```

## 2. 上传代码

你需要将本地的项目文件上传到服务器。建议创建一个目录，例如 `/opt/bun-demo`。

**在你的本地电脑终端执行**（不是服务器）：

```bash
# 假设你的服务器IP是 1.2.3.4，用户名是 root
# 将当前目录下的文件上传到服务器
scp -r . root@1.2.3.4:/opt/bun-demo
```
> **注意**：得益于 `.dockerignore` 文件，`node_modules` 等不需要的大文件不会被构建上下文包含，但 `scp` 会拷贝所有文件。
> **推荐做法**：在服务器上使用 `git clone` 拉取代码，或者只上传必要的文件：
> `Dockerfile`, `docker-compose.yml`, `package.json`, `bun.lockb`, `index.ts`, `db.ts`, `frontend/` (源代码), `.dockerignore`。

## 3. 启动服务

回到**服务器终端**，进入项目目录并启动服务。

```bash
cd /opt/bun-demo

# 构建并后台启动
sudo docker compose up -d --build
```

等待构建完成后（第一次可能需要几分钟下载镜像），服务就会在后台运行。

## 4. 验证部署

应用默认运行在 `3000` 端口。

1.  **检查容器状态**：
    ```bash
    sudo docker compose ps
    ```
    你应该能看到状态为 `Up` 的容器。

2.  **访问应用**：
    打开浏览器访问 `http://你的服务器IP:3000`。
    如果无法访问，请检查服务器的防火墙（安全组）设置，确保 **3000** 端口已开放。

## 5. 日常维护

### 查看日志
```bash
sudo docker compose logs -f
```

### 更新代码并重新部署
如果你更新了代码（例如上传了新文件或 `git pull`）：
```bash
# 重新构建并重启（Docker 会自动检测变动并利用缓存加速）
sudo docker compose up -d --build
```

### 停止服务
```bash
sudo docker compose down
```

### 数据备份
数据库文件位于 `todos.sqlite`。由于我们在 `docker-compose.yml` 中配置了 volume 映射，这个文件会保存在你的服务器目录下（`/opt/bun-demo/todos.sqlite`）。
你可以直接备份这个文件。
