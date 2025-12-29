import { Database } from "bun:sqlite";

const db = new Database("todos.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    completed INTEGER DEFAULT 0,             -- 默认状态：0 (未完成)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, -- 默认值：当前时间
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP  -- 默认值：当前时间
  )
`);

console.log("数据库已连接，表结构已就绪！🔥");

export default db;