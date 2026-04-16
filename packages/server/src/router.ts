import express, { type Request } from 'express';
import { parseStack, upload } from '#src/controller/index.ts';
import { saveErrorReport, saveUploadRecord } from '#src/database/index.ts';

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

interface UploadParams {
  project?: string;
  timestamp?: string;
}

/** 上传文件 */
router.post('/upload', upload.array('file'), async (req: IRequest<{}, UploadParams>, res, next) => {
  const { project, timestamp } = req.query;
  const files = req.files as Express.Multer.File[] | undefined;

  if (!project || !timestamp || !files || files.length === 0) {
    res.status(400).send({ status: 400, message: 'Missing parameters: project, timestamp, or files' });
    return;
  }

  files.forEach((file) => {
    saveUploadRecord(String(project), Number(timestamp), file.filename);
  });

  res.send({ status: 200, message: 'success', count: files.length });
  next();
});

export default router;
