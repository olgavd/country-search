import { describe, expect, test } from 'vitest';
import { mapCountryResponse } from '../src/core/mapCountryResponse.js';

describe('mapCountryResponse', () => {
  test('должна преобразовывать данные страны в данные карточки', () => {
    const rawCountry = {
      name: 'France',
      flag: '🇫🇷',
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
      flag: '🇫🇷',
      capital: 'Paris',
      region: 'Europe',
      population: 68000000,
      languages: ['French'],
    });
  });

  test('должна преобразовывать несколько языков в массив названий', () => {
    const rawCountry = {
      name: 'Belgium',
      flag: '🇧🇪',
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
      flag: '🏳️',
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
      flag: '',
      capital: '',
      region: '',
      population: 0,
      languages: [],
    });
  });

  test('должна подставлять значения по умолчанию для полей неправильного типа', () => {
    const rawCountry = {
      name: 123,
      flag: null,
      capital: 456,
      region: false,
      population: '68000000',
      languages: 'French',
    };

    const result = mapCountryResponse(rawCountry);

    expect(result).toEqual({
      name: '',
      flag: '',
      capital: '',
      region: '',
      population: 0,
      languages: [],
    });
  });

  test('должна пропускать некорректные элементы массива языков', () => {
    const rawCountry = {
      name: 'Belgium',
      flag: '🇧🇪',
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
      flag: '',
      capital: '',
      region: '',
      population: 0,
      languages: [],
    });
  });
});
