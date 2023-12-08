import type { Compilation, Compiler } from 'webpack';
import { convertSourceMaps, uploadFile } from './utils.js';

export interface UploadSourceMapPluginOptions {
  url: string;
  force?: boolean;
}
export default class UploadSourceMapPlugin {
  constructor(private options: UploadSourceMapPluginOptions) {}
  apply(compiler: Compiler) {
    if (!this.options.force && compiler.options.mode !== 'production') return;
    compiler.options.devtool = 'hidden-source-map';

    compiler.hooks.emit.tap('UploadSourceMapPlugin', (compilation: Compilation) => {
      const sourceMaps = convertSourceMaps(compilation.assets);
      sourceMaps.forEach(([key, value]) => {
        uploadFile(this.options.url, key, value)
          .then(() => console.log(`Success upload ${key}`))
          .catch(() => console.error(`Failed upload ${key}`));
      });
    });
  }
}
