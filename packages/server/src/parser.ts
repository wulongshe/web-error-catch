import { NullableMappedPosition, SourceMapConsumer } from 'source-map';

export interface IStack {
  funcName: string;
  fileName: string;
  line: number;
  column: number;
}

export async function parseStack(stack: string, readSourceMap: (fileName: string) => Promise<string>) {
  const regexp = /at\s+(.+)\s+\(.+\/(.+):(\d+):(\d+)\)/
  const [message, ...frames] = stack.split('\n')
  return {
    message,
    stacks: await Promise.all(frames.map(async (frame) => {
      const match = frame.match(regexp)
      if (!match) return null;
      const [, , fileName, line, column] = match;

      const sourceMap = await readSourceMap(`${fileName}.map`);
      const consumer = await new SourceMapConsumer(sourceMap);
      const result = consumer.originalPositionFor({ line: Number(line), column: Number(column) });
      consumer.destroy();
      return result;
    })).then((stacks) => stacks.filter(Boolean) as NullableMappedPosition[]),
  };
}
