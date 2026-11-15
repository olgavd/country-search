export function createLoader(): HTMLElement {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  loader.textContent = 'Loading...';

  return loader;
}
