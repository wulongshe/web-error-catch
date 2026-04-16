import { Options } from './index';
import { send } from './send';

export function catchError({ project, url }: Options) {
  window.addEventListener(
    'error',
    (error) => {
      send(url, { project, stack: error.error.stack });
    },
    true,
  );
}

export function catchUnhandledrejection({ project, url }: Options) {
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      // console.log('unhandledrejection', event);
    },
    true,
  );
}
