---
category: data
package: @vuecraft/components
---

# useCollapse

Quickly define collapse for your data.

- More configurable options refer to [CollapseProps](https://element-plus.org/en-US/component/collapse#collapse-attributes)

## Basic Usage

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

## Custom render item content

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

## Custom render item title

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

## Custom render item icon

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

## v-model Control

Control the active collapse items using v-model.

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

## Accordion

In accordion mode, only one panel can be expanded at once.

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

## Async Data

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

## Pass props to ElCollapse

Pass additional props to the underlying ElCollapse component.

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

## Declaration Types

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

## Type Declarations

```ts
import type { RequestService } from '@vuecraft/core'
import type { CollapseItemProps, CollapseModelValue, CollapseProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'

export interface CollapseColumn extends Partial<CollapseItemProps> {
  // @desc Title of the collapse item
  title?: string
  // @desc Unique name of the collapse item
  name?: string | number
  // @desc Render function of the collapse item content
  render?: (val: unknown) => VNode
  // @desc Render function of the collapse item title
  renderTitle?: (val: unknown) => VNode
  // @desc Render function of the collapse item icon
  renderIcon?: (val: unknown) => VNode
}

export interface CollapseOptions<T> extends Partial<CollapseProps> {
  // @desc Columns of the collapse
  columns: CollapseColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format collapse data
  formatData?: (data: T) => CollapseColumn[]
  // @desc Default active collapse item name(s)
  defaultActive?: CollapseModelValue
  // @desc Callback when active collapse changes
  onChange?: (activeNames: CollapseModelValue) => void
}

export type CollapseReturnType = [
  // @desc Collapse component
  Component,
  // @desc Active collapse ref, can be used to control active items externally
  Ref<CollapseModelValue>,
]

export function useCollapse<T>(options: CollapseOptions<T>): CollapseReturnType;
```
