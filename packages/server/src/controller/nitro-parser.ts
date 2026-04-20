import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface NitroParseResult {
  context: string | null;
  context_line: number | null;
}

// 匹配 stack 中的 "(file:///xxx:1:2)"、"(C:\\xxx:1:2)"、"(/xxx:1:2)" 或 "at xxx:1:2"
const FRAME_RE = /\(?((?:file:\/\/\/)?(?:[A-Za-z]:[\\/]|\/)[^()\n]+?):(\d+):(\d+)\)?/;

/**
 * Node --enable-source-maps 会把 error.stack 里的位置自动映射回源码绝对路径。
 * 这里按 stack 顺序找第一个能在本地磁盘读取到、且不在 node_modules 里的帧，
 * 读出其前后 contextLines 行作为业务代码上下文。
 */
export function parseNitroStack(stack: string, contextLines = 10): NitroParseResult {
  for (const raw of stack.split('\n')) {
    const m = raw.match(FRAME_RE);
    if (!m) continue;

    let filePath = m[1];
    const line = Number(m[2]);

    if (filePath.startsWith('file://')) {
      try {
        filePath = fileURLToPath(filePath);
      } catch {
        continue;
      }
    }
    if (filePath.includes('node_modules')) continue;
    if (!existsSync(filePath)) continue;

    try {
      const content = readFileSync(filePath, 'utf-8');
      const allLines = content.split('\n');
      const errorLineIndex = line - 1;
      if (errorLineIndex < 0 || errorLineIndex >= allLines.length) continue;

      const start = Math.max(0, errorLineIndex - contextLines);
      const end = Math.min(allLines.length - 1, errorLineIndex + contextLines);
      return {
        context: allLines.slice(start, end + 1).join('\n'),
        context_line: errorLineIndex - start + 1,
      };
    } catch {
      continue;
    }
  }
  return { context: null, context_line: null };
}
