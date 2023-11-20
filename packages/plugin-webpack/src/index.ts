import axios from 'axios';
import { Compilation, Compiler } from 'webpack';

export interface UploadSourceMapPluginOptions {
  url: string;
}
export default class UploadSourceMapPlugin {
  constructor(private options: UploadSourceMapPluginOptions) {}
  apply(compiler: Compiler) {
    if (compiler.options.mode !== 'production') return;
    compiler.hooks.emit.tap('UploadSourceMapPlugin', (compilation: Compilation) => {
      const sourceMaps = convertSourceMaps(compilation.assets);
      axios.post(this.options.url, sourceMaps);
    });
  }
}

export function convertSourceMaps(assets: Compilation['assets']): Record<string, string> {
  return Object.fromEntries(
    Object.entries(assets)
      .filter(([name]) => name.endsWith('.map'))
      .map(([name, asset]) => (delete assets[name], [name, (asset as any)?._value])),
  );
}
