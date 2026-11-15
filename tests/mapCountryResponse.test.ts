import { describe, expect, test } from 'vitest';
import { mapCountryResponse } from '../src/core/mapCountryResponse.js';

describe('mapCountryResponse', () => {
  test('должна преобразовывать данные страны в данные карточки', () => {
    const rawCountry = {
      name: 'France',
      flags: {
        svg: 'https://flagcdn.com/fr.svg',
      },
      capital: 'Paris',
      region: 'Europe',
      population: 68000000,
      languages: [
        {
          iso639_1: 'fr',
          name: 'French',
          nativeName: 'Français',
        },
      ],
    };

    const result = mapCountryResponse(rawCountry);

    expect(result).toEqual({
      name: 'France',
      flagImage: 'https://flagcdn.com/fr.svg',
      capital: 'Paris',
      region: 'Europe',
      population: 68000000,
      languages: ['French'],
      description: '',
      area: 0,
      borders: [],
      currencies: [],
    });
  });

  test('должна преобразовывать несколько языков в массив названий', () => {
    const rawCountry = {
      name: 'Belgium',
      flags: {
        svg: 'https://flagcdn.com/be.svg',
      },
      capital: 'Brussels',
      region: 'Europe',
      population: 11500000,
      languages: [{ name: 'Dutch' }, { name: 'French' }, { name: 'German' }],
    };

    const result = mapCountryResponse(rawCountry);

    expect(result.languages).toEqual(['Dutch', 'French', 'German']);
  });

  test('должна возвращать пустой массив, если языков нет', () => {
    const rawCountry = {
      name: 'Country',
      flags: {
        svg: 'https://flagcdn.com/un.svg',
      },
      capital: '',
      region: 'Unknown',
      population: 0,
      languages: [],
    };

    const result = mapCountryResponse(rawCountry);

    expect(result.languages).toEqual([]);
  });

  test('должна подставлять значения по умолчанию для отсутствующих полей', () => {
    const rawCountry = {
      name: 'France',
    };

    const result = mapCountryResponse(rawCountry);

    expect(result).toEqual({
      name: 'France',
      flagImage: '',
      capital: '',
      region: '',
      population: 0,
      languages: [],
      description: '',
      area: 0,
      borders: [],
      currencies: [],
    });
  });

  test('должна подставлять значения по умолчанию для полей неправильного типа', () => {
    const rawCountry = {
      name: 123,
      flags: {
        svg: 123,
      },
      capital: 456,
      region: false,
      population: '68000000',
      languages: 'French',
    };

    const result = mapCountryResponse(rawCountry);

    expect(result).toEqual({
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
    });
  });

  test('должна пропускать некорректные элементы массива языков', () => {
    const rawCountry = {
      name: 'Belgium',
      flags: {
        svg: 'https://flagcdn.com/be.svg',
      },
      capital: 'Brussels',
      region: 'Europe',
      population: 11500000,
      languages: [{ name: 'Dutch' }, { name: 123 }, { name: '' }, null, { name: 'French' }],
    };

    const result = mapCountryResponse(rawCountry);

    expect(result.languages).toEqual(['Dutch', 'French']);
  });

  test('должна возвращать значения по умолчанию при null вместо объекта', () => {
    const result = mapCountryResponse(null);

    expect(result).toEqual({
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
    });
  });

  test('должна преобразовывать дополнительные данные страны', () => {
    const rawCountry = {
      name: 'France',
      flags: {
        svg: 'https://flagcdn.com/fr.svg',
      },
      capital: 'Paris',
      region: 'Europe',
      population: 67391582,
      languages: [{ name: 'French' }],
      area: 640679,
      borders: ['AND', 'BEL', 'DEU', 'ITA'],
      currencies: [
        {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
        },
      ],
    };

    const result = mapCountryResponse(rawCountry);

    expect(result).toEqual({
      name: 'France',
      flagImage: 'https://flagcdn.com/fr.svg',
      capital: 'Paris',
      region: 'Europe',
      population: 67391582,
      languages: ['French'],
      description: '',
      area: 640679,
      borders: ['AND', 'BEL', 'DEU', 'ITA'],
      currencies: ['Euro (€)'],
    });
  });
});
