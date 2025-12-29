# 📘 项目操作手册 (Bun + React + Docker)

本文档是该项目的完整操作指南，涵盖本地开发、一键部署及日常维护。

## 1. 项目简介

这是一个基于 **Bun** (后端) 和 **Vite + React** (前端) 的全栈 Todo 应用，支持国际化 (i18n) 和 Docker 容器化部署，前置 Nginx 反向代理。

### 核心技术栈
- **Runtime**: Bun
- **Frontend**: React, TypeScript, Vite
- **Backend Frame**: Hono
- **Database**: SQLite
- **Deployment**: Docker Compose, Nginx

## 2. 本地开发 (Local Development)

### 启动项目
只需要一个命令即可同时启动前后端（依赖 `bun run start` 脚本）：

```bash
bun run start
```
- **后端地址**: `http://localhost:3000`
- **前端地址**: `http://localhost:5173` (或自动分配的其他端口)

## 3. 服务器部署 (Deployment)

我们提供了一个脚本 `scripts/deploy.sh` 来简化所有流程。

### 前置条件
1.  拥有一台 Linux 服务器 (Ubuntu/CentOS/Alibaba Cloud Linux)。
2.  服务器已安装 **Docker** 和 **Docker Compose**。
3.  **SSH 免密登录配置** (推荐)：
    ```bash
    # 在本地终端执行，替换 ip 为你的服务器公网IP
    ssh-copy-id root@<服务器IP>
    ```

### 🚀 一键部署

在本地项目根目录下执行：

```bash
# ./scripts/deploy.sh <用户名>@<服务器IP>
./scripts/deploy.sh root@1.2.3.4
```

**脚本自动完成以下工作：**
1.  通过 SSH 连接服务器。
2.  创建/更新项目目录 (`/opt/bun-demo`)。
3.  使用 `rsync` 高速同步代码 (自动忽略 `node_modules` 等大文件)。
4.  在服务器上重新构建 Docker 镜像。
5.  重启服务 (Bun App + Nginx)。
6.  自动清理旧镜像。

### 访问应用
部署完成后，直接访问服务器 IP (默认 80 端口)：
`http://<服务器IP>`

## 4. 配置修改

### 修改 Nginx 配置
文件位置：`nginx/conf.d/default.conf`
- 如果需要修改端口或添加 SSL 证书，请修改此文件。
- 修改后，再次运行 `./scripts/deploy.sh` 即可生效。

### 修改数据库
- 生产环境数据库位于服务器的 `/opt/bun-demo/todos.sqlite`。
- 如果需要备份，直接下载该文件即可。

## 5. 常见问题排查

**Q: 部署脚本提示 Permission denied?**
A: 给脚本添加执行权限：
```bash
chmod +x scripts/deploy.sh
```

**Q: 部署后无法访问?**
A: 请检查阿里云 ECS 的**安全组**规则，确保 **80 端口** (TCP) 对外开放。

**Q: 如何查看服务器运行日志?**
A: SSH 登录服务器，进入目录查看：
```bash
ssh root@<IP>
cd /opt/bun-demo
docker compose logs -f
```
