import axios from 'axios';
import type { Plugin } from 'vite';
import { convertSourceMaps } from './utils.js';

export interface UploadSourceMapOptions {
  url: string;
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
      // 筛选出 sourcemap
      const sourceMaps = convertSourceMaps(bundle);
      // 上传 sourcemap
      axios.post(options.url, sourceMaps);
    },
  };
}
