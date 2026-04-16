import axios from 'axios';
import FormData from 'form-data';
import type { Compilation } from 'webpack';

export function convertSourceMaps(assets: Compilation['assets']): [key: string, value: string][] {
  return Object.entries(assets)
    .filter(([name]) => name.endsWith('.map'))
    .map(([name, asset]) => {
      const source = JSON.parse((asset as any)?._value || '{}');
      delete assets[name];
      return [name, JSON.stringify(source)];
    });
}

export function uploadFiles(
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
