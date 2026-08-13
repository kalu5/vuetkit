---
category: dataType
package: @vuetkit/shared
---

# getDataType

Get variable all data type

## Basic Usage

```ts
import { getDataType } from '@vuetkit/shared'

// null type
getDataType(null) // 'null'

// undefined type
getDataType(undefined) // 'undefined'

// number type
getDataType(123) // 'number'

// string type
getDataType('hello') // 'string'

// boolean type
getDataType(true) // 'boolean'

// symbol type
getDataType(Symbol('symbol')) // 'symbol'

// bigint type
getDataType(BigInt(123)) // 'bigint'

// object type
getDataType({}) // '[object Object]'

// function type
getDataType(() => { }) // 'function'

// array type
getDataType([]) // '[object Array]'

// date type
getDataType(new Date()) // '[object Date]'

// regexp type
getDataType(/hello/) // '[object RegExp]'

// map type
getDataType(new Map()) // '[object Map]'

// set type
getDataType(new Set()) // '[object Set]'

// weak map type
getDataType(new WeakMap()) // '[object WeakMap]'

// weak set type
getDataType(new WeakSet()) // '[object WeakSet]'

// promise type
getDataType(Promise.resolve()) // '[object Promise]'

// error type
getDataType(new Error('error')) // '[object Error]'

// class instance type
getDataType(new MyClass()) // '[object Object]'
```

## Type Declarations

```ts
export function getDataType<T>(val: T): string;
```
