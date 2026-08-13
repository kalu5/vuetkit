# useNotification

Unified notification prompt.

## Parameters

| Name    | Type                  | Default | Description                                                                                                               |
| ------- | --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| options | `NotificationOptions` | `{}`    | Notification props. Reference [ElementPlus Notification Props](https://element-plus.org/en-US/component/notification#api) |

## Returns

| Name     | Type                                       | Description               |
| -------- | ------------------------------------------ | ------------------------- |
| primary  | `primary(message: string, title?: string)` | Show primary notification |
| success  | `success(message: string, title?: string)` | Show success notification |
| error    | `error(message: string, title?: string)`   | Show error notification   |
| warning  | `warning(message: string, title?: string)` | Show warning notification |
| info     | `info(message: string, title?: string)`    | Show info notification    |
| closeAll | `closeAll()`                               | Close all notifications   |

## Basic Usage

```ts
import { useNotification } from '@vuecraft/components'

const { primary, success, error, warning, info, closeAll } = useNotification()

primary('Primary message')
success('Success message')
error('Error message')
warning('Warning message')
info('Info message')
closeAll()
```

## With Title

```ts
import { useNotification } from '@vuecraft/components'

const { success } = useNotification()

success('Success message', 'Success Title')
```

## Custom Usage

```ts
import { useNotification } from '@vuecraft/components'

const { primary, success, error, warning, info, closeAll } = useNotification({
  duration: 5000,
  showClose: false,
  position: 'bottom-right',
  title: 'Default Title',
  onClick: () => {
    console.log('notification clicked')
  },
  onClose: () => {
    console.log('notification closed')
  },
})

success('Success message')
error('Error message', 'Error Title')
closeAll()
```
