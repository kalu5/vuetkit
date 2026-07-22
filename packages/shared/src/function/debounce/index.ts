export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  // cancel pending invocation
  cancel: () => void
}

/**
 * Creates a debounced function that delays invoking `fn` until after `wait`
 * milliseconds have elapsed since the last time it was invoked.
 * @param fn The function to debounce
 * @param wait The number of milliseconds to delay, default 300
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait = 300,
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this as any, args)
      timer = null
    }, wait)
  } as DebouncedFunction<T>

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced
}
