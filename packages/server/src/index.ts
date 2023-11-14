import express from 'express';
import { command } from './command';

async function main() {
  // 获取命令行参数
  const { port } = await command();

  // 生成app实例
  const app = express();

  // 配置插件
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // 开启服务，监听端口
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main();
