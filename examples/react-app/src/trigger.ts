export function setupCounter(element: HTMLButtonElement) {
  element.innerHTML = `trigger custom error`;
  element.addEventListener('click', () => {
    setTimeout(() => Promise.reject('custom promise reject'));
    throw new Error('custom error');
  });
}
