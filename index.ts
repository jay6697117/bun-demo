import { Hono } from "hono";
import db from "./db";

const app = new Hono();

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
  db.run("INSERT INTO todos (title) VALUES (?)", [body.title]);

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
    `[${t.created_at}] ${t.title}`
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
export default {
  port: 3000,
  fetch: app.fetch,
};