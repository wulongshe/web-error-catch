import axios from 'axios';
import type { Compilation, Compiler } from 'webpack';
import { convertSourceMaps } from './utils.js';

export interface UploadSourceMapPluginOptions {
  url: string;
  force?: boolean;
}
export default class UploadSourceMapPlugin {
  constructor(private options: UploadSourceMapPluginOptions) {}
  apply(compiler: Compiler) {
    if (!this.options.force && compiler.options.mode !== 'production') return;
    compiler.options.devtool = 'source-map';

    compiler.hooks.emit.tap('UploadSourceMapPlugin', (compilation: Compilation) => {
      const sourceMaps = convertSourceMaps(compilation.assets);
      axios.post(this.options.url, sourceMaps);
    });
  }
}
