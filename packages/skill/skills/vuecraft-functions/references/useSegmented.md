---
category: data
package: @vuecraft/components
---

# useSegmented

Quickly define segmented for your data.

- More configurable options refer to [SegmentedProps](https://element-plus.org/en-US/component/segmented#api)

## Basic Usage

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

## Custom render item content

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

## Custom default slot

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

## v-model Control

Control the selected value using v-model.

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

## Disabled

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

## Block

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

## Direction

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

## Async Data

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

## Pass props to ElSegmented

Pass additional props to the underlying ElSegmented component.

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

## Declaration Types

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

## Type Declarations

```ts
import type { RequestService } from '@vuecraft/core'
import type { SegmentedProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'

export type SegmentedOptionValue = string | number | boolean

export interface SegmentedColumn {
  // @desc Value of the option
  value?: SegmentedOptionValue
  // @desc Label of the option
  label?: string
  // @desc Whether the option is disabled
  disabled?: boolean
  // @desc Render function of the option content
  render?: (item: SegmentedColumn) => VNode
}

export interface SegmentedOptions<T> extends Partial<SegmentedProps> {
  // @desc Columns of the segmented
  columns?: SegmentedColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format segmented data
  formatData?: (data: T) => SegmentedColumn[]
  // @desc Default value of the segmented
  defaultValue?: SegmentedOptionValue
  // @desc Callback when value changes
  onChange?: (val: SegmentedOptionValue) => void
}

export type SegmentedReturnType = [
  // @desc Segmented component
  Component,
  // @desc Value ref, can be used to control value externally
  Ref<SegmentedOptionValue | undefined>,
]

export function useSegmented<T>(options: SegmentedOptions<T>): SegmentedReturnType;
```
