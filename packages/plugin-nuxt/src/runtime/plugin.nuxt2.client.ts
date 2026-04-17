import Vue from 'vue';
import { register, send } from '@dt-wec/sdk';

interface Nuxt2Context {
  app: { router?: { onError?: (cb: (err: any) => void) => void } };
  $config?: { meta?: { project: string; reportUrl: string } };
}

export default function ({ app, $config }: Nuxt2Context) {
  const { project = '', reportUrl = '' } = $config?.meta ?? {};
  if (!project || !reportUrl) return;

  register({ project, url: reportUrl });

  Vue.config.errorHandler = (err, _vm, info) => {
    const stack = (err as any)?.stack ?? `${String(err)} [${info}]`;
    send(reportUrl, { project, stack });
  };

  if (app.router?.onError) {
    app.router.onError((err: any) => {
      send(reportUrl, { project, stack: err?.stack ?? String(err) });
    });
  }
}
