export function setupCounter(element: HTMLButtonElement) {
  element.innerHTML = `trigger custom error`;
  element.addEventListener('click', () => {
    throw new Error('custom error');
  });
}
