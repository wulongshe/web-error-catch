import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { saveUploadRecord, getRecordsToDelete, markAsDeleted } from '#src/database/index.ts';
import { uploadsPath } from './store.ts';
import { logger } from '#src/logger.ts';

export interface UploadParams {
  project?: string;
  timestamp?: string;
}

// 每个项目保留的上传文件次数
const KEEP_UPLOAD_TIMES = 3;

/**
 * 处理多文件上传逻辑
 */
export async function handleUpload(
  project: string,
  timestamp: number,
  files: Express.Multer.File[],
) {
  // 保存上传记录
  files.forEach((file) => {
    saveUploadRecord(project, timestamp, file.filename);
  });

  // 清理旧文件
  await cleanupOldFiles(project);

  return { count: files.length };
}

/**
 * 清理项目的旧文件
 */
async function cleanupOldFiles(project: string) {
  const recordsToDelete = getRecordsToDelete(project, KEEP_UPLOAD_TIMES);

  for (const record of recordsToDelete) {
    const filePath = join(uploadsPath, record.filename);
    try {
      await rm(filePath, { force: true });
      markAsDeleted(record.id);
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error);
    }
  }
}
