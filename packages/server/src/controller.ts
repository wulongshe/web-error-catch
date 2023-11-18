import { useLog } from './log';
import { parseStack } from './parser';
import { readSourceMap } from './store';

export interface IReportError {
  meta?: string;
  stack: string;
}

export async function reportError({ meta, stack }: IReportError) {
  const { message, stacks } = await parseStack(stack, readSourceMap)
  const originalStack = message + '\n' + stacks.map(({ name, source, line, column }) => `  at ${name} (${source}:${line}:${column})`).join('\n')
  const log = useLog();
  log({ meta, stack, originalStack })
}

