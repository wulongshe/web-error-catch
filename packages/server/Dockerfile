FROM node:25-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
RUN pnpm install --prod --ignore-scripts

COPY . .
CMD ["node", "--env-file=.env", "src/index.ts"]
