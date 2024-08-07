import express from 'express';
import { command } from './command';
import { readLog } from './logger';
import router from './router';
import { publicPath } from './store';

async function main() {
  // 获取命令行参数
  const { port } = await command();

  // 初始化日志

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
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main();
