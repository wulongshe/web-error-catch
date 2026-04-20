import { parseStack } from './parser.ts';
import { parseNitroStack } from './nitro-parser.ts';
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
  source?: string,
) {
  // nitro 来源：stack 已是源码绝对路径（Node --enable-source-maps），按路径读本地文件取业务代码上下文
  if (source === 'nitro') {
    const { context, context_line } = parseNitroStack(stack, contextLines);
    saveErrorReport({
      project,
      stack,
      parsed_stack: stack,
      user_agent: userAgent,
      url,
      source_context: context ?? undefined,
      source_context_line: context_line ?? undefined,
    });
    return;
  }

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
