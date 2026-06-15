export function getFileExt(fileName: string) {
  return fileName.split('.')?.pop()?.toLowerCase() || ''
}
