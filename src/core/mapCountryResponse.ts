export interface CountryCard {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
  description: string;
  area: number;
  borders: string[];
  currencies: string[];
}

export function mapCountryResponse(raw: unknown): CountryCard {
  const defaultCountry: CountryCard = {
    name: '',
    flag: '',
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

  const country = raw as Record<string, unknown>;

  const name = typeof country.name === 'string' ? country.name : '';

  const flag = typeof country.flag === 'string' ? country.flag : '';

  const capital = typeof country.capital === 'string' ? country.capital : '';

  const region = typeof country.region === 'string' ? country.region : '';

  const population = typeof country.population === 'number' ? country.population : 0;

  const languages = Array.isArray(country.languages)
    ? country.languages
        .filter(
          (language): language is { name: string } =>
            typeof language === 'object' &&
            language !== null &&
            !Array.isArray(language) &&
            'name' in language &&
            typeof language.name === 'string' &&
            language.name.length > 0,
        )
        .map((language) => language.name)
    : [];

  const description = typeof country.description === 'string' ? country.description : '';
  const area = typeof country.area === 'number' ? country.area : 0;
  const borders = Array.isArray(country.borders)
    ? country.borders.filter((border): border is string => typeof border === 'string')
    : [];
  const currencies = Array.isArray(country.currencies)
    ? country.currencies
        .filter(
          (currency): currency is { name: string; symbol: string } =>
            typeof currency === 'object' &&
            currency !== null &&
            !Array.isArray(currency) &&
            'name' in currency &&
            typeof currency.name === 'string' &&
            'symbol' in currency &&
            typeof currency.symbol === 'string',
        )
        .map((currency) => `${currency.name} (${currency.symbol})`)
    : [];

  return {
    name,
    flag,
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
