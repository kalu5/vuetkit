# isFunc

Check variable is function

## Basic Usage

```ts
import { isFunc } from '@vuecraft/shared'

// is function
isFunc(() => { }) // true

// is not function
isFunc(null) // false
isFunc(undefined) // false
isFunc('hello') // false
isFunc(123) // false
isFunc(Symbol('symbol')) // false
isFunc({}) // false
isFunc([]) // false
isFunc(new Date()) // false
```
