import type { CountryCard } from '../../core/mapCountryResponse.js';

export function createCountryCard(country: CountryCard): HTMLElement {
  const card = document.createElement('article');
  card.classList.add('country-card');

  const name = document.createElement('h2');
  name.textContent = country.name;

  const flag = document.createElement('p');
  flag.classList.add('country-card__flag');
  flag.textContent = country.flag;

  const capital = document.createElement('p');
  capital.textContent = `Capital: ${country.capital}`;

  const region = document.createElement('p');
  region.textContent = `Region: ${country.region}`;

  const population = document.createElement('p');
  population.textContent = `Population: ${country.population.toLocaleString()}`;

  const languages = document.createElement('p');
  languages.textContent = `Languages: ${country.languages.join(', ')}`;

  card.append(name, flag, capital, region, population, languages);

  return card;
}
