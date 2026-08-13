---
category: navigation
package: @vuecraft/components
---

# useMenu

Quickly define navigation menus for your website.

- More configurable options refer to [MenuProps](https://element-plus.org/en-US/component/menu#menu-api)

## Basic Usage

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

## Top Bar

Set `mode` to `horizontal` for a top bar menu.

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

## Sub Menu

Use `children` to create a sub-menu with nested items.

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

## Nested Sub Menu

Sub-menus can be nested to create multi-level menus.

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

## Select Event

The returned `activeIndex` ref tracks the selected menu item, and the `onSelect` callback fires on selection.

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

## Open / Close Events

`onOpen` and `onClose` fire when sub-menus expand or collapse.

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

## Custom render item content

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

## Custom sub-menu title

Use `renderTitle` to customize the sub-menu title content.

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

## Menu Item Group

Use `groupTitle` with `children` to render as a MenuItemGroup.

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

## Collapse

Set `collapse` to `true` for a collapsed sidebar menu (vertical mode only).

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

## Custom Menu Content

Use the `default` slot to fully customize the menu content.

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

## Async Data

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

## Pass props to ElMenu

Pass additional props to the underlying ElMenu component.

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

## Declaration Types

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

## Type Declarations

```ts
import type { RequestService } from '@vuecraft/core'
import type { Component, CSSProperties, Ref, VNode } from 'vue'

export interface MenuColumn {
  // @desc Index of the menu item, unique identification
  index: string
  // @desc Label of the menu item
  label?: string
  // @desc Whether the item is disabled
  disabled?: boolean
  // @desc Vue Router object
  route?: unknown
  // @desc Children of the sub-menu
  children?: MenuColumn[]
  // @desc Render function of the item content
  render?: (val: unknown) => VNode
  // @desc Render function of the title (for sub-menu)
  renderTitle?: (val: unknown) => VNode
  // @desc Group title - if set with children, renders as MenuItemGroup
  groupTitle?: string
  // @desc Sub-menu popper class
  popperClass?: string
  // @desc Sub-menu popper style
  popperStyle?: string | CSSProperties
  // @desc Sub-menu show timeout
  showTimeout?: number
  // @desc Sub-menu hide timeout
  hideTimeout?: number
  // @desc Whether the sub-menu is teleported
  teleported?: boolean
  // @desc Sub-menu popper offset
  popperOffset?: number
  // @desc Icon when menu expanded and submenu closed
  expandCloseIcon?: string | Component
  // @desc Icon when menu expanded and submenu opened
  expandOpenIcon?: string | Component
  // @desc Icon when menu collapsed and submenu closed
  collapseCloseIcon?: string | Component
  // @desc Icon when menu collapsed and submenu opened
  collapseOpenIcon?: string | Component
}

export interface MenuOptions<T> extends Partial<ElMenuProps> {
  // @desc Items of the menu
  items?: MenuColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format items data
  formatData?: (data: T) => MenuColumn[]
  // @desc Default active index
  defaultActive?: string
  // @desc Callback when a menu item is selected
  onSelect?: (index: string, indexPath: string[], item: unknown, routerResult?: Promise<unknown>) => void
  // @desc Callback when a sub-menu opens
  onOpen?: (index: string, indexPath: string[]) => void
  // @desc Callback when a sub-menu closes
  onClose?: (index: string, indexPath: string[]) => void
}

export type MenuReturnType = [
  // @desc Menu component
  Component,
  // @desc Active index ref, tracks the selected menu item
  Ref<string>,
]

export function useMenu<T>(options: MenuOptions<T>): MenuReturnType;
```
