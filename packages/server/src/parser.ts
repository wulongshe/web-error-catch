import {
  SourceMapConsumer,
  type BasicSourceMapConsumer,
  type IndexedSourceMapConsumer,
  type NullableMappedPosition,
} from 'source-map';
import { readSourceMap } from './store';
import { debounce } from './utils';

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

export async function parseStack(stack: string) {
  const regexp = /at\s+.+\/(.+):(\d+):(\d+)/;
  const [message, ...frames] = stack.split('\n');

  const matchArr = frames.map((frame) => frame.match(regexp)).filter(Boolean) as RegExpMatchArray[];
  const stacks = await Promise.all(
    matchArr.map(async ([, source, line, column]) => {
      const sourcemap = `${source}.map`;
      try {
        const consumer = await getConsumer(sourcemap);
        return consumer.originalPositionFor({ line: Number(line), column: Number(column) });
      } catch {
        return null;
      }
    }),
  );

  const lines = (stacks.filter(Boolean) as NullableMappedPosition[]).map(({ name, source, line, column }) =>
    name ? `at ${name} (${source}:${line}:${column})` : `at ${source}:${line}:${column}`,
  );
  if (!lines.length) return '';
  return message + '\n  ' + lines.join('\n  ');
}

/** 仅test使用 */
export async function __set_consumer_map__(sourcemap: string, content: string, wait: number) {
  const consumer = await new SourceMapConsumer(content);
  const destroy = debounce(() => (consumerMap.delete(sourcemap), consumer.destroy()), wait);
  consumerMap.set(sourcemap, consumer);
  destroyMap.set(sourcemap, destroy);
}
