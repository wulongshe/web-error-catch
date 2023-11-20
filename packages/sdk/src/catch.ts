import { Options } from './index';
import { send } from './send';

export function catchError({ meta, url }: Options) {
  window.addEventListener(
    'error',
    (error) => {
      send(url, { meta, stack: error.error.stack });
    },
    true,
  );
}

export function catchUnhandledrejection({ meta, url }: Options) {
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      console.log('unhandledrejection', event);
    },
    true,
  );
}
