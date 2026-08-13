---
category: file
package: @vuetkit/shared
---

# downloadFile

Download a file by file blob and file name

## Params

| Name     | Description |
| -------- | ----------- |
| blob     | File Blob   |
| fileName | File name   |

## Basic Usage

```ts
import { downloadFile } from '@vuetkit/shared'

// download file
downloadFile(blob, 'fileName')
```

## Type Declarations

```ts
export function downloadFile(blob: Blob, fileName: string);
```
