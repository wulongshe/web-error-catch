import express, { type Request } from 'express';
import { upload, handleUpload, handleReport, type UploadParams } from '#src/controller/index.ts';
import { queryErrorReports } from '#src/database/index.ts';

const router = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

interface ReportParams {
  project: string;
  stack: string;
  context_lines?: string;
}

interface ReportListParams {
  project: string;
  start_time?: string;
  end_time?: string;
  page?: string;
  page_size?: string;
}

/** 测试接口 */
router.get('/test', (req, res) => {
  res.json({ status: 200, message: 'ok' });
});

/** 上报异常 */
router.get('/report', async (req: IRequest<{}, ReportParams>, res, next) => {
  const { stack, project, context_lines } = req.query;
  if (!project) {
    res.status(400).send({ status: 400, message: 'Missing parameter: project' });
    return;
  }
  await handleReport(stack, project, req.get('user-agent'), req.get('referer'), context_lines ? Number(context_lines) : undefined);
  res.send({ status: 200, message: 'success' });
  next();
});
router.post('/report', express.raw({ type: '*/*' }), async (req: IRequest<ArrayBuffer>, res, next) => {
  const data = JSON.parse(new TextDecoder('utf-8').decode(req.body)) as ReportParams;
  if (!data.project) {
    res.status(400).send({ status: 400, message: 'Missing parameter: project' });
    return;
  }
  await handleReport(data.stack, data.project, req.get('user-agent'), req.get('referer'), data.context_lines ? Number(data.context_lines) : undefined);
  res.send({ status: 200, message: 'success' });
  next();
});

/** 分页查询异常日志 */
router.get('/report-list', (req: IRequest<{}, ReportListParams>, res) => {
  const { project, start_time, end_time, page, page_size } = req.query;
  if (!project) {
    res.status(400).send({ status: 400, message: 'Missing parameter: project' });
    return;
  }
  const result = queryErrorReports({
    project,
    start_time: start_time ? Number(start_time) : undefined,
    end_time: end_time ? Number(end_time) : undefined,
    page: page ? Number(page) : undefined,
    page_size: page_size ? Number(page_size) : undefined,
  });
  res.json({ status: 200, ...result });
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
