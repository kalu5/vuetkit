import { getFileMediaTypes } from '../getFileMediaTypes'

export function getFileMediaTypeByExt(ext: string) {
  const mediaTypes = getFileMediaTypes()
  return mediaTypes[ext as keyof typeof mediaTypes] || ''
}
