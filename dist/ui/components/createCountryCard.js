export function createCountryCard(country) {
    const card = document.createElement('article');
    card.classList.add('country-card');
    const flag = document.createElement('img');
    flag.classList.add('country-card__flag');
    flag.alt = `Flag of ${country.name}`;
    if (country.flagImage) {
        flag.src = country.flagImage;
    }
    else {
        flag.hidden = true;
    }
    const content = document.createElement('div');
    content.classList.add('country-card__content');
    const name = document.createElement('h2');
    name.classList.add('country-card__title');
    name.textContent = country.name;
    const region = document.createElement('span');
    region.classList.add('country-card__badge');
    region.textContent = country.region || 'Unknown region';
    const capital = createInfoItem('Capital', country.capital);
    const population = createInfoItem('Population', country.population.toLocaleString());
    const languages = document.createElement('p');
    languages.classList.add('country-card__info');
    const languagesLabel = document.createElement('span');
    languagesLabel.classList.add('country-card__label');
    languagesLabel.textContent = 'Languages:';
    const languagesValue = document.createElement('span');
    languagesValue.classList.add('country-card__value');
    const visibleLanguages = country.languages.slice(0, 2);
    languagesValue.textContent = visibleLanguages.join(', ');
    languages.append(languagesLabel, languagesValue);
    const remainingCount = country.languages.length - visibleLanguages.length;
    if (remainingCount > 0) {
        const moreBadge = document.createElement('span');
        moreBadge.classList.add('country-card__more');
        moreBadge.textContent = `+${remainingCount}`;
        languages.append(moreBadge);
    }
    content.append(name, region, capital, population, languages);
    card.append(flag, content);
    return card;
}
function createInfoItem(label, value) {
    const item = document.createElement('p');
    item.classList.add('country-card__info');
    const labelElement = document.createElement('span');
    labelElement.classList.add('country-card__label');
    labelElement.textContent = `${label}:`;
    const valueElement = document.createElement('span');
    valueElement.classList.add('country-card__value');
    valueElement.textContent = value || 'Not available';
    item.append(labelElement, valueElement);
    return item;
}
//# sourceMappingURL=createCountryCard.js.map