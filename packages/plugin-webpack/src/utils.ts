import axios from 'axios';
import FormData from 'form-data';
import type { Compilation } from 'webpack';

export function convertSourceMaps(assets: Compilation['assets']): Record<string, string> {
  return Object.fromEntries(
    Object.entries(assets)
      .filter(([name]) => name.endsWith('.map'))
      .map(([name, asset]) => {
        const source = JSON.parse((asset as any)?._value);
        delete assets[name];
        delete source['sourcesContent'];
        return [name, JSON.stringify(source)];
      }),
  );
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
