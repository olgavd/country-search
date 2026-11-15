export function mapCountryResponse(raw) {
    const defaultCountry = {
        name: '',
        flagImage: '',
        capital: '',
        region: '',
        population: 0,
        languages: [],
        description: '',
        area: 0,
        borders: [],
        currencies: [],
    };
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        return defaultCountry;
    }
    const country = raw;
    const name = typeof country.name === 'string' ? country.name : '';
    const flags = country.flags;
    const flagImage = typeof flags === 'object' &&
        flags !== null &&
        !Array.isArray(flags) &&
        'svg' in flags &&
        typeof flags.svg === 'string'
        ? flags.svg
        : '';
    const capital = typeof country.capital === 'string' ? country.capital : '';
    const region = typeof country.region === 'string' ? country.region : '';
    const population = typeof country.population === 'number' ? country.population : 0;
    const languages = Array.isArray(country.languages)
        ? country.languages
            .filter((language) => typeof language === 'object' &&
            language !== null &&
            !Array.isArray(language) &&
            'name' in language &&
            typeof language.name === 'string' &&
            language.name.length > 0)
            .map((language) => language.name)
        : [];
    const description = typeof country.description === 'string' ? country.description : '';
    const area = typeof country.area === 'number' ? country.area : 0;
    const borders = Array.isArray(country.borders)
        ? country.borders.filter((border) => typeof border === 'string')
        : [];
    const currencies = Array.isArray(country.currencies)
        ? country.currencies
            .filter((currency) => typeof currency === 'object' &&
            currency !== null &&
            !Array.isArray(currency) &&
            'name' in currency &&
            typeof currency.name === 'string' &&
            'symbol' in currency &&
            typeof currency.symbol === 'string')
            .map((currency) => `${currency.name} (${currency.symbol})`)
        : [];
    return {
        name,
        flagImage,
        capital,
        region,
        population,
        languages,
        description,
        area,
        borders,
        currencies,
    };
}
//# sourceMappingURL=mapCountryResponse.js.map