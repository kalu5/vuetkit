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

## Options

<table>
  <thead>
   <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>
 
  <tr>
    <td>manual</td>
    <td>boolean</td>
    <td>false</td>
    <td>
      Default auto call the request immediately after mounted. You can set it to `true` to manually execute the request.
    </td>
  </tr>
  <tr>
    <td>defaultParams</td>
    <td>any</td>
    <td>undefined</td>
    <td>
      <p>1. The request default params. </p>
      <p>2. You can also replace the default parameters by passing parameters when executing the execute function.</p>
      <p>3. If you pass params is obj in both the options and execute, we will merge them .</p>
    </td>
  </tr>

  <tr>
    <td>initialData</td>
    <td>T</td>
    <td>undefined</td>
    <td>
      The initial data to set.
    </td>
  </tr>

  <tr>
    <td>delayLoadingTime</td>
    <td>number</td>
    <td>300</td>
    <td>
      To optimize the user experience, the loading indicator will only be displayed if the request is not completed within 300 milliseconds after it starts. You can manually adjust this according to the specific situation.
    </td>
  </tr>
  <tr>
    <td>formatData</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      The function to format the data before setting it to the data ref.
    </td>
  </tr>
  <tr>
    <td>onSuccess</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      <p>1. The callback function to call when the request is successful. </p>
      <p>2. You can do other operations.</p>
    </td>
  </tr>
  <tr>
    <td>onError</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      <p>1. The callback function to call when the request fails. </p>
      <p>2. You can handle the error in the callback function.</p>
    </td>
  </tr>
  <tr>
    <td>onFinally</td>
    <td>function</td>
    <td>undefined</td>
    <td>
      The callback function to call when the request is completed. 
    </td>
  </tr>
  </tbody>
</table>

## Return Value

<table>
  <thead>
   <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>data</td>
    <td>T</td>
    <td>
      The request data.
    </td>
  </tr>
  <tr>
    <td>loading</td>
    <td>boolean</td>
    <td>
      The loading state.
    </td>
  </tr>
  <tr>
    <td>error</td>
    <td>Error</td>
    <td>
      The error state.
    </td>
  </tr>
  <tr>
    <td>execute</td>
    <td>function</td>
    <td>
      The function to execute the request manually.
    </td>
  </tr>
  <tr>
    <td>cancel</td>
    <td>function</td>
    <td>
      Call this function to discard the request data.
    </td>
  </tr>
  </tbody>
</table>

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
