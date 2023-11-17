export function send(url: string, data: any) {
  navigator.sendBeacon(url, JSON.stringify(data))
}
