---
category: data
package: @vuetkit/components
---

# useDescriptions

Quickly define descriptions for your data.

- More configurable options refer to [DescriptionsProps](https://element-plus.org/en-US/component/descriptions#descriptions-api)

## Basic Usage

```vue
<script setup lang="ts">
import { useDescriptions } from '@vuetkit/components'

const [Descriptions] = useDescriptions({
  columns: [
    {
      label: 'Name',
      value: 'vuetkit',
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

## Custom render item value

```vue
<script setup lang="ts">
import { useDescriptions } from '@vuetkit/components'

const [Descriptions] = useDescriptions({
  columns: [
    {
      label: 'Name',
      value: 'vuetkit',
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

## Type Declarations

```ts
import type { RequestService } from '@vuetkit/core'
import type { DescriptionItemProps, DescriptionProps } from 'element-plus'
import type { Component, VNode } from 'vue'

export interface DescriptionsColumn extends Partial<DescriptionItemProps> {
  // @desc Value of the column
  value?: string
  // @desc Render function of the column
  render?: (val: unknown) => VNode
  // @desc Render label of the column
  renderLabel?: (val: unknown) => VNode
}

export interface DescriptionsOptions<T> extends DescriptionProps {
  // @desc Columns of the descriptions
  columns: DescriptionsColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format descriptions data
  formatData?: (data: T) => DescriptionsColumn[]
}

export type DescriptionsReturnType = [
  Component,
]

export function useDescriptions<T>(options: DescriptionsOptions<T>);
```
