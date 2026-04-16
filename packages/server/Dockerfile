FROM node:25-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
RUN pnpm install --prod

COPY . .

RUN mkdir -p /app/data /app/uploads

EXPOSE 8080

CMD ["node", "src/index.ts"]
