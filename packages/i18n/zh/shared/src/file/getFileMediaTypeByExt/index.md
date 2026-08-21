# getFileMediaTypeByExt

通过文件扩展名获取文件媒体类型。

## 参数

| 名称 | 描述       |
| ---- | ---------- |
| ext  | 文件扩展名 |

## 返回值

| 名称      | 描述         |
| --------- | ------------ |
| mediaType | 文件媒体类型 |

## 基础用法

```ts
import { getFileMediaTypeByExt } from '@vuecraft/shared'

// get file media type by file extension name
getFileMediaTypeByExt('doc') // 'application/msword'
```
