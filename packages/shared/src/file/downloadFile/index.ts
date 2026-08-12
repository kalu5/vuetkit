import { getFileExt } from '../getFileExt'
import { getFileMediaTypeByExt } from '../getFileMediaTypeByExt'

// Download a file by blob and fileName
export function downloadFile(blob: Blob, fileName: string) {
  if (!blob || !fileName || blob.size === 0)
    return

  let elink: HTMLAnchorElement | null = document.createElement('a')
  elink.download = fileName

  // use original blob type if it's not empty, otherwise infer from file name
  let curMimeType = blob.type
  if (!curMimeType) {
    const ext = getFileExt(fileName).slice(1)
    curMimeType = getFileMediaTypeByExt(ext)
  }

  // create new blob if type is different from original blob
  const blobToDownload = curMimeType && curMimeType !== blob.type
    ? new Blob([blob], { type: curMimeType })
    : blob

  const url = URL.createObjectURL(blobToDownload)

  try {
    elink.href = url
    document.body.appendChild(elink)
    elink.click()
  }
  catch (error) {
    console.error('Download file failed:', error)
  }
  finally {
    URL.revokeObjectURL(url)
    if (elink) {
      document.body.removeChild(elink)
      elink = null
    }
  }
}
