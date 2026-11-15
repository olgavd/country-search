import { createSearch } from './ui/components/createSearch.js';
import { createSearchController } from './app.js';
import { searchCountries } from './api/searchCountries.js';
import { mapCountryResponse } from './core/mapCountryResponse.js';
import { createCountryCard } from './ui/components/createCountryCard.js';
import { createLoader } from './ui/components/createLoader.js';
import { createCountryDetails } from './ui/components/createCountryDetails.js';

let currentQuery = '';

const resultsContainer = document.createElement('section');
resultsContainer.classList.add('countries');

const searchController = createSearchController({
  onLoading: () => {
    showLoader();
  },
  search: searchCountries,

  onResults: (results) => {
    if (results.length === 0) {
      resultsContainer.replaceChildren();

      if (currentQuery.trim()) {
        resultsContainer.textContent = 'No countries found';
      }

      return;
    }

    const countries = results.map(mapCountryResponse);

    const cards = countries.map((country) => {
      const card = createCountryCard(country);

      card.addEventListener('click', () => {
        const details = createCountryDetails(country);

        document.body.append(details);

        details.addEventListener(
          'close',
          () => {
            details.remove();
          },
          { once: true },
        );

        details.showModal();
      });

      return card;
    });
    resultsContainer.replaceChildren(...cards);
  },

  onError: (error) => {
    const message = document.createElement('p');
    message.textContent = error instanceof Error ? error.message : 'Something went wrong';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.classList.add('button');
    retryButton.textContent = 'Retry';

    retryButton.addEventListener('click', () => {
      searchController.handleInput(currentQuery);
    });

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-container');

    errorContainer.append(message, retryButton);

    resultsContainer.replaceChildren(errorContainer);
  },

  delay: 300,
});

const search = createSearch((value) => {
  currentQuery = value;
  searchController.handleInput(value);
});

function showLoader(): void {
  resultsContainer.replaceChildren(createLoader());
}

document.body.append(search, resultsContainer);
