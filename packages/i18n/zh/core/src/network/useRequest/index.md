# useRequest

自动调用异步服务发起请求，并返回请求结果。

::: tip :zap:特性

1. 统一处理错误。
2. 避免竞态条件。
3. 支持延迟加载。
4. 管理 loading、data 和 error 状态。
   :::

## 基础用法

```ts
import { useRequest } from '@vuecraft/core'
import axios from 'axios'

interface BaseResponse {
  title: string
}

function asyncServices() {
  return axios.get('/api/base')
}

const { data, loading, error } = <BaseResponse>useRequest(asyncServices)
```

## 更多示例

### 手动执行

默认情况下，请求会在挂载后立即调用。
你可以将 `manual` 设置为 `true`，然后调用 `execute` 来手动触发请求。

```ts
import { useRequest } from '@vuecraft/core'
import axios from 'axios'
import { onMounted } from 'vue'

function asyncServices() {
  return axios.get('/api/base')
}

const { data, loading, error, execute } = useRequest(asyncServices, {
  manual: true,
})

onMounted(() => {
  execute()
})
```

### defaultParams

你可以在选项中或手动执行时向请求传递参数。

```ts
import { useRequest } from '@vuecraft/core'
import axios from 'axios'
import { onMounted } from 'vue'

function asyncServices() {
  return axios.get('/api/base')
}

const { data, loading, error, execute } = useRequest(asyncServices, {
  manual: true,
  defaultParams: {
    id: 123,
  },
})

onMounted(() => {
  execute()
  // or
  execute({ id: 456 })
})
```

### 初始数据

你可以设置初始数据。

```ts
import { useRequest } from '@vuecraft/core'

function asyncServices() {
  return axios.get('/api/base')
}

const { data, loading, error, execute } = useRequest(asyncServices, {
  initialData: [
    {
      id: 1,
      name: 'useRequest',
    }
  ],
})
```

### 延迟加载时间

为了优化用户体验，只有当请求在开始后 300 毫秒内未完成时，才会显示加载指示器。你可以根据具体场景手动调整此时间。

```ts
import { useRequest } from '@vuecraft/core'
import axios from 'axios'

function asyncServices() {
  return axios.get('/api/base')
}

const { data, loading, error } = useRequest(asyncServices, {
  delayLoadingTime: 400,
})
```

### 回调函数

你可以在选项中传入回调函数，在请求成功、失败或结束时被调用。

```ts
import { useRequest } from '@vuecraft/core'

function asyncServices() {
  return axios.get('/api/base')
}

const { data, loading, error, execute } = useRequest(asyncServices, {
  formatData: res => res.data,
  onSuccess: (res) => {
    console.log(res)
  },
  onError: (err) => {
    console.log(err)
  },
  onFinally: () => {
    console.log('finally')
  },
})
```

### 手动取消请求

你可以通过调用 `cancel` 函数手动取消请求。

```ts
import { useRequest } from '@vuecraft/core'

import axios from 'axios'

function asyncServices() {
  return axios.get('/api/base')
}

const { data, loading, error, execute, cancel } = useRequest(asyncServices, {
  manual: true,
})

onMounted(() => {
  execute()
  setTimeout(() => {
    cancel()
  }, 1000)
})
```

## 类型声明

### RequestOptions

```typescript
interface RequestOptions<T, U> {
  // whether to execute the request immediately (default: false)
  manual?: boolean
  // default params for the request
  defaultParams?: any
  // initial data for the request
  initialData?: T
  // delay loading time in ms (default: 300)
  delayLoadingTime?: number
  // format data before set to data ref
  formatData?: (data: U) => T
  // success callback
  onSuccess?: (data: T) => void
  // error callback
  onError?: (error: any) => void
  // finally callback
  onFinally?: () => void
}
```

### RequestReturn

```typescript
interface RequestReturn<T> {
  loading: Ref<boolean>
  data: Ref<T | null>
  error: Ref<unknown>
  // manual execute the request
  execute: (params?: any) => void
  // cancel the request
  cancel: () => void
}
```

### RequestService

```typescript
type RequestService<U> = (params?: any) => Promise<U>
```

> `useRequest<T, U = T>` — `T` 是请求返回的类型或 `formatData` 处理后的类型；`U` 是请求服务返回的原始类型（默认为 `T`）。
