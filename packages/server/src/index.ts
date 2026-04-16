import express from 'express';
import { readLog } from '#src/logger.ts';
import router from '#src/router.ts';
import { publicPath } from '#src/store.ts';

const PORT = Number(process.env.PORT) || 8080;

async function main() {
  // 生成app实例
  const app = express();

  // 开放public目录
  app.use(({ url }, res, next) => {
    if (url !== '/report.json') return next();
    res.set('Content-Type', 'application/json');
    res.send(readLog());
  });
  app.use(express.static(publicPath));

  // 配置插件
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // 配置路由
  app.use(router);

  // 开启服务，监听端口
  app.listen(PORT, () => {
    console.log(`listening on http://127.0.0.1:${PORT}`);
  });
}

main();
