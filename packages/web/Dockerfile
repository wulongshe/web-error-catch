# ---- builder 阶段 ----
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
RUN pnpm install

COPY . .

RUN pnpm build

# ---- runtime 阶段 ----
FROM nginx:alpine

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
