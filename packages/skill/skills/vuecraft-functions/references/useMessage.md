---
category: feedback
package: @vuecraft/components
---

# useMessage

Unified message prompt.

## Parameters

| Name    | Type           | Default | Description                                                                                                 |
| ------- | -------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| options | `MessageProps` | `{}`    | Message props. Reference [ElementPlus Message Props](https://element-plus.org/#/en/component/message#props) |

## Returns

| Name     | Type                       | Description          |
| -------- | -------------------------- | -------------------- |
| success  | `success(message: string)` | Show success message |
| error    | `error(message: string)`   | Show error message   |
| warning  | `warning(message: string)` | Show warning message |
| info     | `info(message: string)`    | Show info message    |
| closeAll | `closeAll()`               | Close all messages   |

## Basic Usage

```ts
import { useMessage } from '@vuecraft/components'

const { success, error, warning, info, closeAll } = useMessage()

success('Success message')
error('Error message')
warning('Warning message')
info('Info message')
closeAll()
```

## Custom Usage

```ts
import { useMessage } from '@vuecraft/components'

const { success, error, warning, info, closeAll } = useMessage({
  duration: 5000,
  showClose: false,
  plain: false,
  grouping: false,
})

success('Success message')
error('Error message')
warning('Warning message')
info('Info message')
closeAll()
```

## Type Declarations

```ts
import type { MessageProps, MessageType } from 'element-plus'

export function useMessage(options: MessageProps =;
```
