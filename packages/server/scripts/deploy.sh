#!/bin/sh

set -a
. ./.env
set +a

IMAGE_NAME="frontend-monitor-server"
VERSION=$(grep '"version"' package.json | head -1 | sed -E 's/.*"version": *"([^"]+)".*/\1/')

docker build -t $IMAGE_NAME:$VERSION .

docker stop $IMAGE_NAME 2>/dev/null
docker rm $IMAGE_NAME 2>/dev/null

docker run --name $IMAGE_NAME -p $PORT:$PORT -d $IMAGE_NAME:$VERSION pnpm run serve
