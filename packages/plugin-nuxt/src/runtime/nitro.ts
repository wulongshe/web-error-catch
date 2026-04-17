import type { NitroApp } from 'nitropack';
import { useRuntimeConfig } from '#imports';
import type { RuntimeOptions } from './types';

export default (nitroApp: NitroApp) => {
  const config = useRuntimeConfig();
  const { project, reportUrl } = config.public.meta as RuntimeOptions;

  // Nitro h3 的 error hook 在 dev 下会对同一错误触发两次（路由抛错 + 错误响应渲染），
  // 按 stack 做短时去重。
  const recent = new Set<string>();

  nitroApp.hooks.hook('error', async (error: any, context: any) => {
    const stack = error?.stack ?? String(error);
    if (recent.has(stack)) return;
    recent.add(stack);
    setTimeout(() => recent.delete(stack), 2000);

    const payload = {
      project,
      stack,
      url: context?.event?.path ?? '',
      source: 'nitro',
    };
    try {
      await fetch(`${reportUrl}?${new URLSearchParams(payload as any)}`, { method: 'GET' });
    } catch {
      // 静默，避免上报失败再次触发 error hook
    }
  });
};
