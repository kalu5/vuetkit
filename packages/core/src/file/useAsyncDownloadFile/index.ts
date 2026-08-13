import type { RequestService } from '../../network'
import { downloadFile } from '@vuecraft/shared'
import { ref } from 'vue'
import { useRequest } from '../../network'

export function useAsyncDownloadFile<T extends Blob>(downloadService: RequestService<T>, fileName: string) {
  const downloadColumns = ref<number[]>([])
  const changeDownloadColumns = (ids: number[]) => {
    downloadColumns.value = ids
  }

  const { loading, execute: executeDownload } = useRequest<T>(downloadService, {
    manual: true,
    onSuccess: (data: T) => {
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
