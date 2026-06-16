# useAsyncDownloadFile

- Async Download file by download service and file name.

::: tip :zap:Feature

Support download by search criteria or by selecting multiple columns.
:::

## Parameters

| Parameter       | Type     | Description              |
| --------------- | -------- | ------------------------ |
| downloadService | function | Async download function. |
| fileName        | string   | File name.               |

## Returns

| Return                | Type                        | Description                 |
| --------------------- | --------------------------- | --------------------------- |
| loading               | Ref<boolean>                | Download loading status.    |
| executeDownload       | (params: any) => void       | Execute download operation. |
| downloadColumns       | Ref<number[]>               | Download columns.           |
| changeDownloadColumns | (columns: number[]) => void | Change download columns.    |

## Basic Usage

```vue
<script setup lang="ts">
import { useAsyncDownloadFile } from '@vuetkit/core'
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
import { useAsyncDownloadFile } from '@vuetkit/core'
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
