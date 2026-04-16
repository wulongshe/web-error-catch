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
    project TEXT NOT NULL,
    stack TEXT NOT NULL,
    parsed_stack TEXT,
    created_at INTEGER NOT NULL,
    user_agent TEXT,
    url TEXT,
    source_context TEXT,
    source_context_line INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_created_at ON error_reports(created_at);
  CREATE INDEX IF NOT EXISTS idx_project ON error_reports(project);

  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    filename TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    deleted INTEGER DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_upload_timestamp ON uploads(timestamp);
  CREATE INDEX IF NOT EXISTS idx_upload_project ON uploads(project);

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL
  );
`);

export interface ErrorReport {
  project: string;
  stack: string;
  parsed_stack?: string;
  user_agent?: string;
  url?: string;
  source_context?: string;
  source_context_line?: number;
}

/**
 * 保存错误报告到数据库
 */
export function saveErrorReport(report: ErrorReport) {
  const stmt = db.prepare(`
    INSERT INTO error_reports (project, stack, parsed_stack, created_at, user_agent, url, source_context, source_context_line)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    report.project,
    report.stack,
    report.parsed_stack || null,
    Date.now(),
    report.user_agent || null,
    report.url || null,
    report.source_context || null,
    report.source_context_line ?? null,
  );
}

export interface QueryErrorReportsParams {
  project: string;
  start_time?: number;
  end_time?: number;
  page?: number;
  page_size?: number;
}

/**
 * 分页查询错误报告
 */
export function queryErrorReports(params: QueryErrorReportsParams) {
  const { project, start_time, end_time, page = 1, page_size = 20 } = params;

  const conditions: string[] = ['project = ?'];
  const args: (string | number)[] = [project];

  if (start_time != null) {
    conditions.push('created_at >= ?');
    args.push(start_time);
  }
  if (end_time != null) {
    conditions.push('created_at <= ?');
    args.push(end_time);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * page_size;

  const total = (db.prepare(`SELECT COUNT(*) as count FROM error_reports ${where}`).get(...args) as { count: number }).count;
  const list = db.prepare(`
    SELECT id, project, stack, parsed_stack, created_at, user_agent, url, source_context, source_context_line
    FROM error_reports ${where}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(...args, page_size, offset) as Array<{
    id: number;
    project: string | null;
    stack: string;
    parsed_stack: string | null;
    created_at: number;
    user_agent: string | null;
    url: string | null;
    source_context: string | null;
    source_context_line: number | null;
  }>;

  return { total, page, page_size, list };
}

/**
 * 清空所有错误报告
 */
export function clearErrorReports() {
  db.exec('DELETE FROM error_reports');
}

/**
 * 保存文件上传记录；已存在相同 project+filename 则更新 timestamp
 */
export function saveUploadRecord(project: string, timestamp: number, filename: string) {
  const now = Date.now();
  const update = db.prepare(`
    UPDATE uploads
    SET timestamp = ?, created_at = ?, deleted = 0
    WHERE project = ? AND filename = ?
  `);
  const { changes } = update.run(timestamp, now, project, filename);
  if (changes > 0) return;

  db.prepare(`
    INSERT INTO uploads (project, timestamp, filename, created_at)
    VALUES (?, ?, ?, ?)
  `).run(project, timestamp, filename, now);
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

/**
 * 获取项目需要删除的上传记录
 */
export function getRecordsToDelete(project: string, keepTimes: number = 3) {
  const stmt = db.prepare(`
    SELECT id, filename, timestamp
    FROM uploads
    WHERE project = ? AND deleted IS NOT 1
      AND timestamp NOT IN (
        SELECT DISTINCT timestamp
        FROM uploads
        WHERE project = ? AND deleted IS NOT 1
        ORDER BY timestamp DESC
        LIMIT ?
      )
  `);
  return stmt.all(project, project, keepTimes) as Array<{
    id: number;
    filename: string;
    timestamp: number;
  }>;
}

/**
 * 标记上传记录为已删除
 */
export function markAsDeleted(id: number) {
  const stmt = db.prepare('UPDATE uploads SET deleted = 1 WHERE id = ?');
  stmt.run(id);
}

/**
 * 记录项目（已存在则忽略）
 */
export function upsertProject(name: string) {
  db.prepare(`
    INSERT INTO projects (name, created_at)
    VALUES (?, ?)
    ON CONFLICT(name) DO NOTHING
  `).run(name, Date.now());
}

/**
 * 查询所有项目列表
 */
export function getProjects() {
  return db.prepare(`
    SELECT id, name, created_at FROM projects ORDER BY created_at ASC
  `).all() as Array<{ id: number; name: string; created_at: number }>;
}
