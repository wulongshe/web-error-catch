import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import multer from 'multer';
import { join, resolve } from 'path';

export const publicPath = resolve(process.cwd(), './public');

if (!existsSync(publicPath)) {
  mkdirSync(publicPath);
}

export function readSourceMap(fileName: string) {
  return readFileSync(join(publicPath, fileName), 'utf8');
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/'),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

export const binary = multer({
  storage: multer.memoryStorage(),
});
