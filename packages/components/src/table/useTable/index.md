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

## Async Request TableData

```vue
<script setup lang="ts">
import { useTable } from '@vuetkit/components'
import { reactive } from 'vue'

interface User {
  name: string
  age: number
  gender: string
}

interface RequestData extends User {
  page: number
  pageSize: number
}

function getUserList(requestParams: RequestData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            name: 'Tom',
            age: 18,
            gender: 'male',
          },
          {
            name: 'Lily',
            age: 20,
            gender: 'female',
          },
          {
            name: `${requestParams.name}:${requestParams.page}`,
            age: 22,
            gender: 'male',
          },
        ],
        total: 100,
      })
    }, 1000)
  })
}

const params = reactive({
  name: 'Tom',
  page: 1,
  pageSize: 10,
})

const [TableComp] = useTable<User>({
  service: getUserList,
  params,
  formatData: (res: { data: User[], total: number }) => {
    return res.data
  },
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

function handleNextPage() {
  params.page++
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
  <el-button type="primary" size="mini" @click="handleNextPage">
    Next Page
  </el-button>
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
interface TableOptions<T extends DefaultRow> extends TableProps<T> {
  // Columns
  columns: TableColumnOptions<T>[]
  // Service
  service?: RequestService
  // Service Params
  params?: MaybeRef<unknown> | unknown
  // Format Request Data
  formatData?: (res: unknown) => T[]
  // Align
  align?: 'left' | 'center' | 'right'
  // Header-Align
  headerAlign?: 'left' | 'center' | 'right'
}
```

## TableColumn Options Types

```ts
interface TableColumnOptions<T extends DefaultRow> extends TableColumnProps<T> {
  // Custom render
  render?: (row: T) => VNode | string
  // Add children columns
  children?: TableColumnOptions<T>[]
  // From TableColumnProps
  prop?: string
}
```
