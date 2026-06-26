# useTable

Quickly create a table component.

- Please refer to ElementPlus for table configuration items. [Element Plus Table API](https://element-plus.org/en-US/component/table#table-api)

## Basic Usage

```vue
<script setup lang="ts">
import { useTable } from '@vuetkit/components'

interface User {
  name: string
  age: number
  gender: string
}

const [TableComp] = useTable<User>({
  columns: [
    {
      label: 'Name',
      prop: 'name',
    },
    {
      label: 'Age',
      prop: 'age',
    },
    {
      label: 'Gender',
      prop: 'gender',
    },
  ],
  data: [
    {
      name: 'John Doe',
      age: 30,
      gender: 'Male',
    },
    {
      name: 'Jane Doe',
      age: 25,
      gender: 'Female',
    },
  ],
})
</script>

<template>
  <TableComp />
</template>
```
