---
category: network
package: @vuecraft/core
---

# useRequest

Auto call an asynchronous service to initiate a request and return the request result.

::: tip :zap:Feature

1. Handle errors uniformly.
2. Avoid race conditions.
3. Support delay loading.
4. Manage loading, data and error state.
   :::

## Basic Usage

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

## More Example

### Manual

By default, the request will be called immediately after mounted.
You can manually execute the request by setting `manual` to `true` and then call `execute` to trigger the request.

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

You can pass parameters to the request in the options or during manual execution.

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

### Initial Data

You can set the initial data to set the initial data to set.

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

### Delay Loading Time

To optimize the user experience, the loading indicator will only be displayed if the request is not completed within 300 milliseconds after it starts. You can manually adjust this according to the specific situation.

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

### Callbacks

You can pass callback functions to the options to be called when the request is successful, fails, or finishes.

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

### Manual Cancel Request

You can cancel the request manually by calling the `cancel` function.

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

## Declaration Types

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

> `useRequest<T, U = T>` — `T` is the type returned by the request or `formatData`; `U` is the raw type returned by the request service (defaults to `T`).

## Type Declarations

```ts
import type { Ref } from 'vue'

export interface RequestOptions<T, U> {
  // whether to execute the request immediately
  manual?: boolean
  // default params for the request
  defaultParams?: any
  // initial data for the request
  initialData?: T
  // delay loading time
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

export interface RequestReturn<T> {
  loading: Ref<boolean>
  data: Ref<T | null>
  error: Ref<unknown>
  // manual execute the request
  execute: (params?: any) => void
  // cancel the request
  cancel: () => void
}

export type RequestService<U> = (params?: any) => Promise<U>

export function useRequest<T, U = T>(
  service: RequestService<U>,
  options?: RequestOptions<T, U>,
): RequestReturn<T>;
```
