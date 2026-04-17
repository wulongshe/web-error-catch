#!/bin/sh

set -a
. ./.env
set +a

IMAGE_NAME="frontend-monitor-web"
CONTAINER_NAME="frontend-monitor-web"
VERSION=$(grep '"version"' package.json | head -1 | sed -E 's/.*"version": *"([^"]+)".*/\1/')
PORT=${PORT:-80}

# 构建镜像
docker build -t $IMAGE_NAME:$VERSION -f Dockerfile .

# 停止并删除旧容器
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# 运行容器
docker run \
  --name $CONTAINER_NAME \
  -p $PORT:80 \
  --add-host=host.docker.internal:host-gateway \
  -d $IMAGE_NAME:$VERSION

echo "Web deployed successfully"
echo "Visit http://127.0.0.1:$PORT"
