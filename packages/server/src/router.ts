import express, { type Request } from 'express';
import { parseStack, upload } from '#src/controller/index.ts';
import { saveErrorReport } from '#src/database/index.ts';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

interface ReportParams {
  stack: string;
}

/** 测试接口 */
router.get('/test', (req, res) => {
  res.json({ status: 200, message: 'ok' });
});

/** 上报异常 */
router.get('/report', async (req: IRequest<{}, ReportParams>, res, next) => {
  const parsed = await parseStack(req.query.stack);
  saveErrorReport({
    stack: req.query.stack,
    parsed_stack: parsed,
    user_agent: req.get('user-agent'),
    url: req.get('referer'),
  });
  res.send({ status: 200, message: 'success' });
  next();
});
router.post('/report', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const data = JSON.parse(new TextDecoder('utf-8').decode(req.body)) as ReportParams;
  const parsed = await parseStack(data.stack);
  saveErrorReport({
    stack: data.stack,
    parsed_stack: parsed,
    user_agent: req.get('user-agent'),
    url: req.get('referer'),
  });
  res.send({ status: 200, message: 'success' });
  next();
});

/** 上传文件 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  console.log('upload file', req.file?.filename);
  res.send({ status: 200, message: 'success' });
  next();
});

export default router;
