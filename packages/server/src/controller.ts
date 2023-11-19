import { useLog } from './logger';
import { parseStack } from './parser';
import { readSourceMap } from './store';

export interface IReportError {
  meta?: string;
  stack: string;
}

export async function reportError({ meta, stack }: IReportError) {
  const { message, stacks } = await parseStack(stack, readSourceMap);
  const lines = stacks.map(({ name, source, line, column }) =>
    name ? `at ${name} (${source}:${line}:${column})` : `at ${source}:${line}:${column}`,
  );
  const originalStack = message + '\n  ' + lines.join('\n  ');
  const log = useLog();
  log({ meta, stack, originalStack });
}
