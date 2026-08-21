# useSegmented

快速为你的数据定义分段控制器。

- 更多可配置选项请参考 [SegmentedProps](https://element-plus.org/en-US/component/segmented#api)

## 基础用法

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

const [Segmented] = useSegmented({
  defaultValue: 'Mon',
  columns: [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
    { label: 'Wed', value: 'Wed' },
    { label: 'Thu', value: 'Thu' },
    { label: 'Fri', value: 'Fri' },
    { label: 'Sat', value: 'Sat' },
    { label: 'Sun', value: 'Sun' },
  ],
})
</script>

<template>
  <div>
    <Segmented />
  </div>
</template>
```

## 自定义渲染项内容

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'
import { h } from 'vue'

const [Segmented] = useSegmented({
  defaultValue: 'Apple',
  columns: [
    {
      label: 'Apple',
      value: 'Apple',
      render: item => h('span', { class: 'custom-content' }, `Custom: ${item.label}`),
    },
    { label: 'Cherry', value: 'Cherry' },
    { label: 'Grape', value: 'Grape' },
  ],
})
</script>

<template>
  <div>
    <Segmented />
  </div>
</template>
```

## 自定义默认插槽

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

const [Segmented] = useSegmented({
  defaultValue: 'Mon',
  columns: [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
  ],
})
</script>

<template>
  <div>
    <Segmented>
      <template #default="{ item }">
        <span class="custom-slot">{{ item.label }}</span>
      </template>
    </Segmented>
  </div>
</template>
```

## v-model 控制

使用 v-model 控制选中的值。

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

const [Segmented, value] = useSegmented({
  defaultValue: 'Mon',
  columns: [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
    { label: 'Wed', value: 'Wed' },
  ],
})

function selectWed() {
  value.value = 'Wed'
}
</script>

<template>
  <div>
    <Segmented v-model="value" />
    <p>Current value: {{ value }}</p>
    <button @click="selectWed">
      Select Wed
    </button>
  </div>
</template>
```

## 禁用

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

const [Segmented] = useSegmented({
  defaultValue: 'Mon',
  disabled: true,
  columns: [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
  ],
})
</script>

<template>
  <div>
    <Segmented />
  </div>
</template>
```

## 块级宽度

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

const [Segmented] = useSegmented({
  defaultValue: 'Mon',
  block: true,
  columns: [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
  ],
})
</script>

<template>
  <div>
    <Segmented />
  </div>
</template>
```

## 方向

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

const [Segmented] = useSegmented({
  defaultValue: 'Mon',
  direction: 'vertical',
  columns: [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
  ],
})
</script>

<template>
  <div>
    <Segmented />
  </div>
</template>
```

## 异步数据

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

async function fetchSegmented() {
  const res = await fetch('/api/segmented')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    label: item.label,
    value: item.value,
  }))
}

const [Segmented] = useSegmented({
  columns: [],
  service: fetchSegmented,
  formatData,
})
</script>

<template>
  <div>
    <Segmented />
  </div>
</template>
```

## 传递 props 给 ElSegmented

向底层的 ElSegmented 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useSegmented } from '@vuecraft/components'

const [Segmented] = useSegmented({
  defaultValue: 'Mon',
  columns: [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
  ],
  size: 'large',
  block: true,
  direction: 'horizontal',
})
</script>

<template>
  <div>
    <Segmented />
  </div>
</template>
```

## 类型声明

### SegmentedOptions

```typescript
interface SegmentedOptions<T> extends Partial<SegmentedProps> {
  // Columns of the segmented
  columns?: SegmentedColumn[]
  // Service for fetching async data
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format segmented data
  formatData?: (data: T) => SegmentedColumn[]
  // Default value of the segmented
  defaultValue?: SegmentedOptionValue
  // Callback when value changes
  onChange?: (val: SegmentedOptionValue) => void
}
```

### SegmentedColumn

```typescript
interface SegmentedColumn {
  // Value of the option
  value?: SegmentedOptionValue
  // Label of the option
  label?: string
  // Whether the option is disabled
  disabled?: boolean
  // Render function of the option content
  render?: (item: SegmentedColumn) => VNode
}
```

### SegmentedReturnType

```typescript
type SegmentedReturnType = [
  // Segmented component
  Component,
  // Value ref, can be used to control value externally
  Ref<SegmentedOptionValue | undefined>,
]
```
