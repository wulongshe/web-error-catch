import { parseStack } from './parser.ts';
import { saveErrorReport } from '#src/database/index.ts';

/**
 * 解析并保存错误上报
 */
export async function handleReport(
  stack: string,
  project: string,
  userAgent: string | undefined,
  url: string | undefined,
  contextLines?: number,
) {
  const { parsed_stack, context, context_line } = await parseStack(stack, contextLines);
  saveErrorReport({
    project,
    stack,
    parsed_stack,
    user_agent: userAgent,
    url,
    source_context: context ?? undefined,
    source_context_line: context_line ?? undefined,
  });
}
