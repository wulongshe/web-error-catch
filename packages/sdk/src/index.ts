import { catchError, catchUnhandledrejection } from './catch';

export interface Options {
  project: string;
  url: string;
}

export function register(options: Options) {
  if (typeof window === 'undefined') return;
  catchError(options);
  catchUnhandledrejection(options);
}

export { send } from './send';
