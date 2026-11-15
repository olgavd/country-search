import { debounce } from './core/debounce.js';

interface SearchControllerOptions<T> {
  search: (query: string, signal: AbortSignal) => Promise<T[]>;
  onResults: (results: T[]) => void;
  onError: (error: unknown) => void;
  delay: number;
  timeoutMs?: number;
  onLoading?: () => void;
}

interface SearchController {
  handleInput: (value: string) => void;
}

export function createSearchController<T>(options: SearchControllerOptions<T>): SearchController {
  let activeController: AbortController | null = null;

  const executeSearch = async (query: string): Promise<void> => {
    const controller = new AbortController();
    activeController = controller;

    const timeoutSignal = AbortSignal.timeout(options.timeoutMs ?? 5000);

    const signal = AbortSignal.any([controller.signal, timeoutSignal]);

    try {
      options.onLoading?.();
      const results = await options.search(query, signal);

      if (!signal.aborted) {
        options.onResults(results);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      options.onError(error);
    } finally {
      if (activeController === controller) {
        activeController = null;
      }
    }
  };

  const debouncedSearch = debounce((query: string) => {
    void executeSearch(query);
  }, options.delay);

  return {
    handleInput(value: string): void {
      activeController?.abort();
      activeController = null;

      const query = value.trim();

      if (!query) {
        options.onResults([]);
        return;
      }

      debouncedSearch(query);
    },
  };
}
