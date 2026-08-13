# useDescriptions

Quickly define descriptions for your data.

- More configurable options refer to [DescriptionsProps](https://element-plus.org/en-US/component/descriptions#descriptions-api)

## Basic Usage

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

## Custom render item value

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
