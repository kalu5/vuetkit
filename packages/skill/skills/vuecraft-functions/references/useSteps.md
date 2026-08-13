---
category: navigation
package: @vuecraft/components
---

# useSteps

Quickly define steps for your navigation.

- More configurable options refer to [StepsProps](https://element-plus.org/en-US/component/steps#steps-api)

## Basic Usage

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

## Custom render step description

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

## Custom render step title

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

## v-model Control

Control the active step using v-model.

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

## Custom render step icon

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

## Async Data

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

## Pass props to ElSteps

Pass additional props to the underlying ElSteps component.

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

## Declaration Types

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

## Type Declarations

```ts
import type { RequestService } from '@vuecraft/core'
import type { StepProps, StepsProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'

export interface StepsColumn extends Partial<StepProps> {
  // @desc Title of the step
  title?: string
  // @desc Description of the step
  description?: string
  // @desc Render function of the step description
  render?: (val: unknown) => VNode
  // @desc Render function of the step title
  renderTitle?: (val: unknown) => VNode
  // @desc Render function of the step icon
  renderIcon?: (val: unknown) => VNode
}

export interface StepsOptions<T> extends StepsProps {
  // @desc Steps of the component
  steps: StepsColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format steps data
  formatData?: (data: T) => StepsColumn[]
  // @desc Default active step index
  defaultActive?: number
}

export type StepsReturnType = [
  // @desc Steps component
  Component,
  // @desc Active step ref, can be used to control step externally
  Ref<number>,
]

export function useSteps<T>(options: StepsOptions<T>);
```
