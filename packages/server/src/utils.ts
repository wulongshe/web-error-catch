export class Accessor<T extends Record<any, any>> {
  constructor(public value: T) {}
  get(path: string) {
    const keys = path.split('.');
    const value = keys.reduce((obj, key) => obj[key], this.value);
    return value as any;
  }
  set(path: string, value: any) {
    if (!path) return;
    const keys = path.split('.');
    const last_key = keys.pop()!;
    keys.reduce((obj, key) => obj[key], this.value)[last_key as keyof T] = value;
  }
}

export function debounce(func: () => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}
