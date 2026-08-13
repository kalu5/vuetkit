---
category: file
package: @vuetkit/shared
---

# getFileMediaTypes

Get commonly used file media types.

## Returns

Return media object. Description:

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

## Basic Usage

```ts
import { getFileMediaTypes } from '@vuetkit/shared'

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

## Type Declarations

```ts
export function getFileMediaTypes();
```
