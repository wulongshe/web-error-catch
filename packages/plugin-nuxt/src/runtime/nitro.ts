import type { NitroApp } from 'nitropack';
import { useRuntimeConfig } from '#imports';
import type { RuntimeOptions } from './types';

export default (nitroApp: NitroApp) => {
  const config = useRuntimeConfig();
  const { project, reportUrl } = config.public.meta as RuntimeOptions;

  nitroApp.hooks.hook('error', async (error: any, context: any) => {
    const payload = {
      project,
      stack: error?.stack ?? String(error),
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
