import type { Compilation, Compiler } from 'webpack';
import { convertSourceMaps, uploadFiles } from './utils.js';

export interface UploadSourceMapPluginOptions {
  url: string;
  project: string;
  force?: boolean;
}
export default class UploadSourceMapPlugin {
  constructor(private options: UploadSourceMapPluginOptions) {}
  apply(compiler: Compiler) {
    if (!this.options.force && compiler.options.mode !== 'production') return;
    compiler.options.devtool = 'hidden-source-map';

    compiler.hooks.emit.tapPromise('UploadSourceMapPlugin', async (compilation: Compilation) => {
      const sourceMaps = convertSourceMaps(compilation.assets);
      if (sourceMaps.length === 0) return;
      await uploadFiles(this.options.url, this.options.project, Date.now(), sourceMaps)
        .then(() => console.log(`[upload-sourcemap] uploaded ${sourceMaps.length} files`))
        .catch((err) => console.error('[upload-sourcemap] upload failed', err));
    });
  }
}
