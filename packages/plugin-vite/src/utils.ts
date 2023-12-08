import axios from 'axios';
import FormData from 'form-data';
import type { Plugin } from 'vite';

export function convertSourceMaps(
  bundle: Parameters<Extract<Plugin['generateBundle'], (...args: any[]) => any>>[1],
): [key: string, value: string][] {
  return Object.entries(bundle)
    .filter(([fileName]) => fileName.endsWith('.map'))
    .map(([fileName, chunk]) => {
      delete bundle[fileName];
      const source = JSON.parse((chunk as any)?.source || '{}');
      delete source['sourcesContent'];
      return [fileName.split('/')[1], JSON.stringify(source)];
    });
}

export function uploadFile(url: string, filename: string, content: string) {
  const formData = new FormData();
  formData.append('file', content, { filename });
  return axios({
    method: 'POST',
    url,
    data: formData,
    headers: formData.getHeaders(),
  });
}
