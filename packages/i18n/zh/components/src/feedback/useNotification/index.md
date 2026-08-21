# useNotification

统一的通知提示。

## 参数

| 名称    | 类型                  | 默认值 | 描述                                                                                                       |
| ------- | --------------------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| options | `NotificationOptions` | `{}`   | 通知属性。参考 [ElementPlus Notification Props](https://element-plus.org/en-US/component/notification#api) |

## 返回值

| 名称     | 类型                                       | 描述         |
| -------- | ------------------------------------------ | ------------ |
| primary  | `primary(message: string, title?: string)` | 显示主要通知 |
| success  | `success(message: string, title?: string)` | 显示成功通知 |
| error    | `error(message: string, title?: string)`   | 显示错误通知 |
| warning  | `warning(message: string, title?: string)` | 显示警告通知 |
| info     | `info(message: string, title?: string)`    | 显示信息通知 |
| closeAll | `closeAll()`                               | 关闭所有通知 |

## 基础用法

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

## 带标题

```ts
import { useNotification } from '@vuecraft/components'

const { success } = useNotification()

success('Success message', 'Success Title')
```

## 自定义用法

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
