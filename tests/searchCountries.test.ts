import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { searchCountries } from '../src/api/searchCountries.js';

describe('searchCountries', () => {
  let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('должна возвращать данные при успешном ответе', async () => {
    const mockData = [{ name: 'France', cca3: 'FRA' }];

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(mockData), {
        status: 200,
      }),
    );

    const controller = new AbortController();

    const result = await searchCountries('france', controller.signal);

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('должна выбрасывать HttpError при ошибке сервера', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 500,
      }),
    );

    const controller = new AbortController();

    await expect(searchCountries('france', controller.signal)).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    });
  });

  test('должна возвращать пустой массив при статусе 404', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 404,
      }),
    );

    const controller = new AbortController();

    const result = await searchCountries('unknown', controller.signal);

    expect(result).toEqual([]);
  });

  test('должна передавать AbortError при отмене запроса', async () => {
    const abortError = new DOMException('Request aborted', 'AbortError');

    fetchMock.mockRejectedValue(abortError);

    const controller = new AbortController();

    await expect(searchCountries('france', controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
    });
  });

  test('должна передавать TimeoutError при превышении времени ожидания', async () => {
    const timeoutError = new DOMException('Request timed out', 'TimeoutError');

    fetchMock.mockRejectedValue(timeoutError);

    const controller = new AbortController();

    await expect(searchCountries('france', controller.signal)).rejects.toMatchObject({
      name: 'TimeoutError',
    });
  });

  test('должна отменять выполняющийся fetch при вызове abort()', async () => {
    const controller = new AbortController();

    fetchMock.mockImplementation((_input, init) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;

        if (!signal) {
          reject(new Error('AbortSignal was not provided'));
          return;
        }

        signal.addEventListener(
          'abort',
          () => {
            reject(new DOMException('Request aborted', 'AbortError'));
          },
          { once: true },
        );
      });
    });

    const request = searchCountries('france', controller.signal);

    controller.abort();

    await expect(request).rejects.toMatchObject({
      name: 'AbortError',
    });

    expect(controller.signal.aborted).toBe(true);
  });
});
