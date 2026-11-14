import { describe, expect, test } from 'vitest';
import { HttpError } from '../src/api/HttpError.js';

describe('HttpError', () => {
  test('должна быть экземпляром Error', () => {
    const error = new HttpError('Server error', 500);

    expect(error).toBeInstanceOf(Error);
  });

  test('должна иметь имя HttpError', () => {
    const error = new HttpError('Server error', 500);

    expect(error.name).toBe('HttpError');
  });

  test('должна сохранять HTTP-статус', () => {
    const error = new HttpError('Server error', 500);

    expect(error.status).toBe(500);
  });

  test('должна сохранять сообщение ошибки', () => {
    const error = new HttpError('Server error', 500);

    expect(error.message).toBe('Server error');
  });

  test('должна сохранять разные HTTP-статусы', () => {
    const error400 = new HttpError('Bad request', 400);
    const error503 = new HttpError('Service unavailable', 503);

    expect(error400.status).toBe(400);
    expect(error503.status).toBe(503);
  });
});
