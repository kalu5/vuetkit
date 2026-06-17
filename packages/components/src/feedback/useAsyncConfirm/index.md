# useAsyncConfirm

Unified async confirm hook.

## Parameters

| Name           | Type                  | Description            |
| -------------- | --------------------- | ---------------------- |
| confirmService | `function`            | Async confirm service. |
| options        | `AsyncConfirmOptions` | Confirm options.       |

### AsyncConfirmOptions

| Name              | Type                       | Default        | Description                                                                     |
| ----------------- | -------------------------- | -------------- | ------------------------------------------------------------------------------- |
| title             | `string`                   | `Confirm`      | Title of the confirm dialog.                                                    |
| message           | `string`                   | `Sure Confirm` | Message of the confirm dialog.                                                  |
| type              | `MessageType`              | `error`        | Type of the confirm dialog(`"primary"、"success"、"info"、"warning"、"error"`). |
| confirmButtonText | `string`                   | `Sure`         | Text of the confirm button.                                                     |
| cancelButtonText  | `string`                   | `Cancel`       | Text of the cancel button.                                                      |
| successMessage    | `string`                   | `undefined`    | Success message to show after async confirm success.                            |
| errorMessage      | `string`                   | `undefined`    | Error message to show after async confirm error.                                |
| confirmSuccess    | `() => void`               | `undefined`    | Callback function when confirm is success.                                      |
| confirmError      | `(error: unknown) => void` | `undefined`    | Callback function when confirm is failed.                                       |

## Returns

| Name    | Type                        | Description                                           |
| ------- | --------------------------- | ----------------------------------------------------- |
| confirm | `confirm(params?: unknown)` | Confirm function. params is passed to confirmService. |
| loading | `Ref<boolean>`              | Loading state                                         |

## Basic Usage

```vue
<script setup lang="ts">
import { useAsyncConfirm } from '@vuetkit/components'
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
