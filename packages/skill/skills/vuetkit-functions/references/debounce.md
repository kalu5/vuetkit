---
category: function
package: @vuetkit/shared
---

# debounce

Creates a debounced function that delays invoking `fn` until after `wait` milliseconds have elapsed since the last time it was invoked.

## Basic Usage

```ts
import { debounce } from '@vuetkit/shared'

const debounced = debounce(() => {
  console.log('called')
}, 200)

// will not invoke immediately
debounced()

// invoke after 200ms
// multiple rapid calls only invoke once
```

## Cancel

The returned function has a `cancel` method to clear the pending invocation.

```ts
import { debounce } from '@vuetkit/shared'

const debounced = debounce(() => {
  console.log('called')
}, 200)

debounced()
debounced.cancel() // pending invocation cleared
```

## Default Wait

When `wait` is not provided, it defaults to `300` milliseconds.

```ts
import { debounce } from '@vuetkit/shared'

const debounced = debounce(() => {
  console.log('called')
})

debounced()
// invoke after 300ms
```

## Type Declarations

```ts
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  // cancel pending invocation
  cancel: () => void
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait = 300,
): DebouncedFunction<T>;
```
