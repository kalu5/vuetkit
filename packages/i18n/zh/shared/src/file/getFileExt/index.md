# getFileExt

通过文件名获取文件扩展名

## 参数

| 名称     | 描述   |
| -------- | ------ |
| fileName | 文件名 |

## 返回值

| 类型   | 描述       |
| ------ | ---------- |
| string | 文件扩展名 |

## 基础用法

```ts
import { getFileExt } from '@vuecraft/shared'

// get file extension name
getFileExt('fileName.txt') // 'txt'
```
