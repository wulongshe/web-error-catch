import express, { type Request } from 'express';
import { upload, handleUpload, handleReport, type UploadParams, getGiteeAuthUrl, handleGiteeCallback, syncAndGetRepos, getReposByUserId } from '#src/controller/index.ts';
import { queryErrorReports, queryProjectStats, getUserById } from '#src/database/index.ts';
import { authMiddleware, type AuthRequest } from '#src/middleware/auth.ts';

export const apiRouter = express.Router();
export const authRouter = express.Router();

type IRequest<T = {}, P = {}> = Request<{}, any, T, P, Record<string, any>>;

/** project 必须为 "owner/name" 格式 */
function isValidProject(project: string): boolean {
  const parts = project.split('/');
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
}

interface ReportParams {
  project: string;
  stack: string;
  context_lines?: string;
  source?: string;
  url?: string;
}

interface ReportListParams {
  project?: string;
  start_time?: string;
  end_time?: string;
  page?: string;
  page_size?: string;
}

interface ProjectStatsParams {
  start_time?: string;
  end_time?: string;
}

/** 测试接口 */
apiRouter.get('/test', (req, res) => {
  res.json({ status: 200, message: 'ok' });
});

/** 上报异常 */
apiRouter.get('/report', async (req: IRequest<{}, ReportParams>, res, next) => {
  const { stack, project, context_lines, source, url } = req.query;
  if (!project) {
    res.status(400).send({ status: 400, message: 'Missing parameter: project' });
    return;
  }
  if (!isValidProject(project)) {
    res.status(400).send({ status: 400, message: 'Invalid project format, expected "owner/name"' });
    return;
  }
  await handleReport(
    stack,
    project,
    req.get('user-agent'),
    url || req.get('referer'),
    context_lines ? Number(context_lines) : undefined,
    source,
  );
  res.send({ status: 200, message: 'success' });
  next();
});
apiRouter.post('/report', express.json({ type: ['application/json', 'text/plain'] }), async (req: IRequest<ReportParams>, res, next) => {
  const data = req.body;
  if (!data.project) {
    res.status(400).send({ status: 400, message: 'Missing parameter: project' });
    return;
  }
  if (!isValidProject(data.project)) {
    res.status(400).send({ status: 400, message: 'Invalid project format, expected "owner/name"' });
    return;
  }
  await handleReport(
    data.stack,
    data.project,
    req.get('user-agent'),
    data.url || req.get('referer'),
    data.context_lines ? Number(data.context_lines) : undefined,
    data.source,
  );
  res.send({ status: 200, message: 'success' });
  next();
});

/** 分页查询异常日志（project 可选） */
apiRouter.get('/report-list', authMiddleware, (req: IRequest<{}, ReportListParams>, res) => {
  const { project, start_time, end_time, page, page_size } = req.query;
  const result = queryErrorReports({
    project: project || undefined,
    start_time: start_time ? new Date(start_time).getTime() : undefined,
    end_time: end_time ? new Date(end_time).getTime() : undefined,
    page: page ? Number(page) : undefined,
    page_size: page_size ? Number(page_size) : undefined,
  });
  res.json({ status: 200, ...result });
});

/** 按项目分组统计异常数 */
apiRouter.get('/project-stats', authMiddleware, (req: IRequest<{}, ProjectStatsParams>, res) => {
  const { start_time, end_time } = req.query;
  const list = queryProjectStats({
    start_time: start_time ? new Date(start_time).getTime() : undefined,
    end_time: end_time ? new Date(end_time).getTime() : undefined,
  });
  res.json({ status: 200, list });
});

/** 查询数据库中的项目列表（需认证） */
apiRouter.get('/projects', authMiddleware, (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const list = getReposByUserId(userId);
  res.json({ status: 200, total: list.length, list });
});

function getRedirectUri(req: Request): string {
  return `${req.protocol}://${req.get('host')}/auth/gitee/callback`;
}

/** Gitee OAuth 登录跳转 */
authRouter.get('/gitee', (req, res) => {
  res.redirect(getGiteeAuthUrl(getRedirectUri(req)));
});

/** Gitee OAuth 回调 */
authRouter.get('/gitee/callback', async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) {
    res.status(400).json({ status: 400, message: 'Missing code' });
    return;
  }
  try {
    const result = await handleGiteeCallback(code, getRedirectUri(req));
    const params = new URLSearchParams({ token: result.token, user: JSON.stringify(result.user) });
    res.redirect(`${req.protocol}://${req.get('host')}/?${params}`);
  } catch (err) {
    res.status(500).json({ status: 500, message: (err as Error).message });
  }
});

/** 从 Gitee 同步仓库列表到数据库（需认证） */
apiRouter.post('/repos/sync', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const user = getUserById(userId);
  if (!user) {
    res.status(401).json({ status: 401, message: 'User not found' });
    return;
  }
  try {
    const list = await syncAndGetRepos(userId, user.access_token);
    res.json({ status: 200, total: list.length, list });
  } catch (err) {
    res.status(500).json({ status: 500, message: (err as Error).message });
  }
});

/** 上传文件 */
apiRouter.post('/upload', upload.array('file'), async (req: IRequest<{}, UploadParams>, res, next) => {
  const { project, timestamp } = req.query;
  const files = req.files as Express.Multer.File[] | undefined;

  if (!project || !timestamp || !files || files.length === 0) {
    res.status(400).send({ status: 400, message: 'Missing parameters: project, timestamp, or files' });
    return;
  }
  if (!isValidProject(String(project))) {
    res.status(400).send({ status: 400, message: 'Invalid project format, expected "owner/name"' });
    return;
  }

  const result = await handleUpload(String(project), Number(timestamp), files);
  res.send({ status: 200, message: 'success', ...result });
  next();
});
