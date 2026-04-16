import { writLog } from '#src/logger.ts';
import { parseStack } from '#src/parser.ts';

export interface ReportErrorParams {
  meta?: string;
  stack: string;
}

export async function reportError({ meta, stack }: ReportErrorParams) {
  const original_stack = await parseStack(stack);
  writLog({ meta, stack, original_stack });
}
