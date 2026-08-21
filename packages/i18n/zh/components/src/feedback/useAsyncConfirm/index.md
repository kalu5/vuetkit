# useAsyncConfirm

统一的异步确认钩子。

## 参数

| 名称           | 类型                  | 描述           |
| -------------- | --------------------- | -------------- |
| confirmService | `function`            | 异步确认服务。 |
| options        | `AsyncConfirmOptions` | 确认选项。     |

### AsyncConfirmOptions

| 名称              | 类型                       | 默认值         | 描述                                                                     |
| ----------------- | -------------------------- | -------------- | ------------------------------------------------------------------------ |
| title             | `string`                   | `Confirm`      | 确认对话框的标题。                                                       |
| message           | `string`                   | `Sure Confirm` | 确认对话框的消息。                                                       |
| type              | `MessageType`              | `error`        | 确认对话框的类型（`"primary"、"success"、"info"、"warning"、"error"`）。 |
| confirmButtonText | `string`                   | `Sure`         | 确认按钮的文本。                                                         |
| cancelButtonText  | `string`                   | `Cancel`       | 取消按钮的文本。                                                         |
| successMessage    | `string`                   | `undefined`    | 异步确认成功后显示的成功消息。                                           |
| errorMessage      | `string`                   | `undefined`    | 异步确认失败后显示的错误消息。                                           |
| confirmSuccess    | `() => void`               | `undefined`    | 确认成功时的回调函数。                                                   |
| confirmError      | `(error: unknown) => void` | `undefined`    | 确认失败时的回调函数。                                                   |

## 返回值

| 名称    | 类型                        | 描述                                       |
| ------- | --------------------------- | ------------------------------------------ |
| confirm | `confirm(params?: unknown)` | 确认函数。params 会传递给 confirmService。 |
| loading | `Ref<boolean>`              | 加载状态                                   |

## 基础用法

```vue
<script setup lang="ts">
import { useAsyncConfirm } from '@vuecraft/components'
import axios from 'axios'

async function deleteItem() {
  return await axios.delete('/api/items/1')
}

const { confirm, loading } = useAsyncConfirm(deleteItem, {
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  type: 'error',
  successMessage: 'Deleted successfully',
})
</script>

<template>
  <button :loading="loading" @click="confirm()">
    {{ loading ? 'Loading...' : 'Delete' }}
  </button>
</template>
```
