export interface Options {
  project: string;
  url: string;
}

export function register(options: Options) {
  if (typeof window === 'undefined') return;
  catchError(options);
  catchUnhandledrejection(options);
}

function catchError({ project, url }: Options) {
  window.addEventListener(
    'error',
    (error) => {
      send(url, { project, stack: error.error?.stack ?? String(error.error ?? error.message) });
    },
    true,
  );
}

function catchUnhandledrejection({ project, url }: Options) {
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

function send(url: string, data: any) {
  if (!!navigator.sendBeacon) {
    sendBeacon(url, data);
  } else if (typeof fetch !== 'undefined') {
    sendFetch(url, data);
  } else if (typeof XMLHttpRequest !== 'undefined') {
    sendXHR(url, data);
  } else {
    sendImage(url, data);
  }
}

function sendBeacon(url: string, data: any) {
  navigator.sendBeacon(url, JSON.stringify(data));
}

function sendImage(url: string, data: any) {
  new Image().src = `${url}?${new URLSearchParams(data)}`;
}

function sendXHR(url: string, data: any) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${url}?${new URLSearchParams(data)}`);
  xhr.send();
}

function sendFetch(url: string, data: any) {
  fetch(`${url}?${new URLSearchParams(data)}`);
}
