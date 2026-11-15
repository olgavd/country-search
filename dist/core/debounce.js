export function debounce(callback, delay) {
    let timerId;
    return (...args) => {
        if (timerId !== undefined) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}
//# sourceMappingURL=debounce.js.map