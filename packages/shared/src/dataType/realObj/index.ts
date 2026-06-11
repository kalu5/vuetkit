import { getDataType } from '../getDataType'

// real object
export function realObj<T>(obj: T): boolean {
  return getDataType(obj) === '[object Object]'
}
