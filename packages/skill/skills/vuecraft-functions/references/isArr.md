---
category: dataType
package: @vuecraft/shared
---

# isArr

Check variable is array

## Basic Usage

```ts
import { isArr } from '@vuecraft/shared'

// is array
isArr([]) // true

// is not array
isArr(null) // false
isArr(undefined) // false
isArr('hello') // false
isArr(123) // false
isArr({}) // false
isArr(() => { }) // false
isArr(Symbol('symbol')) // false
isArr(new Date()) // false
```

## Type Declarations

```ts
export function isArr<T>(val: T): boolean;
```
