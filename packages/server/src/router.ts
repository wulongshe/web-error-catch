import express, { type Request } from 'express';
import { upload, handleUpload, handleReport, type UploadParams } from '#src/controller/index.ts';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

interface ReportParams {
  stack: string;
  context_lines?: string;
}

/** 测试接口 */
router.get('/test', (req, res) => {
  res.json({ status: 200, message: 'ok' });
});

/** 上报异常 */
router.get('/report', async (req: IRequest<{}, ReportParams>, res, next) => {
  const contextLines = req.query.context_lines ? Number(req.query.context_lines) : undefined;
  await handleReport(req.query.stack, req.get('user-agent'), req.get('referer'), contextLines);
  res.send({ status: 200, message: 'success' });
  next();
});
router.post('/report', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const data = JSON.parse(new TextDecoder('utf-8').decode(req.body)) as ReportParams;
  const contextLines = data.context_lines ? Number(data.context_lines) : undefined;
  await handleReport(data.stack, req.get('user-agent'), req.get('referer'), contextLines);
  res.send({ status: 200, message: 'success' });
  next();
});

/** 上传文件 */
router.post('/upload', upload.array('file'), async (req: IRequest<{}, UploadParams>, res, next) => {
  const { project, timestamp } = req.query;
  const files = req.files as Express.Multer.File[] | undefined;

  if (!project || !timestamp || !files || files.length === 0) {
    res.status(400).send({ status: 400, message: 'Missing parameters: project, timestamp, or files' });
    return;
  }

  const result = await handleUpload(String(project), Number(timestamp), files);
  res.send({ status: 200, message: 'success', ...result });
  next();
});

export default router;
