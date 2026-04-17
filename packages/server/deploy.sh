#!/bin/sh

set -a
. ./.env
set +a

IMAGE_NAME="frontend-monitor-server"
CONTAINER_NAME="frontend-monitor-server"
VERSION=$(grep '"version"' package.json | head -1 | sed -E 's/.*"version": *"([^"]+)".*/\1/')
PORT=${PORT:-8080}

DATA_DIR="data"
UPLOADS_DIR="uploads"
mkdir -p $DATA_DIR $UPLOADS_DIR

# 构建镜像
docker build -t $IMAGE_NAME:$VERSION -f Dockerfile .

# 停止并删除旧容器
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# 运行容器并挂载数据卷
docker run \
  --name $CONTAINER_NAME \
  -p $PORT:8080 \
  -v "$DATA_DIR:/app/data" \
  -v "$UPLOADS_DIR:/app/uploads" \
  -e NODE_ENV=production \
  -d $IMAGE_NAME:$VERSION

echo "Server deployed successfully"
echo "Listening on http://127.0.0.1:$PORT"
