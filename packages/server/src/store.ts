import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

export const publicPath = resolve(process.cwd(), './public');

export function writeSourceMaps(maps: Record<string, string>) {
  if (!existsSync(publicPath)) {
    mkdirSync(publicPath);
  }

  Object.keys(maps).forEach((key) => {
    writeFileSync(join(publicPath, key), maps[key]);
  });
}

export function readSourceMap(fileName: string) {
  return readFileSync(join(publicPath, fileName), 'utf8');
}
