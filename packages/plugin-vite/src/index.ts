import axios from 'axios';
import FormData from 'form-data';
import type { Plugin } from 'vite';

export interface UploadSourceMapOptions {
  url: string;
  project: string;
}

export default function uploadSourceMapPlugin(options: UploadSourceMapOptions): Plugin {
  let isProduction = false;
  return {
    name: 'upload-sourcemap-plugin',
    configResolved(config) {
      if (config.mode !== 'production') return;
      isProduction = true;
      // 开启 sourcemap
      config.build.sourcemap = 'hidden';
    },
    generateBundle(_, bundle) {
      if (!isProduction) return;
      const sourceMaps = convertSourceMaps(bundle);
      if (sourceMaps.length === 0) return;
      uploadFiles(options.url, options.project, Date.now(), sourceMaps)
        .then(() => console.log(`[upload-sourcemap] uploaded ${sourceMaps.length} files`))
        .catch((err) => console.error('[upload-sourcemap] upload failed', err));
    },
  };
}

function convertSourceMaps(
  bundle: Parameters<Extract<Plugin['generateBundle'], (...args: any[]) => any>>[1],
): [key: string, value: string][] {
  return Object.entries(bundle)
    .filter(([fileName]) => fileName.endsWith('.map'))
    .map(([fileName, chunk]) => {
      delete bundle[fileName];
      const source = JSON.parse((chunk as any)?.source || '{}');
      return [fileName.split('/')[1], JSON.stringify(source)];
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
