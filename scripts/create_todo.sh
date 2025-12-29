timestamp=$(date +%s)
curl -X POST http://localhost:3000/todos \
     -H "Content-Type: application/json" \
     -d "{\"title\": \"学习 Bun 真有趣-${timestamp}\"}"