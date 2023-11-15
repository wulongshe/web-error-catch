export function setupCounter(element: HTMLButtonElement) {
  element.innerHTML = `trigger error`;
  element.addEventListener('click', () => {
    throw new Error('trigger error');
  });
}
