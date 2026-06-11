import { isObj } from '../isObj'

export function getDataType<T>(val: T): string {
  if (val === null)
    return 'null'
  if (val === undefined)
    return 'undefined'

  // base type
  if (!isObj(val))
    return typeof val

  // object type
  return Object.prototype.toString.call(val)
}
