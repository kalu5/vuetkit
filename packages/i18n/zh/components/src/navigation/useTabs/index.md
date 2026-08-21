# useTabs

快速为你的导航定义标签页。

- 更多可配置选项请参考 [TabsProps](https://element-plus.org/en-US/component/tabs#tabs-api)

## 基础用法

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

## 自定义渲染标签页内容

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

## 自定义渲染标签页标签

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

## v-model 控制

使用 v-model 控制激活的标签页。

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

## 卡片风格标签页

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

## 边框卡片风格

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

## 标签页位置

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

## 异步数据

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

## 传递 props 给 ElTabs

向底层的 ElTabs 组件传递额外的 props。

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

## 类型声明

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
