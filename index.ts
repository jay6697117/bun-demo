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
  // 第一步：查找所有已完成的任务
  // 提示：WHERE 子句
  const finishedTodos = db.query("SELECT * FROM todos WHERE completed = 1").all();

  // ... (后面我们再写文件操作)

  return c.json({ message: `归档了 ${finishedTodos.length} 个任务` });
});

// 启动服务器
console.log("服务器运行在 http://localhost:3000");
export default {
  port: 3000,
  fetch: app.fetch,
};