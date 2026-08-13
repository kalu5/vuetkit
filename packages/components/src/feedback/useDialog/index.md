# useDialog

Quick create dialog component.

## Basic Usage

```vue
<script setup lang="ts">
import { useDialog } from '@vuecraft/components'

const [Dialog, { open, close }] = useDialog({
  title: 'Dialog Title',
})
</script>

<template>
  <Dialog>
    <p>Dialog Content</p>
    <template #footer>
      <div>
        <button @click="close">
          Close
        </button>
      </div>
    </template>
  </Dialog>
  <button @click="open">
    Open Dialog
  </button>
</template>
```
