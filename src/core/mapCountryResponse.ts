export interface CountryCard {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
}

export function mapCountryResponse(raw: unknown): CountryCard {
  const defaultCountry: CountryCard = {
    name: '',
    flag: '',
    capital: '',
    region: '',
    population: 0,
    languages: [],
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

  return {
    name,
    flag,
    capital,
    region,
    population,
    languages,
  };
}
