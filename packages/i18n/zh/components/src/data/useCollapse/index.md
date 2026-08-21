# useCollapse

快速为你的数据定义折叠面板。

- 更多可配置选项请参考 [CollapseProps](https://element-plus.org/en-US/component/collapse#collapse-attributes)

## 基础用法

```vue
<script setup lang="ts">
import { useCollapse } from '@vuecraft/components'

const [Collapse] = useCollapse({
  columns: [
    {
      title: 'Consistency',
      name: '1',
      content: 'Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to.',
    },
    {
      title: 'Feedback',
      name: '2',
      content: 'Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects.',
    },
  ],
})
</script>

<template>
  <div>
    <Collapse />
  </div>
</template>
```

## 自定义渲染项内容

```vue
<script setup lang="ts">
import { useCollapse } from '@vuecraft/components'
import { h } from 'vue'

const [Collapse] = useCollapse({
  columns: [
    {
      title: 'Consistency',
      name: '1',
      render: () => h('div', { class: 'custom-content' }, 'Custom content'),
    },
  ],
})
</script>

<template>
  <div>
    <Collapse />
  </div>
</template>
```

## 自定义渲染项标题

```vue
<script setup lang="ts">
import { useCollapse } from '@vuecraft/components'
import { h } from 'vue'

const [Collapse] = useCollapse({
  columns: [
    {
      title: 'Consistency',
      name: '1',
      renderTitle: (title: string) => {
        return h('span', { class: 'custom-title' }, `Custom: ${title}`)
      },
    },
  ],
})
</script>

<template>
  <div>
    <Collapse />
  </div>
</template>
```

## 自定义渲染项图标

```vue
<script setup lang="ts">
import { CaretRight } from '@element-plus/icons-vue'
import { useCollapse } from '@vuecraft/components'
import { h } from 'vue'

const [Collapse] = useCollapse({
  columns: [
    {
      title: 'Consistency',
      name: '1',
      renderIcon: () => h(CaretRight, { class: 'custom-icon' }),
    },
  ],
})
</script>

<template>
  <div>
    <Collapse />
  </div>
</template>
```

## v-model 控制

使用 v-model 控制激活的折叠面板项。

```vue
<script setup lang="ts">
import { useCollapse } from '@vuecraft/components'

const [Collapse, activeNames] = useCollapse({
  columns: [
    { title: 'Consistency', name: '1' },
    { title: 'Feedback', name: '2' },
    { title: 'Efficiency', name: '3' },
  ],
  defaultActive: ['1'],
})

function toggleSecond() {
  const names = Array.isArray(activeNames.value) ? activeNames.value : []
  if (names.includes('2')) {
    activeNames.value = names.filter(n => n !== '2')
  }
  else {
    activeNames.value = [...names, '2']
  }
}
</script>

<template>
  <div>
    <Collapse v-model="activeNames" />
    <button @click="toggleSecond">
      Toggle Feedback
    </button>
  </div>
</template>
```

## 手风琴模式

在手风琴模式下，每次只能展开一个面板。

```vue
<script setup lang="ts">
import { useCollapse } from '@vuecraft/components'

const [Collapse] = useCollapse({
  columns: [
    { title: 'Consistency', name: '1' },
    { title: 'Feedback', name: '2' },
    { title: 'Efficiency', name: '3' },
  ],
  accordion: true,
  defaultActive: '1',
})
</script>

<template>
  <div>
    <Collapse />
  </div>
</template>
```

## 异步数据

```vue
<script setup lang="ts">
import { useCollapse } from '@vuecraft/components'

async function fetchCollapse() {
  const res = await fetch('/api/collapse')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    title: item.title,
    name: item.name,
    render: () => h('div', item.content),
  }))
}

const [Collapse] = useCollapse({
  columns: [],
  service: fetchCollapse,
  formatData,
})
</script>

<template>
  <div>
    <Collapse />
  </div>
</template>
```

## 传递 props 给 ElCollapse

向底层的 ElCollapse 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useCollapse } from '@vuecraft/components'

const [Collapse] = useCollapse({
  columns: [
    { title: 'Consistency', name: '1' },
    { title: 'Feedback', name: '2' },
  ],
  accordion: false,
  expandIconPosition: 'right',
})
</script>

<template>
  <div>
    <Collapse />
  </div>
</template>
```

## 类型声明

### CollapseOptions

```typescript
interface CollapseOptions<T> extends Partial<CollapseProps> {
  // Columns of the collapse
  columns: CollapseColumn[]
  // Service for fetching async data
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format collapse data
  formatData?: (data: T) => CollapseColumn[]
  // Default active collapse item name(s)
  defaultActive?: CollapseModelValue
  // Callback when active collapse changes
  onChange?: (activeNames: CollapseModelValue) => void
}
```

### CollapseColumn

```typescript
interface CollapseColumn extends Partial<CollapseItemProps> {
  // Title of the collapse item
  title?: string
  // Unique name of the collapse item
  name?: string | number
  // Render function of the collapse item content
  render?: (val: unknown) => VNode
  // Render function of the collapse item title
  renderTitle?: (val: unknown) => VNode
  // Render function of the collapse item icon
  renderIcon?: (val: unknown) => VNode
}
```

### CollapseReturnType

```typescript
type CollapseReturnType = [
  // Collapse component
  Component,
  // Active collapse ref, can be used to control active items externally
  Ref<CollapseModelValue>,
]
```
