import type { RequestService } from '../../network'
import { downloadFile } from '@vuetkit/shared'
import { ref } from 'vue'
import { useRequest } from '../../network'

export function useAsyncDownloadFile(downloadService: RequestService, fileName: string) {
  const downloadColumns = ref<number[]>([])
  const changeDownloadColumns = (ids: number[]) => {
    downloadColumns.value = ids
  }

  const { loading, execute: executeDownload } = useRequest<Blob>(downloadService, {
    manual: true,
    onSuccess: (data: Blob) => {
      downloadFile(data, fileName)
    },
  })

  return {
    downloadColumns,
    changeDownloadColumns,
    executeDownload,
    loading,
  }
}
