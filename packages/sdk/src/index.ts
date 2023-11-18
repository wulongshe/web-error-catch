import { catchError, catchUnhandledrejection } from './catch';

export interface Options {
  meta?: string;
  url: string;
}

export function register(options: Options) {
  catchError(options);
  catchUnhandledrejection(options);
}
