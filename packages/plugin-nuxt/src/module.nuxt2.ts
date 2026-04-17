import path from 'node:path';
import { fileURLToPath } from 'node:url';
import UploadSourceMapPlugin from '@dt-wec/plugin-webpack';

export interface ModuleOptions {
  project: string;
  reportUrl: string;
  uploadUrl?: string;
  sourcemap?: boolean;
  force?: boolean;
  server?: boolean;
}

// Nuxt 2 module — invoked with `this` bound to the Nuxt 2 module container.
export default function DtWecNuxt2Module(this: any, moduleOptions: Partial<ModuleOptions> = {}) {
  const options: ModuleOptions = {
    project: '',
    reportUrl: '',
    sourcemap: true,
    force: false,
    server: true,
    ...(this.options.meta || {}),
    ...moduleOptions,
  };

  if (!options.project) throw new Error('[@dt-wec/plugin-nuxt/nuxt2] `project` is required');
  if (!options.reportUrl) throw new Error('[@dt-wec/plugin-nuxt/nuxt2] `reportUrl` is required');

  this.options.publicRuntimeConfig = this.options.publicRuntimeConfig || {};
  this.options.publicRuntimeConfig.meta = {
    project: options.project,
    reportUrl: options.reportUrl,
  };

  const here =
    typeof __dirname !== 'undefined'
      ? __dirname
      : path.dirname(fileURLToPath(import.meta.url));

  this.addPlugin({
    src: path.resolve(here, 'runtime/plugin.nuxt2.client.js'),
    mode: 'client',
    fileName: 'dt-wec.client.js',
  });

  if (options.sourcemap && options.uploadUrl) {
    this.extendBuild((config: any, ctx: any) => {
      if (!ctx?.isClient) return;
      config.plugins = config.plugins || [];
      config.plugins.push(
        new UploadSourceMapPlugin({
          url: options.uploadUrl!,
          project: options.project,
          force: options.force,
        }),
      );
    });
  }

  if (options.server) {
    this.nuxt.hook('render:errorMiddleware', (app: any) => {
      app.use((err: any, _req: any, _res: any, next: any) => {
        const payload = new URLSearchParams({
          project: options.project,
          stack: err?.stack ?? String(err),
          source: 'nuxt2-ssr',
        });
        fetch(`${options.reportUrl}?${payload.toString()}`, { method: 'GET' }).catch(() => {});
        next(err);
      });
    });
  }
}

(DtWecNuxt2Module as any).meta = { name: '@dt-wec/plugin-nuxt' };
