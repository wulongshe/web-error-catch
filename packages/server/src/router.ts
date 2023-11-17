import express, { Request } from 'express';
import { writeMaps } from './controller';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

/* 上报异常 */
router.post('/report/error', async (req: IRequest<{}, { meta: any; error: {} }>, res, next) => {
  const { body, query } = req;
  console.log(query, body);
  // const { query } = req;
  // console.log(query);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.send({ status: 200, message: 'success' });
});

/* 上传source map */
router.post('/upload/source-map', async (req: IRequest<Record<string, string>>, res, next) => {
  const { body } = req;
  writeMaps(body);
  res.send({ status: 200, message: 'success' });
});

export default router;
