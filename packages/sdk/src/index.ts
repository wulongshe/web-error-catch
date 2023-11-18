import { send } from './send';

export interface Options {
  meta?: string;
  url: string;
}

export function convertStringToArrayBuffer(str: string) {
  return new TextEncoder().encode(str).buffer;
}

export function register(options: Options) {
  const { meta, url } = options;
  window.addEventListener(
    'error',
    (error) => {
      console.log('error', error);
      send(url, { meta, stack: error.error.stack });
    },
    true,
  );
  /* promise异常 */
  window.addEventListener(
    'unhandledrejection',
    (error) => {
      console.log('unhandledrejection', error);
    },
    true,
  );
}
