import { Compiler, Compilation } from 'webpack';

export interface UploadSourceMapPluginOptions {
  url: string;
}
export default class UploadSourceMapPlugin {
  constructor(private options: UploadSourceMapPluginOptions) {}
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap('UploadSourceMapPlugin', (compilation: Compilation) => {
      if (process.env.NODE_ENV === 'production') {
        const sourceMapFilePath = compilation.options.output.sourceMapFilename;
        console.log('Source map file path:', sourceMapFilePath);
      }
    });
  }
}
