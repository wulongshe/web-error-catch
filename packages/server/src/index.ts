import bodyParser from 'body-parser';
import express from 'express';
import { command } from './command';
import router from './router';

async function main() {
  // 获取命令行参数
  const { port } = await command();

  // 生成app实例
  const app = express();

  // 配置插件
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.raw({ type: '*/*' }));

  // 配置路由
  app.use(router);

  // 开启服务，监听端口
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main();
