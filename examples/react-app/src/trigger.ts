export function setupCounter(element: HTMLButtonElement) {
  element.innerHTML = `trigger custom error`;
  element.addEventListener('click', () => {
    Promise.reject('custom promise reject');
    throw new Error('custom error');
  });
}
