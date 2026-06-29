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
  align: 'center',
  headerAlign: 'center',
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

function handleEdit(row: User) {
  console.log('Edit', row)
}

function handleDelete(row: User) {
  console.log('Delete', row)
}
</script>

<template>
  <TableComp>
    <template #actions>
      <ElTableColumn label="Actions" width="100">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            Delete
          </el-button>
        </template>
      </ElTableColumn>
    </template>
  </TableComp>
</template>
```

## Multi-Level Table Header

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
      children: [
        {
          label: 'First Name',
          prop: 'firstName',
          children: [
            {
              label: 'Child Name',
              prop: 'childName',
            }
          ]
        }
      ]
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

function handleEdit(row: User) {
  console.log('Edit', row)
}

function handleDelete(row: User) {
  console.log('Delete', row)
}
</script>

<template>
  <TableComp>
    <template #actions>
      <ElTableColumn label="Actions" width="100">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            Delete
          </el-button>
        </template>
      </ElTableColumn>
    </template>
  </TableComp>
</template>
```

## Table Options Types

```ts
export interface TableOptions<T extends DefaultRow> extends TableProps<T> {
  // Columns
  columns: TableColumnOptions<T>[]
  // Align
  align?: 'left' | 'center' | 'right'
  // Header-Align
  headerAlign?: 'left' | 'center' | 'right'
}
```

## TableColumn Options Types

```ts
export interface TableColumnOptions<T extends DefaultRow> extends TableColumnProps<T> {
  // Custom render
  render?: (row: T) => VNode | string
  // Add children columns
  children?: TableColumnOptions<T>[]
  // From TableColumnProps
  prop?: string
}
```
