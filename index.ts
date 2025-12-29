const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response('Hello Bun 666!');
  }
});

console.log(`正在监听 http://localhost:${server.port} ...`);
