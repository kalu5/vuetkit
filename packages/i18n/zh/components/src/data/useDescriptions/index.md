# useDescriptions

快速为你的数据定义描述列表。

- 更多可配置选项请参考 [DescriptionsProps](https://element-plus.org/en-US/component/descriptions#descriptions-api)

## 基础用法

```vue
<script setup lang="ts">
import { useDescriptions } from '@vuecraft/components'

const [Descriptions] = useDescriptions({
  columns: [
    {
      label: 'Name',
      value: 'vuecraft',
    },
    {
      label: 'Age',
      value: '25',
    },
  ]
})
</script>

<template>
  <div>
    <Descriptions />
  </div>
</template>
```

## 自定义渲染项值

```vue
<script setup lang="ts">
import { useDescriptions } from '@vuecraft/components'

const [Descriptions] = useDescriptions({
  columns: [
    {
      label: 'Name',
      value: 'vuecraft',
    },
    {
      label: 'Age',
      render: (value: string) => {
        return value
      },
    },
  ]
})
</script>

<template>
  <div>
    <Descriptions />
  </div>
</template>
```
