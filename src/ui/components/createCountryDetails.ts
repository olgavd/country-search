import type { CountryCard } from '../../core/mapCountryResponse.js';

function createDetailItem(label: string, value: string): HTMLElement {
  const item = document.createElement('div');
  item.classList.add('country-details__item');

  const term = document.createElement('dt');
  term.textContent = label;

  const description = document.createElement('dd');
  description.textContent = value || 'Not available';

  item.append(term, description);

  return item;
}

export function createCountryDetails(country: CountryCard): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.classList.add('country-details');

  const header = document.createElement('div');
  header.classList.add('country-details__header');

  const title = document.createElement('h2');
  title.classList.add('country-details__title');
  title.id = 'country-details-title';
  title.textContent = country.name;

  const closeButton = document.createElement('button');
  closeButton.classList.add('country-details__close');
  closeButton.type = 'button';
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close details');

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  header.append(title, closeButton);

  const flag = document.createElement('p');
  flag.classList.add('country-details__flag');
  flag.textContent = country.flag;

  const detailsList = document.createElement('dl');
  detailsList.classList.add('country-details__list');

  detailsList.append(
    createDetailItem('Capital', country.capital),
    createDetailItem('Region', country.region),
    createDetailItem('Population', country.population.toLocaleString()),
    createDetailItem('Languages', country.languages.join(', ')),
    createDetailItem('Description', country.description),
    createDetailItem('Area', `${country.area.toLocaleString()} km²`),
    createDetailItem('Borders', country.borders.join(', ')),
    createDetailItem('Currencies', country.currencies.join(', ')),
  );

  dialog.setAttribute('aria-labelledby', title.id);

  dialog.append(header, flag, detailsList);

  return dialog;
}
