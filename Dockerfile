# Stage 1: Build Frontend
FROM oven/bun:1 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lockb* ./
RUN bun install
COPY frontend/ .
RUN bun run build

# Stage 2: Final Image
FROM oven/bun:1
WORKDIR /app

# Install backend dependencies
COPY package.json bun.lockb* ./
RUN bun install --production

# Copy backend code
COPY . .

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Initialize empty database if not exists (will be handled by volume ideally, but good for structure)
# The code creates tables automatically on start.

EXPOSE 3000
CMD ["bun", "run", "index.ts"]
