import type { Plugin } from 'vite';

export function convertSourceMaps(bundle: Parameters<Extract<Plugin['generateBundle'], (...args: any[]) => any>>[1]) {
  return Object.fromEntries(
    Object.entries(bundle)
      .filter(([fileName]) => fileName.endsWith('.map'))
      .map(([fileName, chunk]) => {
        delete bundle[fileName];
        const source = JSON.parse((chunk as any).source);
        delete source['sourcesContent'];
        return [fileName.split('/')[1], JSON.stringify(source)];
      }),
  );
}
