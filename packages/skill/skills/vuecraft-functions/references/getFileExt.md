---
category: file
package: @vuecraft/shared
---

# getFileExt

Get file extension name by file name

## Params

| Name     | Description |
| -------- | ----------- |
| fileName | File name   |

## Returns

| Type   | Description         |
| ------ | ------------------- |
| string | File extension name |

## Basic Usage

```ts
import { getFileExt } from '@vuecraft/shared'

// get file extension name
getFileExt('fileName.txt') // 'txt'
```

## Type Declarations

```ts
export function getFileExt(fileName: string);
```
