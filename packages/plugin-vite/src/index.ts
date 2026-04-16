import type { Plugin } from 'vite';
import { convertSourceMaps, uploadFiles } from './utils.js';

export interface UploadSourceMapOptions {
  url: string;
  project: string;
  // 默认只有在 production 模式下才会上传 sourcemap
  force?: boolean;
}

export default function uploadSourceMapPlugin(options: UploadSourceMapOptions): Plugin {
  let isProduction = false;
  return {
    name: 'upload-sourcemap-plugin',
    configResolved(config) {
      if (!options.force && config.mode !== 'production') return;
      isProduction = true;
      // 开启 sourcemap
      config.build.sourcemap = 'hidden';
    },
    generateBundle(_, bundle) {
      if (!options.force && !isProduction) return;
      const sourceMaps = convertSourceMaps(bundle);
      if (sourceMaps.length === 0) return;
      uploadFiles(options.url, options.project, Date.now(), sourceMaps)
        .then(() => console.log(`[upload-sourcemap] uploaded ${sourceMaps.length} files`))
        .catch((err) => console.error('[upload-sourcemap] upload failed', err));
    },
  };
}
