import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

export function writeMaps(maps: Record<string, string>) {
  const sourceMapPath = resolve(process.cwd(), './map');
  if (!existsSync(sourceMapPath)) {
    mkdirSync(sourceMapPath);
  }

  Object.keys(maps).forEach((key) => {
    writeFileSync(join(sourceMapPath, key), maps[key]);
  });
}
