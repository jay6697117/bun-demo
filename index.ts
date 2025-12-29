import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import db from "./db";
import { chatStore, generateId, type ChatMessage, type ClientData } from "./chat";

const app = new Hono();

app.use("/*", cors());

// 1. 获取所有待办事项列表
app.get("/todos", (c) => {
  const todos = db.query("SELECT * FROM todos").all();
  return c.json(todos);
});

// 2. 添加新任务
app.post("/todos", async (c) => {
  const body = await c.req.json();
  db.run("INSERT INTO todos (title, content) VALUES (?, ?)", [body.title, body.content]);
  return c.json({ success: true });
});

// 4. 更新任务状态 (标记为已完成)
app.put("/todos/:id", (c) => {
  const id = c.req.param("id");
  db.run("UPDATE todos SET completed = ? WHERE id = ?", [1, id]);
  return c.json({ success: true });
});

// 5. 删除任务
app.delete("/todos/:id", (c) => {
  const id = c.req.param("id");
  db.run("DELETE FROM todos WHERE id = ?", [id]);
  return c.json({ success: true });
});

// 6. 归档已完成的任务
app.post("/archive", async (c) => {
  const finishedTodos = db.query("SELECT * FROM todos WHERE completed = 1").all();

  if (finishedTodos.length === 0) {
    return c.json({ message: "没有需要归档的任务" });
  }

  const newContent = finishedTodos.map((t: any) =>
    `[${t.created_at}] ${t.id} ${t.title} ${t.content}`
  ).join("\n") + "\n";

  const archivePath = "archive.txt";
  const file = Bun.file(archivePath);

  const exists = await file.exists();
  const oldContent = exists ? await file.text() : "";
  await Bun.write(archivePath, oldContent + newContent);

  db.run("DELETE FROM todos WHERE completed = 1");

  return c.json({ message: `成功归档了 ${finishedTodos.length} 个任务` });
});

// API 根路径
app.get("/", (c) => {
  return c.json({
    message: "后端 API 服务正常运行中 🚀",
    docs: "/todos",
    frontend_dev: "http://localhost:5173",
    websocket: "/ws/chat"
  });
});

// 仅在生产环境提供静态文件服务
if (process.env.NODE_ENV === "production") {
  console.log("📦 生产环境：启用静态文件托管");
  app.use("/*", serveStatic({ root: "./frontend/dist" }));
  app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));
} else {
  console.log("🛠️ 开发环境：静态文件托管已禁用，请访问 http://localhost:5173");
}

// ============================================
// WebSocket 聊天服务器
// ============================================

const server = Bun.serve<ClientData>({
  port: 3000,

  fetch(req, server) {
    const url = new URL(req.url);

    // WebSocket 升级请求
    if (url.pathname === "/ws/chat") {
      const nickname = url.searchParams.get("nickname") || "匿名用户";
      const clientId = generateId();

      const upgraded = server.upgrade(req, {
        data: { id: clientId, nickname } as ClientData,
      });

      if (upgraded) {
        return undefined; // Bun 自动返回 101 Switching Protocols
      }

      return new Response("WebSocket 升级失败", { status: 500 });
    }

    // 其他请求交给 Hono 处理
    return app.fetch(req);
  },

  websocket: {
    open(ws) {
      const data = ws.data;

      // 订阅聊天频道
      ws.subscribe("chat");

      // 发送历史消息
      const history = chatStore.getRecentMessages();
      ws.send(JSON.stringify({ type: "history", messages: history }));

      // 广播加入消息
      const joinMsg: ChatMessage = {
        id: generateId(),
        type: "join",
        nickname: data.nickname,
        content: `${data.nickname} 加入了聊天室`,
        timestamp: Date.now(),
      };
      chatStore.addMessage(joinMsg);
      server.publish("chat", JSON.stringify(joinMsg));

      console.log(`💬 ${data.nickname} 加入聊天室`);
    },

    message(ws, message) {
      const data = ws.data;
      const text = typeof message === "string" ? message : message.toString();

      try {
        const parsed = JSON.parse(text);

        if (parsed.type === "message" && parsed.content?.trim()) {
          const chatMsg: ChatMessage = {
            id: generateId(),
            type: "message",
            nickname: data.nickname,
            content: parsed.content.trim(),
            timestamp: Date.now(),
          };
          chatStore.addMessage(chatMsg);
          server.publish("chat", JSON.stringify(chatMsg));
        }
      } catch (e) {
        // 忽略非法消息格式
        console.warn("收到非法消息格式:", text);
      }
    },

    close(ws) {
      const data = ws.data;

      // 广播离开消息
      const leaveMsg: ChatMessage = {
        id: generateId(),
        type: "leave",
        nickname: data.nickname,
        content: `${data.nickname} 离开了聊天室`,
        timestamp: Date.now(),
      };
      chatStore.addMessage(leaveMsg);
      server.publish("chat", JSON.stringify(leaveMsg));

      ws.unsubscribe("chat");

      console.log(`👋 ${data.nickname} 离开聊天室`);
    },
  },
});

console.log(`
🚀 服务器运行在 http://localhost:${server.port}
📡 WebSocket 端点: ws://localhost:${server.port}/ws/chat
`);
