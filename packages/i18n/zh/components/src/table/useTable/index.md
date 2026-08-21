# useTable

快速创建表格组件。

- 表格配置项请参考 ElementPlus。[Element Plus Table API](https://element-plus.org/en-US/component/table#table-api)

## 基础用法

```vue
<script setup lang="ts">
import { useTable } from '@vuecraft/components'

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
  <TableComp />
</template>
```

## 表格插槽

1. `#actions` 插槽：自定义操作列。
2. `header` 插槽：自定义表头行。
3. `#append` 插槽：在最后一行之后插入的内容。如果你想为表格实现无限滚动，可能需要此插槽。如果有汇总行，此插槽将显示在汇总行上方。
4. `#empty` 插槽：自定义数据为空时的内容。

```vue
<script setup lang="ts">
import { useTable } from '@vuecraft/components'

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
    <template #header>
      <p>User Table</p>
    </template>
    <template #append>
      <p>User Table Footer</p>
    </template>
    <template #empty>
      <p>No user data</p>
    </template>
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

## 异步请求表格数据

```vue
<script setup lang="ts">
import { useTable } from '@vuecraft/components'
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

function handleNextPage() {
  params.page++
}
</script>

<template>
  <TableComp />
  <el-button type="primary" size="mini" @click="handleNextPage">
    Next Page
  </el-button>
</template>
```

## 分页

- 分页配置项请参考 ElementPlus。[Element Plus Pagination API](https://element-plus.org/en-US/component/pagination#api)

::: danger

1. 请注意，当需要 paginationConfig 时，params 必须是一个对象。
2. 请注意，service 必须返回 Promise<{ data: T[], total: number }>。

:::

```vue
<script setup lang="ts">
import { useTable } from '@vuecraft/components'
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
  paginationConfig: true,
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
  ],
})
</script>

<template>
  <TableComp />
</template>
```

## 搜索表单

- 更多配置请参考 `useForm` 的 `FormOptions`

::: danger

请注意，当需要 searchFormConfig 时，params 必须是一个对象。

:::

```vue
<script setup lang="ts">
import { useTable } from '@vuecraft/components'
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
  paginationConfig: true,
  align: 'center',
  headerAlign: 'center',
  searchFormConfig: {
    schemas: [
      {
        label: 'Name',
        prop: 'name',
        component: 'el-input',
      },
      {
        label: 'Age',
        prop: 'age',
        component: 'el-input-number',
      },
    ],
  },
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
  ],
})
</script>

<template>
  <TableComp />
</template>
```

## 多级表头

```vue
<script setup lang="ts">
import { useTable } from '@vuecraft/components'

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
</script>

<template>
  <TableComp />
</template>
```

## 类型

```ts
type DefaultRow = Record<PropertyKey, any>

interface PaginationData<T> {
  data: T[]
  total: number
}

interface TableColumnOptions<T extends DefaultRow> extends TableColumnProps<T> {
  // Custom render
  render?: (row: T) => VNode | string
  // Add children columns
  children?: TableColumnOptions<T>[]
  // From TableColumnProps
  prop?: string
}

interface PaginationOptions extends PaginationProps {
  // Pagination wrap Style
  wrapStyle: CSSProperties
}

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
  // Pagination Config
  paginationConfig?: boolean | PaginationOptions
  // Table Wrap Style
  tableWrapStyle?: CSSProperties
  // Search Form Config
  searchFormConfig?: FormOptions<T>
}

type TableReturn = [
  // Use TableComp in template
  Component,
]
```
