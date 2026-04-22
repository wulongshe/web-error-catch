import express from 'express';
import { apiRouter, authRouter } from '#src/router.ts';
import { logger } from '#src/logger.ts';

const PORT = 8000;

async function main() {
  // 生成app实例
  const app = express();

  // 信任代理
  app.set('trust proxy', 1);

  // 配置插件
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // 配置路由
  app.use('/api', apiRouter);
  app.use('/auth', authRouter);

  // 开启服务，监听端口
  app.listen(PORT, () => {
    logger.info(`Server listening on http://127.0.0.1:${PORT}`);
  });
}

main();
