# useSteps

快速为你的导航定义步骤条。

- 更多可配置选项请参考 [StepsProps](https://element-plus.org/en-US/component/steps#steps-api)

## 基础用法

```vue
<script setup lang="ts">
import { useSteps } from '@vuecraft/components'

const [Steps] = useSteps({
  steps: [
    {
      title: 'Step 1',
      description: 'First step description',
    },
    {
      title: 'Step 2',
      description: 'Second step description',
    },
    {
      title: 'Step 3',
      description: 'Third step description',
    },
  ]
})
</script>

<template>
  <div>
    <Steps />
  </div>
</template>
```

## 自定义渲染步骤描述

```vue
<script setup lang="ts">
import { useSteps } from '@vuecraft/components'
import { h } from 'vue'

const [Steps] = useSteps({
  steps: [
    {
      title: 'Step 1',
      description: 'Pending',
    },
    {
      title: 'Step 2',
      description: 'Completed',
      render: (value: string) => {
        return h('span', { class: 'status-completed' }, value)
      },
    },
    {
      title: 'Step 3',
      description: 'Processing',
      render: (value: string) => {
        return h('span', { class: 'status-processing' }, value)
      },
    },
  ]
})
</script>

<template>
  <div>
    <Steps />
  </div>
</template>
```

## 自定义渲染步骤标题

```vue
<script setup lang="ts">
import { useSteps } from '@vuecraft/components'
import { h } from 'vue'

const [Steps] = useSteps({
  steps: [
    {
      title: 'Step 1',
      description: 'Description',
      renderTitle: (title: string) => {
        return h('span', { class: 'custom-title' }, `Custom: ${title}`)
      },
    },
  ]
})
</script>

<template>
  <div>
    <Steps />
  </div>
</template>
```

## v-model 控制

使用 v-model 控制激活的步骤。

```vue
<script setup lang="ts">
import { useSteps } from '@vuecraft/components'

const [Steps, active] = useSteps({
  steps: [
    { title: 'Step 1', description: 'First step' },
    { title: 'Step 2', description: 'Second step' },
    { title: 'Step 3', description: 'Third step' },
  ],
  defaultActive: 0,
})

function goNext() {
  if (active.value < 2) {
    active.value++
  }
}

function goPrev() {
  if (active.value > 0) {
    active.value--
  }
}
</script>

<template>
  <div>
    <Steps v-model="active" />
    <button @click="goPrev">
      Previous
    </button>
    <button @click="goNext">
      Next
    </button>
  </div>
</template>
```

## 自定义渲染步骤图标

```vue
<script setup lang="ts">
import { Check, Circle, Clock } from '@element-plus/icons-vue'
import { useSteps } from '@vuecraft/components'
import { h } from 'vue'

const [Steps] = useSteps({
  steps: [
    {
      title: 'Step 1',
      description: 'Completed',
      renderIcon: () => h(Check, { class: 'icon-completed' }),
    },
    {
      title: 'Step 2',
      description: 'Processing',
      renderIcon: () => h(Clock, { class: 'icon-processing' }),
    },
    {
      title: 'Step 3',
      description: 'Pending',
      renderIcon: () => h(Circle, { class: 'icon-pending' }),
    },
  ]
})
</script>

<template>
  <div>
    <Steps />
  </div>
</template>
```

## 异步数据

```vue
<script setup lang="ts">
import { useSteps } from '@vuecraft/components'

async function fetchSteps() {
  const res = await fetch('/api/steps')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    title: item.title,
    description: item.description,
    status: item.status,
  }))
}

const [Steps] = useSteps({
  steps: [],
  service: fetchSteps,
  formatData,
})
</script>

<template>
  <div>
    <Steps />
  </div>
</template>
```

## 传递 props 给 ElSteps

向底层的 ElSteps 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useSteps } from '@vuecraft/components'

const [Steps] = useSteps({
  steps: [
    { title: 'Step 1', description: 'Desc 1' },
    { title: 'Step 2', description: 'Desc 2' },
    { title: 'Step 3', description: 'Desc 3' },
  ],
  simple: true,
  space: '100px',
  alignCenter: true,
})
</script>

<template>
  <div>
    <Steps />
  </div>
</template>
```

## 类型声明

### StepsOptions

```typescript
interface StepsOptions<T> extends StepsProps {
  // Steps of the component
  steps: StepsColumn[]
  // Service for fetching async data
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format steps data
  formatData?: (data: T) => StepsColumn[]
  // Default active step index
  defaultActive?: number
}
```

### StepsColumn

```typescript
interface StepsColumn extends Partial<StepProps> {
  // Title of the step
  title?: string
  // Description of the step
  description?: string
  // Render function of the step description
  render?: (val: unknown) => VNode
  // Render function of the step title
  renderTitle?: (val: unknown) => VNode
  // Render function of the step icon
  renderIcon?: (val: unknown) => VNode
}
```

### StepsReturnType

```typescript
type StepsReturnType = [
  // Steps component
  Component,
  // Active step ref, can be used to control step externally
  Ref<number>,
]
```
