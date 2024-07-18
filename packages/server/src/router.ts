import express, { type Request } from 'express';
import { forward, reportError, transformError, type ReportErrorParams, type TransformErrorParams } from './controller';
import { upload } from './store';
import { parseStack } from './parser';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

/** 上报异常 */
router.get('/report', async (req: IRequest<{}, ReportErrorParams>, res, next) => {
  const { query } = req;
  reportError(query);
  res.send({ status: 200, message: 'success' });
  next();
});
router.post('/report', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const { body } = req;
  const json = new TextDecoder('utf-8').decode(body);
  const data = JSON.parse(json) as ReportErrorParams;
  reportError(data);
  res.send({ status: 200, message: 'success' });
  next();
});

/** 转换异常 */
router.get('/transform', async (req: IRequest<{}, TransformErrorParams>, res, next) => {
  const { query } = req;
  const result = await transformError(query);
  if (!query.forward_url) res.send(result);
  else await forward(res.send.bind(res), { method: 'GET', url: query.forward_url, data: result });
  next();
});
router.post('/transform', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const { body } = req;
  const json = new TextDecoder('utf-8').decode(body);
  const data = JSON.parse(json) as TransformErrorParams;
  const result = await transformError(data);
  if (!data.forward_url) res.json(result);
  else await forward(res.json.bind(res), { method: 'POST', url: data.forward_url, data: result });
  next();
});
router.post('/transform-batch', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const { body } = req;
  const json = new TextDecoder('utf-8').decode(body);
  const data = JSON.parse(json) as string[];
  const result = data.map((it) => parseStack(it));
  res.json(await Promise.all(result));
  next();
});

/** 上传文件 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  console.log('upload file', req.file?.filename);
  res.send({ status: 200, message: 'success' });
  next();
});

export default router;
