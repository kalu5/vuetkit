# useMessage

统一的消息提示。

## 参数

| 名称    | 类型           | 默认值 | 描述                                                                                              |
| ------- | -------------- | ------ | ------------------------------------------------------------------------------------------------- |
| options | `MessageProps` | `{}`   | 消息属性。参考 [ElementPlus Message Props](https://element-plus.org/#/en/component/message#props) |

## 返回值

| 名称     | 类型                       | 描述         |
| -------- | -------------------------- | ------------ |
| success  | `success(message: string)` | 显示成功消息 |
| error    | `error(message: string)`   | 显示错误消息 |
| warning  | `warning(message: string)` | 显示警告消息 |
| info     | `info(message: string)`    | 显示信息消息 |
| closeAll | `closeAll()`               | 关闭所有消息 |

## 基础用法

```ts
import { useMessage } from '@vuecraft/components'

const { success, error, warning, info, closeAll } = useMessage()

success('Success message')
error('Error message')
warning('Warning message')
info('Info message')
closeAll()
```

## 自定义用法

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
