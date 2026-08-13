---
category: file
package: @vuetkit/shared
---

# getFileMediaTypeByExt

Get file media type by file extension name.

## Params

| Name | Description         |
| ---- | ------------------- |
| ext  | File extension name |

## Returns

| Name      | Description     |
| --------- | --------------- |
| mediaType | File media type |

## Basic Usage

```ts
import { getFileMediaTypeByExt } from '@vuetkit/shared'

// get file media type by file extension name
getFileMediaTypeByExt('doc') // 'application/msword'
```

## Type Declarations

```ts
export function getFileMediaTypeByExt(ext: string);
```
