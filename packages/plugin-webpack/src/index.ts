import { Compiler, Compilation } from 'webpack';

export interface UploadSourceMapPluginOptions {
  url: string;
}
export default class UploadSourceMapPlugin {
  constructor(private options: UploadSourceMapPluginOptions) {}
  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('UploadSourceMapPlugin', (compilation: Compilation) => {
      // if (process.env.NODE_ENV !== 'production') return;
      const sourceMaps = Object.entries(compilation.assets)
        .filter(([name]) => name.endsWith('.map'))
        .map(([, asset]) => (asset as any)?._value);

      console.log('Generated Source Maps:');
      console.log(sourceMaps);
    });
  }
}
