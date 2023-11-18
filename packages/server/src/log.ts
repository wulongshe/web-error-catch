import axios from 'axios';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { publicPath } from './store';

interface IReportErrorLog {
  meta?: string;
  stack: string;
  originalStack: string;
}

const logPath = join(publicPath, 'report.log');

let report: ((log: IReportErrorLog) => Promise<void> | void) | null = null

export function initialize({ method, url }: { method: string, url: string }) {
  report = async (data: IReportErrorLog) => await axios({ method, url, data });
}

export function useLog() {
  return report || ((log: IReportErrorLog) => {
    if (!existsSync(logPath)) writeFileSync(logPath, '');
    appendFileSync(logPath, JSON.stringify(log) + ',');
  });
}

export function readLog() {
  if (!existsSync(logPath)) return `[]`;
  return JSON.parse(`[${readFileSync(logPath, 'utf8').slice(0, -1)}]`);
}
