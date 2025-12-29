import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./db";

const app = new Hono();

app.use("/*", cors());

// 1. 获取所有待办事项列表
app.get("/todos", (c) => {
  // 填入刚才的 SQL 语句
  const todos = db.query("SELECT * FROM todos").all();
  return c.json(todos);
});

// 2. 添加新任务
app.post("/todos", async (c) => {
  const body = await c.req.json();

  // 使用 (?) 占位符安全插入数据
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
  // 1. 查找已完成任务
  const finishedTodos = db.query("SELECT * FROM todos WHERE completed = 1").all();

  if (finishedTodos.length === 0) {
    return c.json({ message: "没有需要归档的任务" });
  }

  // 2. 准备要写入的文本内容
  const newContent = finishedTodos.map((t: any) =>
    `[${t.created_at}] ${t.id} ${t.title} ${t.content}`
  ).join("\n") + "\n";

  // 3. 文件操作 (Bun.file)
  const archivePath = "archive.txt";
  const file = Bun.file(archivePath);

  // 读取旧内容并追加新内容
  const exists = await file.exists();
  const oldContent = exists ? await file.text() : "";
  await Bun.write(archivePath, oldContent + newContent);

  // 4. 从数据库中删除已归档的任务
  db.run("DELETE FROM todos WHERE completed = 1");

  return c.json({ message: `成功归档了 ${finishedTodos.length} 个任务` });
});

// 启动服务器
console.log("服务器运行在 http://localhost:3000");

// Serve frontend static files
import { serveStatic } from "hono/bun";

app.get("/", (c) => {
  return c.json({
    message: "后端 API 服务正常运行中 🚀",
    docs: "/todos",
    frontend_dev: "http://localhost:5173" // 提示开发环境地址
  });
});

// 仅在生产环境或明确要求时提供静态文件服务
// 在开发环境 (bun run dev) 下，我们应该使用 Vite (端口 5173) 以获得热更新
if (process.env.NODE_ENV === "production") {
  console.log("📦 生产环境：启用静态文件托管");
  app.use("/*", serveStatic({ root: "./frontend/dist" }));
  app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));
} else {
  console.log("🛠️ 开发环境：静态文件托管已禁用，请访问 http://localhost:5173");
}

export default {
  port: 3000,
  fetch: app.fetch,
};