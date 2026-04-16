import { catchError, catchUnhandledrejection } from './catch';

export interface Options {
  project: string;
  url: string;
}

export function register(options: Options) {
  catchError(options);
  catchUnhandledrejection(options);
}
