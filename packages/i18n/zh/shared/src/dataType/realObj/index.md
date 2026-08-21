# realObj

检查变量是否为真实对象

## 基础用法

```ts
import { realObj } from '@vuecraft/shared'

// real object
realObj({}) // true

// not real object
realObj(null) // false
realObj(undefined) // false
realObj('hello') // false
realObj(123) // false
realObj([]) // false
realObj(() => { }) // false
realObj(new Date()) // false
realObj(Symbol('symbol')) // false
```
