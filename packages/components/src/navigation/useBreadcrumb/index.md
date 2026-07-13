# useBreadcrumb

Quickly define breadcrumbs to display the location of the current page.

- More configurable options refer to [BreadcrumbProps](https://element-plus.org/en-US/component/breadcrumb#breadcrumb-api)

## Basic Usage

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuetkit/components'

const [Breadcrumb] = useBreadcrumb({
  items: [
    { label: 'homepage', to: { path: '/' } },
    { label: 'promotion management' },
    { label: 'promotion list' },
    { label: 'promotion detail' },
  ],
})
</script>

<template>
  <div>
    <Breadcrumb />
  </div>
</template>
```

## Separator

Set `separator` to customize the separator character. Its default value is `'/'`.

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuetkit/components'

const [Breadcrumb] = useBreadcrumb({
  separator: '|',
  items: [
    { label: 'homepage', to: { path: '/' } },
    { label: 'promotion management' },
    { label: 'promotion list' },
    { label: 'promotion detail' },
  ],
})
</script>

<template>
  <div>
    <Breadcrumb />
  </div>
</template>
```

## Icon Separator

Set `separatorIcon` to use an svg icon as the separator, it will cover `separator`.

```vue
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { useBreadcrumb } from '@vuetkit/components'

const [Breadcrumb] = useBreadcrumb({
  separatorIcon: ArrowRight,
  items: [
    { label: 'homepage', to: { path: '/' } },
    { label: 'promotion management' },
    { label: 'promotion list' },
    { label: 'promotion detail' },
  ],
})
</script>

<template>
  <div>
    <Breadcrumb />
  </div>
</template>
```

## Replace Navigation

Set `replace` to `true` on an item so the navigation will not leave a history record.

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuetkit/components'

const [Breadcrumb] = useBreadcrumb({
  items: [
    { label: 'homepage', to: { path: '/' }, replace: true },
    { label: 'promotion management' },
    { label: 'promotion list' },
  ],
})
</script>

<template>
  <div>
    <Breadcrumb />
  </div>
</template>
```

## Custom render item content

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuetkit/components'
import { h } from 'vue'

const [Breadcrumb] = useBreadcrumb({
  items: [
    {
      label: 'homepage',
      to: { path: '/' },
      render: (item) => {
        return h('a', { class: 'item-link' }, `Link: ${(item as { label: string }).label}`)
      },
    },
    { label: 'promotion management' },
  ],
})
</script>

<template>
  <div>
    <Breadcrumb />
  </div>
</template>
```

## Custom Breadcrumb Content

Use the `default` slot to fully customize the breadcrumb content.

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuetkit/components'

const [Breadcrumb] = useBreadcrumb({
  items: [],
})
</script>

<template>
  <div>
    <Breadcrumb>
      <div class="custom-breadcrumb">
        Custom Breadcrumb Content
      </div>
    </Breadcrumb>
  </div>
</template>
```

## Async Data

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuetkit/components'

async function fetchBreadcrumbItems() {
  const res = await fetch('/api/breadcrumb-items')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    label: item.label,
    to: item.to,
    replace: item.replace,
  }))
}

const [Breadcrumb] = useBreadcrumb({
  items: [],
  service: fetchBreadcrumbItems,
  formatData,
})
</script>

<template>
  <div>
    <Breadcrumb />
  </div>
</template>
```

## Pass props to ElBreadcrumb

Pass additional props to the underlying ElBreadcrumb component.

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuetkit/components'

const [Breadcrumb] = useBreadcrumb({
  items: [
    { label: 'homepage', to: { path: '/' } },
    { label: 'promotion management' },
    { label: 'promotion list' },
    { label: 'promotion detail' },
  ],
  separator: '>',
})
</script>

<template>
  <div>
    <Breadcrumb />
  </div>
</template>
```

## Declaration Types

### BreadcrumbColumn

```typescript
interface BreadcrumbColumn {
  // Label of the breadcrumb item
  label?: string
  // Target route of the link, same as `to` of vue-router
  to?: unknown
  // If `true`, the navigation will not leave a history record
  replace?: boolean
  // Render function of the item content
  render?: (val: unknown) => VNode
}
```

### BreadcrumbOptions

```typescript
interface BreadcrumbOptions<T> extends Partial<BreadcrumbProps> {
  // Items of the breadcrumb
  items?: BreadcrumbColumn[]
  // Service
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format items data
  formatData?: (data: T) => BreadcrumbColumn[]
}
```

### BreadcrumbReturnType

```typescript
type BreadcrumbReturnType = [
  // Breadcrumb component
  Component,
]
```
