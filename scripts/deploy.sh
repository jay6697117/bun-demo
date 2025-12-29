#!/bin/bash

# One-Click Deployment Script for Bun Demo
# Usage: ./deploy.sh user@ip [target_dir]

set -e

# 1. Configuration
REMOTE_HOST=$1
TARGET_DIR=${2:-/opt/bun-demo}

if [ -z "$REMOTE_HOST" ]; then
  echo "❌ Usage: $0 user@ip [target_dir]"
  echo "Example: $0 root@1.2.3.4"
  exit 1
fi

echo "🚀 Starting Deployment to $REMOTE_HOST:$TARGET_DIR..."

# 2. Preparation (Optional: Build locally if needed, but we build on server)
# Ensure .dockerignore is respected during sync or use exclude below

# 3. Create Remote Directory
echo "📁  Creating remote directory..."
ssh "$REMOTE_HOST" "mkdir -p $TARGET_DIR"

# 4. Sync Files
# Exclude heavy/unnecessary folders. Docker build context needs frontend source to build.
echo "🔄 Syncing files..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'frontend/node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude 'frontend/dist' \
  --exclude 'todos.sqlite' \
  --exclude 'archive.txt' \
  --exclude '.DS_Store' \
  . "$REMOTE_HOST:$TARGET_DIR"

# 5. Remote Build & Restart
echo "🏗️  Building and Restarting Containers..."
ssh "$REMOTE_HOST" "cd $TARGET_DIR && docker compose down && docker compose up -d --build --remove-orphans"

# 6. Clean up
echo "🧹 Cleaning up unused images..."
ssh "$REMOTE_HOST" "docker image prune -f"

echo "✅  Deployment Complete!"
echo "🌍  Visit http://${REMOTE_HOST#*@}"
