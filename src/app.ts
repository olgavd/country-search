import { debounce } from './core/debounce.js';

interface SearchControllerOptions<T> {
  search: (query: string, signal: AbortSignal) => Promise<T[]>;
  onResults: (results: T[]) => void;
  onError: (error: unknown) => void;
  delay: number;
}

interface SearchController {
  handleInput: (value: string) => void;
}

export function createSearchController<T>(options: SearchControllerOptions<T>): SearchController {
  let activeController: AbortController | null = null;

  const executeSearch = async (query: string): Promise<void> => {
    const controller = new AbortController();
    activeController = controller;

    try {
      const results = await options.search(query, controller.signal);

      if (!controller.signal.aborted) {
        options.onResults(results);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      options.onError(error);
    }
  };

  const debouncedSearch = debounce((query: string) => {
    void executeSearch(query);
  }, options.delay);

  return {
    handleInput(value: string): void {
      activeController?.abort();
      activeController = null;

      debouncedSearch(value);
    },
  };
}
