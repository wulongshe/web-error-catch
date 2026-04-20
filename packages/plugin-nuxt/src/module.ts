import { defineNuxtModule, addPlugin, addVitePlugin, addWebpackPlugin, addServerPlugin, createResolver } from '@nuxt/kit';
import uploadViteSourceMapPlugin from '@dt-wec/plugin-vite';
import UploadWebpackSourceMapPlugin from '@dt-wec/plugin-webpack';

export interface ModuleOptions {
  project: string;
  reportUrl: string;
  uploadUrl?: string;
  sourcemap?: boolean;
  force?: boolean;
  server?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@dt-wec/plugin-nuxt',
    configKey: 'meta',
    compatibility: { nuxt: '^3.0.0' },
  },
  defaults: {
    project: '',
    reportUrl: '',
    sourcemap: true,
    force: false,
    server: true,
  },
  setup(options, nuxt) {
    if (!options.project) throw new Error('[@dt-wec/plugin-nuxt] `project` is required');
    if (!options.reportUrl) throw new Error('[@dt-wec/plugin-nuxt] `reportUrl` is required');

    const resolver = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.meta = {
      project: options.project,
      reportUrl: options.reportUrl,
    };

    addPlugin({ src: resolver.resolve('./runtime/plugin.client'), mode: 'client' });

    if (options.server) {
      addServerPlugin(resolver.resolve('./runtime/nitro'));
    }

    if (options.sourcemap && options.uploadUrl) {
      // Nuxt 3 默认 sourcemap.client: false，必须在模块层强制开启 hidden
      // 否则客户端构建根本不产出 .map 文件，上传插件就拿不到东西
      nuxt.options.sourcemap = nuxt.options.sourcemap || ({} as any);
      (nuxt.options.sourcemap as any).client = 'hidden';

      const isWebpack = String(nuxt.options.builder ?? '').includes('webpack');
      if (isWebpack) {
        addWebpackPlugin(
          new UploadWebpackSourceMapPlugin({
            url: options.uploadUrl,
            project: options.project,
            force: options.force,
          }),
          { client: true, server: false },
        );
      } else {
        addVitePlugin(
          uploadViteSourceMapPlugin({
            url: options.uploadUrl,
            project: options.project,
            force: options.force,
          }) as Parameters<typeof addVitePlugin>[0],
          { client: true, server: false },
        );
      }
    }
  },
});

declare module '@nuxt/schema' {
  interface NuxtConfig {
    meta?: Partial<ModuleOptions>;
  }
  interface NuxtOptions {
    meta?: ModuleOptions;
  }
}
