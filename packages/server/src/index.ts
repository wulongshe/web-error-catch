import express from 'express';
import router from '#src/router.ts';
import { uploadsPath } from '#src/controller/index.ts';
import { logger } from '#src/logger.ts';

const PORT = 8000;

async function main() {
  // 生成app实例
  const app = express();

  // 信任代理
  app.set('trust proxy', 1);

  // 开放uploads目录
  app.use(express.static(uploadsPath));

  // 配置插件
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // 配置路由
  app.use(router);

  // 开启服务，监听端口
  app.listen(PORT, () => {
    logger.info(`Server listening on http://127.0.0.1:${PORT}`);
  });
}

main();
