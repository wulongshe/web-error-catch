import axios from 'axios';
import FormData from 'form-data';
import type { Compilation, Compiler } from 'webpack';

export interface UploadSourceMapPluginOptions {
  url: string;
  project: string;
}

export default class UploadSourceMapPlugin {
  constructor(private options: UploadSourceMapPluginOptions) {}
  apply(compiler: Compiler) {
    if (compiler.options.mode !== 'production') return;
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

function convertSourceMaps(assets: Compilation['assets']): [key: string, value: string][] {
  return Object.entries(assets)
    .filter(([name]) => name.endsWith('.map'))
    .map(([name, asset]) => {
      const raw = (asset as any)?._value ?? (typeof (asset as any)?.source === 'function' ? (asset as any).source() : '');
      const source = JSON.parse(raw || '{}');
      delete assets[name];
      return [name, JSON.stringify(source)];
    });
}

function uploadFiles(
  url: string,
  project: string,
  timestamp: number,
  files: [filename: string, content: string][],
): Promise<void> {
  const formData = new FormData();
  files.forEach(([filename, content]) => {
    formData.append('file', Buffer.from(content, 'utf-8'), { filename });
  });
  return axios({
    method: 'POST',
    url: `${url}?project=${encodeURIComponent(project)}&timestamp=${timestamp}`,
    data: formData,
    headers: formData.getHeaders(),
  });
}
