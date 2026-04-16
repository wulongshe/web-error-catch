import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';

const dataDir = join(process.cwd(), 'data');

// Ensure data directory exists
await mkdir(dataDir, { recursive: true });

const dbPath = join(dataDir, 'monitor.db');
const db = new DatabaseSync(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS error_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stack TEXT NOT NULL,
    parsed_stack TEXT,
    created_at INTEGER NOT NULL,
    user_agent TEXT,
    url TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_created_at ON error_reports(created_at);

  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    filename TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_upload_timestamp ON uploads(timestamp);
`);

export interface ErrorReport {
  stack: string;
  parsed_stack?: string;
  user_agent?: string;
  url?: string;
}

/**
 * 保存错误报告到数据库
 */
export function saveErrorReport(report: ErrorReport) {
  const stmt = db.prepare(`
    INSERT INTO error_reports (stack, parsed_stack, created_at, user_agent, url)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    report.stack,
    report.parsed_stack || null,
    Date.now(),
    report.user_agent || null,
    report.url || null,
  );
}

/**
 * 查询错误报告
 */
export function getErrorReports(limit = 100, offset = 0) {
  const stmt = db.prepare(`
    SELECT id, stack, parsed_stack, created_at, user_agent, url
    FROM error_reports
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(limit, offset) as Array<{
    id: number;
    stack: string;
    parsed_stack: string | null;
    created_at: number;
    user_agent: string | null;
    url: string | null;
  }>;
}

/**
 * 获取错误报告总数
 */
export function getErrorReportCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM error_reports');
  const result = stmt.get() as { count: number };
  return result.count;
}

/**
 * 清空所有错误报告
 */
export function clearErrorReports() {
  db.exec('DELETE FROM error_reports');
}

/**
 * 保存文件上传记录
 */
export function saveUploadRecord(project: string, timestamp: number, filename: string) {
  const stmt = db.prepare(`
    INSERT INTO uploads (project, timestamp, filename, created_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(project, timestamp, filename, Date.now());
}

/**
 * 查询文件上传记录
 */
export function getUploadRecords(limit = 100, offset = 0) {
  const stmt = db.prepare(`
    SELECT id, project, timestamp, filename, created_at
    FROM uploads
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(limit, offset) as Array<{
    id: number;
    project: string;
    timestamp: number;
    filename: string;
    created_at: number;
  }>;
}

/**
 * 清空所有上传记录
 */
export function clearUploadRecords() {
  db.exec('DELETE FROM uploads');
}
