# debounce

创建一个防抖函数，该函数会延迟调用 `fn`，直到自上次调用后经过 `wait` 毫秒。

## 基础用法

```ts
import { debounce } from '@vuecraft/shared'

const debounced = debounce(() => {
  console.log('called')
}, 200)

// will not invoke immediately
debounced()

// invoke after 200ms
// multiple rapid calls only invoke once
```

## 取消

返回的函数具有一个 `cancel` 方法，用于清除待执行的调用。

```ts
import { debounce } from '@vuecraft/shared'

const debounced = debounce(() => {
  console.log('called')
}, 200)

debounced()
debounced.cancel() // pending invocation cleared
```

## 默认等待时间

当未提供 `wait` 时，默认为 `300` 毫秒。

```ts
import { debounce } from '@vuecraft/shared'

const debounced = debounce(() => {
  console.log('called')
})

debounced()
// invoke after 300ms
```
