import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { parseStack } from './parser';

export function writeMaps(maps: Record<string, string>) {
  const sourceMapPath = resolve(process.cwd(), './map');
  if (!existsSync(sourceMapPath)) {
    mkdirSync(sourceMapPath);
  }

  Object.keys(maps).forEach((key) => {
    writeFileSync(join(sourceMapPath, key), maps[key]);
  });
}

interface IReportError {
  meta: any;
  stack: string;
}

export async function reportError(buffer: ArrayBuffer) {
  const json = new TextDecoder('utf-8').decode(buffer);
  const data = JSON.parse(json) as IReportError;
  console.log(data);

  const { meta, stack } = data;
  const sourceMapPath = resolve(process.cwd(), './map');
  const { message, stacks } = await parseStack(stack, async (fileName) => readFileSync(join(sourceMapPath, fileName), 'utf8'))
  console.log(message, stacks);

  const originalStack = message + '\n' + stacks.map(({ source, line, column }) => `  at ${source}:${line}:${column}`).join('\n')
  console.log(originalStack);
}

