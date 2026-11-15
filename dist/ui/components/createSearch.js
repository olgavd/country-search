export function createSearch(onSearch) {
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search');
    const searchLabel = document.createElement('label');
    searchLabel.htmlFor = 'country-search';
    searchLabel.textContent = 'Search for a country';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'country-search';
    searchInput.placeholder = 'Enter country name...';
    searchInput.addEventListener('input', (event) => {
        const input = event.currentTarget;
        const value = input.value;
        onSearch(value);
    });
    searchContainer.append(searchLabel, searchInput);
    return searchContainer;
}
//# sourceMappingURL=createSearch.js.map