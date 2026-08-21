# getFileMediaTypes

获取常用的文件媒体类型。

## 返回值

返回媒体类型对象。说明：

| Name | Description                                                               |
| ---- | ------------------------------------------------------------------------- |
| doc  | application/msword                                                        |
| docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document   |
| ppt  | application/vnd.ms-powerpoint                                             |
| pptx | application/vnd.openxmlformats-officedocument.presentationml.presentation |
| xls  | application/vnd.ms-excel                                                  |
| xlsx | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet         |
| pdf  | application/pdf                                                           |
| png  | image/png                                                                 |
| jpg  | image/jpeg                                                                |
| jpeg | image/jpeg                                                                |
| gif  | image/gif                                                                 |
| webp | image/webp                                                                |

## 基础用法

```ts
import { getFileMediaTypes } from '@vuecraft/shared'

// get file media types
/**
 * result
 * {
 *   doc: 'application/msword',
 *   docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 *   ppt: 'application/vnd.ms-powerpoint',
 *   pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
 *   xls: 'application/vnd.ms-excel',
 *   xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
 *   pdf: 'application/pdf',
 *   png: 'image/png',
 *   jpg: 'image/jpeg',
 *   jpeg: 'image/jpeg',
 *   gif: 'image/gif',
 *   webp: 'image/webp',
 * }
 */
getFileMediaTypes()
```
