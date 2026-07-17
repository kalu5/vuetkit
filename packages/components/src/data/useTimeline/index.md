# useTimeline

Quickly define timeline for your data.

- More configurable options refer to [TimelineProps](https://element-plus.org/en-US/component/timeline#timeline-api)

## Basic Usage

```vue
<script setup lang="ts">
import { useTimeline } from '@vuetkit/components'

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
import { useTimeline } from '@vuetkit/components'

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
