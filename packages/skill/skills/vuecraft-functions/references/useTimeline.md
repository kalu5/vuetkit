---
category: data
package: @vuecraft/components
---

# useTimeline

Quickly define timeline for your data.

- More configurable options refer to [TimelineProps](https://element-plus.org/en-US/component/timeline#timeline-api)

## Basic Usage

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

## Custom render item content

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

## Type Declarations

```ts
import type { RequestService } from '@vuecraft/core'
import type { TimelineItemProps, TimelineProps } from 'element-plus'
import type { Component, VNode } from 'vue'

export interface TimelineColumn extends Partial<TimelineItemProps> {
  // @desc Content of the timeline item
  content?: string
  // @desc Render function of the timeline item content
  render?: (val: unknown) => VNode
  // @desc Render function of the timeline item dot
  renderDot?: (val: unknown) => VNode
}

export interface TimelineOptions<T> extends Partial<TimelineProps> {
  // @desc Columns of the timeline
  columns: TimelineColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format timeline data
  formatData?: (data: T) => TimelineColumn[]
}

export type TimelineReturnType = [
  Component,
]

export function useTimeline<T>(options: TimelineOptions<T>);
```
