# isObj

检查变量是否为对象

## 基础用法

```ts
import { isObj } from '@vuecraft/shared'

// is object
isObj({}) // true
isObj([]) // true
isObj(new Date()) // true

// is not object
isObj(() => { }) // false
isObj(null) // false
isObj(undefined) // false
isObj('hello') // false
isObj(123) // false
isObj(Symbol('symbol')) // false
```
