# isArr

检查变量是否为数组

## 基础用法

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
