import axios from 'axios';
import { writLog } from './logger';
import { parseStack } from './parser';
import { readSourceMap } from './store';
import { Accessor } from './utils';

export interface ReportErrorParams {
  meta?: string;
  stack: string;
}

export async function reportError({ meta, stack }: ReportErrorParams) {
  const original_stack = await parseStack(stack, readSourceMap);
  writLog({ meta, stack, original_stack });
}

export interface TransformErrorParams {
  data: Record<any, any>;
  stack_path: string;
  forward_url: string;
}

export async function transformError({ data, stack_path }: TransformErrorParams): Promise<any> {
  const accessor = new Accessor(data);
  const stack = accessor.get(stack_path) as string;
  const original_stack = await parseStack(stack, readSourceMap);
  if (!stack_path) return original_stack;
  accessor.set(stack_path, original_stack);
  return accessor.value;
}

export async function forward(send: (data: any) => any, config: { method: 'GET' | 'POST'; url: string; data: any }) {
  const response = await axios(config);
  send(response.data);
}
