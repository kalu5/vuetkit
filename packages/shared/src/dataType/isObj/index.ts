// is object
export function isObj<T>(obj: T): boolean {
  return typeof obj === 'object' && obj !== null
}
