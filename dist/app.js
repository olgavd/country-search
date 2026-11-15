import { debounce } from './core/debounce.js';
export function createSearchController(options) {
    let activeController = null;
    const executeSearch = async (query) => {
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
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            options.onError(error);
        }
        finally {
            if (activeController === controller) {
                activeController = null;
            }
        }
    };
    const debouncedSearch = debounce((query) => {
        void executeSearch(query);
    }, options.delay);
    return {
        handleInput(value) {
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
//# sourceMappingURL=app.js.map