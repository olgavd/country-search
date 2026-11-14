import { afterEach, describe, expect, test, vi } from 'vitest';
import { createSearchController } from '../src/app.js';

describe('createSearchController', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('должна запускать поиск только по последнему введённому значению', async () => {
    vi.useFakeTimers();

    const search = vi.fn().mockResolvedValue([]);

    const controller = createSearchController({
      search,
      onResults: vi.fn(),
      onError: vi.fn(),
      delay: 300,
    });

    controller.handleInput('fra');
    controller.handleInput('france');

    await vi.advanceTimersByTimeAsync(300);

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('france', expect.any(AbortSignal));
  });

  test('должна немедленно отменять предыдущий запрос при новом вводе', async () => {
    vi.useFakeTimers();

    const signals: AbortSignal[] = [];

    const search = vi.fn((_query: string, signal: AbortSignal): Promise<unknown[]> => {
      signals.push(signal);

      return new Promise((_resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => {
            reject(new DOMException('Request aborted', 'AbortError'));
          },
          { once: true },
        );
      });
    });

    const onError = vi.fn();

    const controller = createSearchController({
      search,
      onResults: vi.fn(),
      onError,
      delay: 300,
    });

    controller.handleInput('france');
    await vi.advanceTimersByTimeAsync(300);

    expect(search).toHaveBeenCalledTimes(1);
    expect(signals[0]?.aborted).toBe(false);

    controller.handleInput('franci');

    expect(signals[0]?.aborted).toBe(true);

    expect(search).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(300);

    expect(search).toHaveBeenCalledTimes(2);
    expect(signals[1]?.aborted).toBe(false);

    expect(onError).not.toHaveBeenCalled();
  });

  test('должна передавать TimeoutError в onError при превышении времени ожидания', async () => {
    vi.useFakeTimers();

    const timeoutController = new AbortController();

    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(timeoutController.signal);

    const search = vi.fn((_query: string, signal: AbortSignal): Promise<unknown[]> => {
      return new Promise((_resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => {
            reject(signal.reason);
          },
          { once: true },
        );
      });
    });

    const onError = vi.fn();

    const controller = createSearchController({
      search,
      onResults: vi.fn(),
      onError,
      delay: 300,
    });

    controller.handleInput('france');

    await vi.advanceTimersByTimeAsync(300);

    expect(search).toHaveBeenCalledTimes(1);

    timeoutController.abort(new DOMException('Request timed out', 'TimeoutError'));

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ name: 'TimeoutError' }));
    });
  });

  test('не должна запускать устаревший поиск после отмены предыдущего запроса', async () => {
    vi.useFakeTimers();

    const signals: AbortSignal[] = [];

    const search = vi.fn((_query: string, signal: AbortSignal): Promise<unknown[]> => {
      signals.push(signal);

      return new Promise((_resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => {
            reject(signal.reason);
          },
          { once: true },
        );
      });
    });

    const onError = vi.fn();

    const controller = createSearchController({
      search,
      onResults: vi.fn(),
      onError,
      delay: 300,
    });

    controller.handleInput('france');

    await vi.advanceTimersByTimeAsync(300);

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenLastCalledWith('france', expect.any(AbortSignal));

    controller.handleInput('franci');

    expect(signals[0]?.aborted).toBe(true);

    controller.handleInput('franc');

    await vi.advanceTimersByTimeAsync(299);

    expect(search).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);

    expect(search).toHaveBeenCalledTimes(2);
    expect(search).toHaveBeenLastCalledWith('franc', expect.any(AbortSignal));

    expect(search.mock.calls.map(([query]) => query)).toEqual(['france', 'franc']);

    expect(onError).not.toHaveBeenCalled();
  });
});
