import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { saveUploadRecord, getRecordsToDelete, markAsDeleted } from '#src/database/index.ts';
import { publicPath } from './store.ts';

export interface UploadParams {
  project?: string;
  timestamp?: string;
}

// 每个项目保留的上传文件数量
const KEEP_UPLOAD_COUNT = Number(process.env.KEEP_UPLOAD_COUNT) || 3;

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

  // 清理旧文件（保留最新3次上传）
  await cleanupOldFiles(project);

  return { count: files.length };
}

/**
 * 清理项目的旧文件
 */
async function cleanupOldFiles(project: string) {
  const recordsToDelete = getRecordsToDelete(project, KEEP_UPLOAD_COUNT);

  for (const record of recordsToDelete) {
    const filePath = join(publicPath, record.filename);
    try {
      await rm(filePath, { force: true });
      markAsDeleted(record.id);
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
  }
}
