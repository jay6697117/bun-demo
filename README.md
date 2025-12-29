# Bun Demo - 全栈待办事项应用

一个基于 Bun 运行时的全栈待办事项应用，集成实时聊天功能。

## 功能特性

- 待办事项管理（增删改查）
- 任务完成状态切换
- 已完成任务归档
- 实时聊天室（WebSocket）
- 多语言支持（中文/英文）

## 技术栈

### 后端
| 技术 | 版本 | 说明 |
|------|------|------|
| Bun | 1.2.20+ | JavaScript 运行时 |
| Hono | 4.x | 轻量级 Web 框架 |
| SQLite | bun:sqlite | 内置数据库 |
| WebSocket | 内置 | 实时通信 |
| TypeScript | 5.x | 类型系统 |

### 前端
| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.x | UI 框架 |
| Vite | 7.x | 构建工具 |
| i18next | 25.x | 国际化 |
| TypeScript | 5.9 | 类型系统 |

## 项目结构

```
bun-demo/
├── index.ts          # 主入口：Hono 服务器 + WebSocket
├── chat.ts           # 聊天消息类型与存储
├── db.ts             # SQLite 数据库初始化
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript 配置
├── archive.txt       # 归档任务存储（自动生成）
├── todos.sqlite      # SQLite 数据库文件（自动生成）
└── frontend/         # React 前端应用
    ├── src/
    │   ├── App.tsx           # 主应用组件
    │   ├── main.tsx          # 入口文件
    │   ├── i18n.ts           # 国际化配置
    │   ├── components/       # 组件目录
    │   │   └── chat/         # 聊天相关组件
    │   ├── contexts/         # React Context
    │   └── types/            # 类型定义
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

## 快速开始

### 环境要求
- [Bun](https://bun.sh) v1.2.20 或更高版本

### 安装依赖

```bash
bun install
cd frontend && npm install && cd ..
```

### 开发模式

```bash
# 同时启动前后端
bun run dev
```

或分别启动：

```bash
# 后端服务
bun run be

# 前端开发服务器（新终端）
bun run fe
```

### 访问地址
- **前端开发**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000/ws/chat

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | API 状态信息 |
| GET | `/todos` | 获取所有待办事项 |
| POST | `/todos` | 创建待办事项 |
| PUT | `/todos/:id` | 标记任务完成 |
| DELETE | `/todos/:id` | 删除任务 |
| POST | `/archive` | 归档已完成任务 |

### WebSocket 端点

- **地址**: `/ws/chat?nickname=用户昵称`
- **消息类型**: `message` | `join` | `leave` | `system`

## 部署

### 生产构建

```bash
# 构建前端
cd frontend && npm run build && cd ..

# 启动生产服务器
NODE_ENV=production bun index.ts
```

### Docker 部署（可选）

```dockerfile
FROM oven/bun:1.2

WORKDIR /app
COPY . .

RUN bun install
RUN cd frontend && npm install && npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "index.ts"]
```

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| NODE_ENV | development | 运行环境 |
| PORT | 3000 | 服务端口（需修改代码） |

## 开发说明

### 数据库
- 使用 Bun 内置 SQLite，数据文件 `todos.sqlite` 自动创建
- 归档任务存储在 `archive.txt`

### WebSocket 聊天
- 消息存储在内存中（最近 100 条）
- 支持加入/离开通知
- 新用户可获取历史消息

## 许可证

MIT
