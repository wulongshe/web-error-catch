import express, { type Request } from 'express';
import { writeMaps } from './controller';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

/* 上报异常 */
router.post('/report/error', async (req: IRequest<ArrayBuffer>, res, next) => {
  const { body } = req;
  const json = new TextDecoder('utf-8').decode(body);
  const data = JSON.parse(json);
  console.log(data);
  res.send({ status: 200, message: 'success' });
  next();
});

/* 上传source map */
router.post('/upload/source-map', async (req: IRequest<Record<string, string>>, res, next) => {
  const { body } = req;
  writeMaps(body);
  res.send({ status: 200, message: 'success' });
  next();
});

export default router;
