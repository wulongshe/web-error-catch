import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import multer from 'multer';
import { join, resolve } from 'node:path';

export const uploadsPath = resolve(process.cwd(), './uploads');

if (!existsSync(uploadsPath)) {
  mkdirSync(uploadsPath);
}

export function readSourceMap(fileName: string) {
  return readFileSync(join(uploadsPath, fileName), 'utf8');
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

export const binary = multer({
  storage: multer.memoryStorage(),
});
