# useTabs

Quickly define tabs for your navigation.

- More configurable options refer to [TabsProps](https://element-plus.org/en-US/component/tabs#tabs-api)

## Basic Usage

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'

const [Tabs] = useTabs({
  tabs: [
    {
      label: 'User',
      name: 'user',
    },
    {
      label: 'Config',
      name: 'config',
    },
    {
      label: 'Role',
      name: 'role',
    },
  ]
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## Custom render tab content

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'
import { h } from 'vue'

const [Tabs] = useTabs({
  tabs: [
    {
      label: 'User',
      name: 'user',
      render: (item) => {
        return h('div', { class: 'user-content' }, 'User Management Content')
      },
    },
    {
      label: 'Config',
      name: 'config',
      render: (item) => {
        return h('div', { class: 'config-content' }, 'Configuration Content')
      },
    },
  ]
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## Custom render tab label

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'
import { h } from 'vue'

const [Tabs] = useTabs({
  tabs: [
    {
      label: 'User',
      name: 'user',
      renderLabel: (label) => {
        return h('span', { class: 'custom-label' }, `Custom: ${label}`)
      },
    },
  ]
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## v-model Control

Control the active tab using v-model.

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'

const [Tabs, activeName] = useTabs({
  tabs: [
    { label: 'User', name: 'user' },
    { label: 'Config', name: 'config' },
    { label: 'Role', name: 'role' },
  ],
  defaultActive: 'user',
})

function switchTab(name: string) {
  activeName.value = name
}
</script>

<template>
  <div>
    <Tabs v-model="activeName" />
    <button @click="switchTab('user')">
      User
    </button>
    <button @click="switchTab('config')">
      Config
    </button>
    <button @click="switchTab('role')">
      Role
    </button>
  </div>
</template>
```

## Card Style Tabs

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'

const [Tabs] = useTabs({
  tabs: [
    { label: 'User', name: 'user' },
    { label: 'Config', name: 'config' },
    { label: 'Role', name: 'role' },
  ],
  type: 'card',
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## Border Card Style

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'

const [Tabs] = useTabs({
  tabs: [
    { label: 'User', name: 'user' },
    { label: 'Config', name: 'config' },
    { label: 'Role', name: 'role' },
  ],
  type: 'border-card',
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## Tab Position

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'

const [Tabs] = useTabs({
  tabs: [
    { label: 'User', name: 'user' },
    { label: 'Config', name: 'config' },
    { label: 'Role', name: 'role' },
  ],
  tabPosition: 'left',
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## Async Data

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'

async function fetchTabs() {
  const res = await fetch('/api/tabs')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    label: item.label,
    name: item.name,
    closable: item.closable,
  }))
}

const [Tabs] = useTabs({
  tabs: [],
  service: fetchTabs,
  formatData,
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## Pass props to ElTabs

Pass additional props to the underlying ElTabs component.

```vue
<script setup lang="ts">
import { useTabs } from '@vuecraft/components'

const [Tabs] = useTabs({
  tabs: [
    { label: 'User', name: 'user' },
    { label: 'Config', name: 'config' },
    { label: 'Role', name: 'role' },
  ],
  type: 'card',
  closable: true,
  stretch: true,
})
</script>

<template>
  <div>
    <Tabs />
  </div>
</template>
```

## Declaration Types

### TabsOptions

```typescript
interface TabsOptions<T> extends Partial<TabsProps> {
  // @desc Tabs of the component
  tabs: TabsColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format tabs data
  formatData?: (data: T) => TabsColumn[]
  // @desc Default active tab name
  defaultActive?: string | number
  // @desc Callback when tab is clicked
  onTabClick?: (tab: TabsPaneContext, event: Event) => void
  // @desc Callback when tab is changed
  onTabChange?: (name: TabPaneName) => void
  // @desc Callback when tab is removed
  onTabRemove?: (name: TabPaneName) => void
  // @desc Callback when tab is added
  onTabAdd?: () => void
  // @desc Callback when tab is edited (add or remove)
  onEdit?: (targetName: TabPaneName | undefined, action: 'remove' | 'add') => void
}
```

### TabsColumn

```typescript
interface TabsColumn {
  // Title of the tab
  label?: string
  // Identifier corresponding to the name of Tabs
  name?: string | number
  // Whether Tab is disabled
  disabled?: boolean
  // Whether Tab is closable
  closable?: boolean
  // Whether Tab is lazily rendered
  lazy?: boolean
  // Render function of the tab content
  render?: (val: unknown) => VNode
  // Render function of the tab label
  renderLabel?: (val: unknown) => VNode
}
```

### TabsReturnType

```typescript
type TabsReturnType = [
  // Tabs component
  Component,
  // Active tab name ref, can be used to control tab externally
  Ref<string | number>,
]
```
