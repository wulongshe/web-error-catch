import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { publicPath } from '#src/store.ts';

interface ReportErrorParamsLog {
  meta?: string;
  stack: string;
  original_stack: string;
}

const logPath = join(publicPath, 'report.log');

export function writLog(log: ReportErrorParamsLog) {
  if (!existsSync(logPath)) writeFileSync(logPath, '');
  appendFileSync(logPath, JSON.stringify(log) + ',');
}

export function readLog() {
  if (!existsSync(logPath)) return `[]`;
  return JSON.parse(`[${readFileSync(logPath, 'utf8').slice(0, -1)}]`);
}
