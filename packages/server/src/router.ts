import express, { type Request } from 'express';
import { reportError, transformError, type ReportErrorParams, type TransformErrorParams } from '#src/controller.ts';
import { upload } from '#src/store.ts';
import { parseStack } from '#src/parser.ts';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

/** 测试接口 */
router.get('/test', (req, res) => {
  res.json({ status: 200, message: 'ok' });
});

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
  const result = await transformError(req.query);
  res.send(result);
  next();
});
router.post('/transform', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const { body } = req;
  const json = new TextDecoder('utf-8').decode(body);
  const data = JSON.parse(json) as TransformErrorParams;
  res.json(await transformError(data));
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
