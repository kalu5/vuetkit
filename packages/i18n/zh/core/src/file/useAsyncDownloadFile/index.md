# useAsyncDownloadFile

- 通过下载服务和文件名异步下载文件。

::: tip :zap:特性

支持按搜索条件或选择多列进行下载。
:::

## 基础用法

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

## 按选中列下载

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

## 类型声明

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

> `RequestService` 从 `useRequest` 重新导出，其类型声明请参见 [useRequest](../../network/useRequest/)。
