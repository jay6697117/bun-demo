import { Hono } from "hono";
import db from "./db";

const app = new Hono();

// 1. 获取所有待办事项列表
app.get("/todos", (c) => {
  // 提示：我们要查询 'todos' 表里的所有数据
  // .all() 表示返回所有匹配的行
  const todos = db.query("SELECT * FROM todos").all();
  return c.json(todos);
});

// 启动服务器
console.log("服务器运行在 http://localhost:3000");
export default {
  port: 3000,
  fetch: app.fetch,
};