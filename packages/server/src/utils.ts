import type { Request } from 'express';

export function debounce(func: () => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

/**
 * 获取请求的 origin（协议 + 主机）。
 * 优先使用 GITEE_REDIRECT_ORIGIN 环境变量，其次回退到 req.protocol + req.host。
 * 返回值不含尾部斜杠。
 */
export function getOrigin(req: Request): string {
  const envOrigin = process.env.GITEE_REDIRECT_ORIGIN;
  if (envOrigin) return envOrigin.replace(/\/+$/, '');
  return `${req.protocol}://${req.get('host')}`;
}

/**
 * 基于 origin 拼接路径，path 必须以 "/" 开头。
 */
export function buildUrl(req: Request, path: string): string {
  return `${getOrigin(req)}${path}`;
}
