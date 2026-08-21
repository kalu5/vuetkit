# useMenu

快速为你的网站定义导航菜单。

- 更多可配置选项请参考 [MenuProps](https://element-plus.org/en-US/component/menu#menu-api)

## 基础用法

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  items: [
    { index: '1', label: 'Processing Center' },
    { index: '2', label: 'Orders' },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 顶部导航栏

设置 `mode` 为 `horizontal` 以使用顶部导航栏菜单。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  mode: 'horizontal',
  defaultActive: '1',
  items: [
    { index: '1', label: 'Processing Center' },
    { index: '2', label: 'Orders' },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 子菜单

使用 `children` 创建带有嵌套项的子菜单。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  items: [
    { index: '1', label: 'Processing Center' },
    {
      index: '2',
      label: 'Workspace',
      children: [
        { index: '2-1', label: 'item one' },
        { index: '2-2', label: 'item two' },
        { index: '2-3', label: 'item three' },
      ],
    },
    { index: '3', label: 'Info', disabled: true },
    { index: '4', label: 'Orders' },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 嵌套子菜单

子菜单可以嵌套以创建多级菜单。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  items: [
    {
      index: '2',
      label: 'Workspace',
      children: [
        { index: '2-1', label: 'item one' },
        { index: '2-2', label: 'item two' },
        { index: '2-3', label: 'item three' },
        {
          index: '2-4',
          label: 'item four',
          children: [
            { index: '2-4-1', label: 'item one' },
            { index: '2-4-2', label: 'item two' },
            { index: '2-4-3', label: 'item three' },
          ],
        },
      ],
    },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 选择事件

返回的 `activeIndex` ref 跟踪选中的菜单项，`onSelect` 回调在选择时触发。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu, activeIndex] = useMenu({
  defaultActive: '1',
  items: [
    { index: '1', label: 'Processing Center' },
    { index: '2', label: 'Orders' },
  ],
  onSelect: (index, indexPath, item) => {
    console.log('selected:', index, indexPath, item)
  },
})
</script>

<template>
  <div>
    <Menu />
    <p>Active: {{ activeIndex }}</p>
  </div>
</template>
```

## 打开 / 关闭事件

`onOpen` 和 `onClose` 在子菜单展开或折叠时触发。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  items: [
    {
      index: '1',
      label: 'Workspace',
      children: [
        { index: '1-1', label: 'item one' },
        { index: '1-2', label: 'item two' },
      ],
    },
  ],
  onOpen: (index, indexPath) => {
    console.log('opened:', index, indexPath)
  },
  onClose: (index, indexPath) => {
    console.log('closed:', index, indexPath)
  },
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 自定义渲染项内容

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'
import { h } from 'vue'

const [Menu] = useMenu({
  items: [
    {
      index: '1',
      label: 'Item 1',
      render: (item) => {
        return h('span', { class: 'item-content' }, `Custom: ${(item as { label: string }).label}`)
      },
    },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 自定义子菜单标题

使用 `renderTitle` 自定义子菜单标题内容。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'
import { h } from 'vue'

const [Menu] = useMenu({
  items: [
    {
      index: '1',
      label: 'Workspace',
      renderTitle: (item) => {
        return h('span', { class: 'title-content' }, `Title: ${(item as { label: string }).label}`)
      },
      children: [
        { index: '1-1', label: 'item one' },
      ],
    },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 菜单项分组

使用 `groupTitle` 和 `children` 渲染为 MenuItemGroup。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  items: [
    {
      index: '1',
      groupTitle: 'Group One',
      children: [
        { index: '1-1', label: 'item one' },
        { index: '1-2', label: 'item two' },
      ],
    },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 折叠

设置 `collapse` 为 `true` 以使用折叠的侧边栏菜单（仅限垂直模式）。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  collapse: true,
  items: [
    { index: '1', label: 'Processing Center' },
    {
      index: '2',
      label: 'Workspace',
      children: [
        { index: '2-1', label: 'item one' },
        { index: '2-2', label: 'item two' },
      ],
    },
  ],
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 自定义菜单内容

使用 `default` 插槽完全自定义菜单内容。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'
import { h } from 'vue'

const [Menu] = useMenu({
  items: [],
})
</script>

<template>
  <div>
    <Menu>
      <div class="custom-menu">
        Custom Menu Content
      </div>
    </Menu>
  </div>
</template>
```

## 异步数据

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

async function fetchMenuItems() {
  const res = await fetch('/api/menu-items')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    index: item.index,
    label: item.label,
    disabled: item.disabled,
    children: item.children,
  }))
}

const [Menu] = useMenu({
  items: [],
  service: fetchMenuItems,
  formatData,
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 传递 props 给 ElMenu

向底层的 ElMenu 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useMenu } from '@vuecraft/components'

const [Menu] = useMenu({
  items: [
    { index: '1', label: 'Processing Center' },
    { index: '2', label: 'Orders' },
  ],
  mode: 'horizontal',
  uniqueOpened: true,
  menuTrigger: 'click',
  popperEffect: 'light',
  closeOnClickOutside: true,
  showTimeout: 500,
  hideTimeout: 400,
  popperOffset: 12,
})
</script>

<template>
  <div>
    <Menu />
  </div>
</template>
```

## 类型声明

### MenuColumn

```typescript
interface MenuColumn {
  // Index of the menu item, unique identification
  index: string
  // Label of the menu item
  label?: string
  // Whether the item is disabled
  disabled?: boolean
  // Vue Router object
  route?: unknown
  // Children of the sub-menu
  children?: MenuColumn[]
  // Render function of the item content
  render?: (val: unknown) => VNode
  // Render function of the title (for sub-menu)
  renderTitle?: (val: unknown) => VNode
  // Group title - if set with children, renders as MenuItemGroup
  groupTitle?: string
  // Sub-menu popper class
  popperClass?: string
  // Sub-menu popper style
  popperStyle?: unknown
  // Sub-menu show timeout
  showTimeout?: number
  // Sub-menu hide timeout
  hideTimeout?: number
  // Whether the sub-menu is teleported
  teleported?: boolean
  // Sub-menu popper offset
  popperOffset?: number
  // Icon when menu expanded and submenu closed
  expandCloseIcon?: string | Component
  // Icon when menu expanded and submenu opened
  expandOpenIcon?: string | Component
  // Icon when menu collapsed and submenu closed
  collapseCloseIcon?: string | Component
  // Icon when menu collapsed and submenu opened
  collapseOpenIcon?: string | Component
}
```

### MenuOptions

```typescript
interface MenuOptions<T> extends Partial<MenuProps> {
  // Items of the menu
  items?: MenuColumn[]
  // Service
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format items data
  formatData?: (data: T) => MenuColumn[]
  // Default active index
  defaultActive?: string
  // Callback when a menu item is selected
  onSelect?: (index: string, indexPath: string[], item: unknown, routerResult?: Promise<unknown>) => void
  // Callback when a sub-menu opens
  onOpen?: (index: string, indexPath: string[]) => void
  // Callback when a sub-menu closes
  onClose?: (index: string, indexPath: string[]) => void
}
```

### MenuReturnType

```typescript
type MenuReturnType = [
  // Menu component
  Component,
  // Active index ref, tracks the selected menu item
  Ref<string>,
]
```
