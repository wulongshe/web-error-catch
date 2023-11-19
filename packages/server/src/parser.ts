import { SourceMapConsumer } from 'source-map';

export async function parseStack(stack: string, readSourceMap: (fileName: string) => string | Promise<string>) {
  const regexp = /at\s+.+\/(.+):(\d+):(\d+)/;
  // const regexp = /at\s+(.+)\s+\(.+\/(.+):(\d+):(\d+)\)/;
  const [message, ...frames] = stack.split('\n');

  const matchArr = frames.map((frame) => frame.match(regexp)).filter(Boolean) as RegExpMatchArray[];
  // const stacks = await Promise.all(matchArr.map(async ([, , source, line, column]) => {
  const stacks = await Promise.all(
    matchArr.map(async ([, source, line, column]) => {
      const sourceMap = await readSourceMap(`${source}.map`);
      const consumer = await new SourceMapConsumer(sourceMap);
      const result = consumer.originalPositionFor({ line: Number(line), column: Number(column) });
      consumer.destroy();
      return result;
    }),
  );

  return { message, stacks };
}
