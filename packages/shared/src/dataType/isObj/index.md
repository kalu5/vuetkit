# isObj

Check variable is object

## Basic Usage

```ts
import { isObj } from '@vuetkit/shared'

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
