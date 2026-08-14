# useAsyncDownloadFile

- Async Download file by download service and file name.

::: tip :zap:Feature

Support download by search criteria or by selecting multiple columns.
:::

## Basic Usage

```vue
<script setup lang="ts">
import { useAsyncDownloadFile } from '@vuecraft/core'
import axios from 'axios'

function downloadService(params: any) {
  return axios.get('/api/download', { params })
}

const fileName = 'downloadTemplate'

const { loading, executeDownload, downloadColumns, changeDownloadColumns } = useAsyncDownloadFile(downloadService, fileName)

function handleDownload() {
  executeDownload({
    query: {
      name: 'test'
    }
  })
}
</script>

<template>
  <button :loading="loading" @click="handleDownload">
    Download
  </button>
</template>
```

## Download by selected columns

```vue
<script setup lang="ts">
import { useAsyncDownloadFile } from '@vuecraft/core'
import axios from 'axios'

function downloadService(params: any) {
  return axios.get('/api/download', { params })
}

const fileName = 'downloadTemplate'

const columns = ref([
  {
    label: 'Name',
    id: 1,
    selected: false,
  },
  {
    label: 'Age',
    id: 2,
    selected: false,
  },
])

const { loading, executeDownload, downloadColumns, changeDownloadColumns } = useAsyncDownloadFile(downloadService, fileName)

function handleDownload() {
  if (downloadColumns.value.length === 0) {
    return
  }
  executeDownload({
    query: {
      name: 'test',
      ids: downloadColumns.value
    }
  })
}

function handleSelectChange(columns: any[]) {
  const ids = columns.map(item => item.id)
  changeDownloadColumns(ids)
}
</script>

<template>
  <button :loading="loading" @click="handleDownload">
    Download
  </button>
  <table
    :columns="columns"
    @selectChange="handleSelectChange"
  />
</template>
```

## Declaration Types

```typescript
function useAsyncDownloadFile<T extends Blob>(
  downloadService: RequestService<T>,
  fileName: string,
): AsyncDownloadFileReturn
```

### AsyncDownloadFileReturn

```typescript
interface AsyncDownloadFileReturn {
  // download loading status
  loading: Ref<boolean>
  // execute download operation
  executeDownload: (params?: any) => void
  // download columns
  downloadColumns: Ref<number[]>
  // change download columns
  changeDownloadColumns: (columns: number[]) => void
}
```

> `RequestService` is re-exported from `useRequest`, see [useRequest](../network/useRequest/) for its declaration.
