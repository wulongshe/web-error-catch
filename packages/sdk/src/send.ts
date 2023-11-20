export function send(url: string, data: any) {
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

export function sendBeacon(url: string, data: any) {
  navigator.sendBeacon(url, JSON.stringify(data));
}

export function sendImage(url: string, data: any) {
  new Image().src = `${url}?${new URLSearchParams(data)}`;
}

export function sendXHR(url: string, data: any) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${url}?${new URLSearchParams(data)}`);
  xhr.send();
}

export function sendFetch(url: string, data: any) {
  fetch(`${url}?${new URLSearchParams(data)}`);
}
