export function setupCounter(element: HTMLButtonElement) {
  element.innerHTML = `trigger custom error`;
  element.addEventListener('click', func1);
}

function func1() {
  func2();
}

function func2() {
  setTimeout(() => Promise.reject('custom promise reject'));
  throw new Error('custom error');
}
