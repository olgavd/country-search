export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  return (...args: T): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
