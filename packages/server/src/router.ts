import express, { type Request } from 'express';
import { IReportError, reportError } from './controller';
import { upload } from './store';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

/* 上报异常 */
router.get('/report/error', async (req: IRequest<{}, IReportError>, res, next) => {
  const { query } = req;
  reportError(query);
  res.send({ status: 200, message: 'success' });
  next();
});
router.post('/report/error', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const { body } = req;
  const json = new TextDecoder('utf-8').decode(body);
  const data = JSON.parse(json);
  reportError(data);
  res.send({ status: 200, message: 'success' });
  next();
});

/* 上传source map */
router.post('/upload/source-map', upload.single('file'), async (req, res, next) => {
  console.log('upload source map', req.file?.filename);
  res.send({ status: 200, message: 'success' });
  next();
});

export default router;
