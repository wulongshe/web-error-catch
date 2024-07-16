import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { publicPath } from './store';

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
