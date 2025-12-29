import { expect, test } from "bun:test"; // 直接从 bun:test 引入，无需安装！

test("加法运算检查", () => {
  const result = 2 + 2;
  expect(result).toBe(4);
});

test("检查 Figlet 依赖是否工作", async () => {
  const figlet = await import("figlet");
  // 确保 figlet 真的能生成文本
  expect(figlet.default.textSync("Test")).toBeTruthy();
});