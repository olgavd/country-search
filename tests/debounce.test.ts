import { afterEach, describe, expect, test, vi } from 'vitest';
import { debounce } from '../src/core/debounce.js';

describe('debounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('функция не должна вызываться мгновенно', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('функция вызывается только один раз после многократных вызовов', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback();
    vi.advanceTimersByTime(100);

    debouncedCallback();
    vi.advanceTimersByTime(100);

    debouncedCallback();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('должны использоваться аргументы из последнего вызова', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback('first');
    vi.advanceTimersByTime(100);

    debouncedCallback('second');

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });
});
