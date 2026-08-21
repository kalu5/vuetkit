# useTimeline

快速为你的数据定义时间线。

- 更多可配置选项请参考 [TimelineProps](https://element-plus.org/en-US/component/timeline#timeline-api)

## 基础用法

```vue
<script setup lang="ts">
import { useTimeline } from '@vuecraft/components'

const [Timeline] = useTimeline({
  columns: [
    {
      content: 'Event start',
      timestamp: '2018-04-15',
    },
    {
      content: 'Approved',
      timestamp: '2018-04-13',
    },
    {
      content: 'Success',
      timestamp: '2018-04-11',
    },
  ]
})
</script>

<template>
  <div>
    <Timeline />
  </div>
</template>
```

## 自定义渲染项内容

```vue
<script setup lang="ts">
import { useTimeline } from '@vuecraft/components'

const [Timeline] = useTimeline({
  columns: [
    {
      content: 'Event start',
      timestamp: '2018-04-15',
    },
    {
      content: 'Approved',
      timestamp: '2018-04-13',
      render: (content: string) => {
        return content
      },
    },
  ]
})
</script>

<template>
  <div>
    <Timeline />
  </div>
</template>
```
