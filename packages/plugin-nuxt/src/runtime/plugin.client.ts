import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { send } from '@dt-wec/sdk';
import type { RuntimeOptions } from './types';

export default defineNuxtPlugin((nuxtApp) => {
  const { project, reportUrl } = useRuntimeConfig().public.meta as RuntimeOptions;

  // 同一错误可能经多条路径到达（Nuxt dev 下 vue:error hook + rethrow→window.error），
  // 按 stack 做短时去重，避免重复上报。
  const recent = new Set<string>();
  function reportOnce(err: unknown) {
    const stack = (err as { stack?: string })?.stack ?? String(err);
    if (recent.has(stack)) return;
    recent.add(stack);
    setTimeout(() => recent.delete(stack), 2000);
    send(reportUrl, { project, stack });
  }

  nuxtApp.hook('vue:error', reportOnce);
  nuxtApp.hook('app:error', reportOnce);

  // 兜底：非 Vue 栈的错误（定时器、纯 JS 模块、资源失败、未捕获 Promise）
  window.addEventListener('error', (event) => reportOnce(event.error ?? event.message), true);
  window.addEventListener('unhandledrejection', (event) => reportOnce(event.reason), true);
});
