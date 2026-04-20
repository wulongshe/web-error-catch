import { Options } from './index';
import { send } from './send';

export function catchError({ project, url }: Options) {
  if (typeof window === 'undefined') return;
  window.addEventListener(
    'error',
    (error) => {
      send(url, { project, stack: error.error?.stack ?? String(error.error ?? error.message) });
    },
    true,
  );
}

export function catchUnhandledrejection({ project, url }: Options) {
  if (typeof window === 'undefined') return;
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      // const reason: any = event.reason;
      // const stack = reason?.stack ?? (typeof reason === 'string' ? reason : JSON.stringify(reason));
      // send(url, { project, stack });
    },
    true,
  );
}
