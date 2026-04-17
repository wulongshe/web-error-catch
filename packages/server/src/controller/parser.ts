import {
  SourceMapConsumer,
  type BasicSourceMapConsumer,
  type IndexedSourceMapConsumer,
  type NullableMappedPosition,
} from 'source-map';
import { readSourceMap } from './store.ts';
import { debounce } from '#src/utils.ts';

const consumerMap = new Map<string, BasicSourceMapConsumer | IndexedSourceMapConsumer>();
const destroyMap = new Map<string, () => void>();

async function getConsumer(sourcemap: string) {
  if (consumerMap.has(sourcemap)) {
    destroyMap.get(sourcemap)!();
    return consumerMap.get(sourcemap)!;
  }
  const consumer = await new SourceMapConsumer(readSourceMap(sourcemap));
  const destroy = debounce(() => (consumerMap.delete(sourcemap), consumer.destroy()), 60 * 60 * 1000);
  consumerMap.set(sourcemap, consumer);
  destroyMap.set(sourcemap, destroy);
  destroy();
  return consumer;
}

export interface ParseResult {
  parsed_stack: string;
  /** 截取的源码片段 */
  context: string | null;
  /** 出错行在截取片段中的行号（1-based） */
  context_line: number | null;
}

export async function parseStack(stack: string, contextLines = 10): Promise<ParseResult> {
  const regexp = /at\s+.+\/(.+):(\d+):(\d+)/;
  const [message, ...frames] = stack.split('\n');

  const matchArr = frames.map((frame) => frame.match(regexp)).filter(Boolean) as RegExpMatchArray[];
  const results = await Promise.all(
    matchArr.map(async ([, source, line, column]) => {
      const sourcemap = `${source}.map`;
      try {
        const consumer = await getConsumer(sourcemap);
        const ln = Number(line);
        const col = Number(column);
        let position = consumer.originalPositionFor({ line: ln, column: col });
        // Vite/Nuxt 生成的 chunk 顶部有额外一行（banner/"use strict"），
        // 导致 stack 的 line 比 source map mappings 多 1。查不到时回退尝试 line-1
        if (position.source == null && ln > 1) {
          position = consumer.originalPositionFor({ line: ln - 1, column: col });
        }
        return { consumer, position };
      } catch {
        return null;
      }
    }),
  );

  // 拼接解析后的调用栈
  const stackLines = (results.filter(Boolean) as NonNullable<(typeof results)[number]>[]).map(
    ({ position: { name, source, line, column } }) =>
      name ? `at ${name} (${source}:${line}:${column})` : `at ${source}:${line}:${column}`,
  );

  // 取第一个能拿到源码内容的帧作为上下文
  let context: string | null = null;
  let context_line: number | null = null;
  for (const result of results) {
    if (!result) continue;
    const { consumer, position } = result;
    if (!position.source || position.line == null) continue;
    const content = consumer.sourceContentFor(position.source, true);
    if (!content) continue;

    const allLines = content.split('\n');
    const errorLineIndex = position.line - 1; // 转为 0-based
    const start = Math.max(0, errorLineIndex - contextLines);
    const end = Math.min(allLines.length - 1, errorLineIndex + contextLines);

    context = allLines.slice(start, end + 1).join('\n');
    context_line = errorLineIndex - start + 1;
    break;
  }

  return {
    parsed_stack: stackLines.length ? message + '\n  ' + stackLines.join('\n  ') : '',
    context,
    context_line,
  };
}

/** 仅test使用 */
export async function __set_consumer_map__(sourcemap: string, content: string, wait: number) {
  const consumer = await new SourceMapConsumer(content);
  const destroy = debounce(() => (consumerMap.delete(sourcemap), consumer.destroy()), wait);
  consumerMap.set(sourcemap, consumer);
  destroyMap.set(sourcemap, destroy);
}
