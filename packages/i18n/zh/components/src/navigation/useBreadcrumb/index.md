# useBreadcrumb

快速定义面包屑以显示当前页面的位置。

- 更多可配置选项请参考 [BreadcrumbProps](https://element-plus.org/en-US/component/breadcrumb#breadcrumb-api)

## 基础用法

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecraft/components'

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

## 分隔符

设置 `separator` 以自定义分隔符。默认值为 `'/'`。

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecraft/components'

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

## 图标分隔符

设置 `separatorIcon` 使用 svg 图标作为分隔符，它会覆盖 `separator`。

```vue
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { useBreadcrumb } from '@vuecraft/components'

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

## 替换导航

在某个项上设置 `replace` 为 `true`，导航将不会留下历史记录。

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecraft/components'

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

## 自定义渲染项内容

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecraft/components'
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

## 自定义面包屑内容

使用 `default` 插槽完全自定义面包屑内容。

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecraft/components'

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

## 异步数据

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecraft/components'

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

## 传递 props 给 ElBreadcrumb

向底层的 ElBreadcrumb 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecraft/components'

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

## 类型声明

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
