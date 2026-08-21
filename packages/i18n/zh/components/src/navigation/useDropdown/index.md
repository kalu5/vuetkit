# useDropdown

快速为你的导航定义下拉菜单。

- 更多可配置选项请参考 [DropdownProps](https://element-plus.org/en-US/component/dropdown#dropdown-api)

## 基础用法

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'

const [Dropdown] = useDropdown({
  items: [
    { label: 'Action 1', command: 'a' },
    { label: 'Action 2', command: 'b' },
    { label: 'Action 3', command: 'c' },
  ],
})
</script>

<template>
  <div>
    <Dropdown>
      <span class="el-dropdown-link">
        Dropdown List
      </span>
    </Dropdown>
  </div>
</template>
```

## 命令事件

返回的 `command` ref 跟踪最后选中项的命令，`onCommand` 回调在选择时触发。

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'

const [Dropdown, command] = useDropdown({
  items: [
    { label: 'Action 1', command: 'a' },
    { label: 'Action 2', command: 'b' },
  ],
  onCommand: (cmd) => {
    console.log('selected:', cmd)
  },
})
</script>

<template>
  <div>
    <Dropdown>
      <span>Current: {{ command }}</span>
    </Dropdown>
  </div>
</template>
```

## 自定义渲染项内容

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'
import { h } from 'vue'

const [Dropdown] = useDropdown({
  items: [
    {
      label: 'Action 1',
      command: 'a',
      render: (item) => {
        return h('span', { class: 'action-content' }, `Custom: ${(item as { label: string }).label}`)
      },
    },
  ],
})
</script>

<template>
  <div>
    <Dropdown>
      <span>Dropdown List</span>
    </Dropdown>
  </div>
</template>
```

## 项属性

为每个项传递 `disabled`、`divided` 和 `icon`。

```vue
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { useDropdown } from '@vuecraft/components'

const [Dropdown] = useDropdown({
  items: [
    { label: 'Action 1', command: 'a', icon: Plus },
    { label: 'Action 2', command: 'b' },
    { label: 'Action 3', command: 'c', disabled: true },
    { label: 'Action 4', command: 'd', divided: true },
  ],
})
</script>

<template>
  <div>
    <Dropdown>
      <span>Dropdown List</span>
    </Dropdown>
  </div>
</template>
```

## 触发方式和位置

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'

const [Dropdown] = useDropdown({
  items: [
    { label: 'Action 1', command: 'a' },
    { label: 'Action 2', command: 'b' },
  ],
  trigger: 'click',
  placement: 'top-start',
})
</script>

<template>
  <div>
    <Dropdown>
      <span>Click to trigger</span>
    </Dropdown>
  </div>
</template>
```

## 分割按钮

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'

const [Dropdown] = useDropdown({
  items: [
    { label: 'Action 1', command: 'a' },
    { label: 'Action 2', command: 'b' },
  ],
  splitButton: true,
  type: 'primary',
  onClick: () => {
    console.log('main button clicked')
  },
})
</script>

<template>
  <div>
    <Dropdown />
  </div>
</template>
```

## 自定义下拉内容

使用 `dropdown` 插槽完全自定义下拉内容。

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'
import { h } from 'vue'

const [Dropdown] = useDropdown({
  items: [],
})
</script>

<template>
  <div>
    <Dropdown>
      <span>Dropdown List</span>
      <template #dropdown>
        <div class="custom-dropdown">
          Custom Dropdown Content
        </div>
      </template>
    </Dropdown>
  </div>
</template>
```

## 异步数据

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'

async function fetchItems() {
  const res = await fetch('/api/dropdown-items')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    label: item.label,
    command: item.command,
    disabled: item.disabled,
    divided: item.divided,
  }))
}

const [Dropdown] = useDropdown({
  items: [],
  service: fetchItems,
  formatData,
})
</script>

<template>
  <div>
    <Dropdown>
      <span>Dropdown List</span>
    </Dropdown>
  </div>
</template>
```

## 传递 props 给 ElDropdown

向底层的 ElDropdown 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useDropdown } from '@vuecraft/components'

const [Dropdown] = useDropdown({
  items: [
    { label: 'Action 1', command: 'a' },
    { label: 'Action 2', command: 'b' },
  ],
  trigger: 'click',
  effect: 'dark',
  hideOnClick: false,
  maxHeight: 300,
})
</script>

<template>
  <div>
    <Dropdown>
      <span>Dropdown List</span>
    </Dropdown>
  </div>
</template>
```

## 类型声明

### DropdownOptions

```typescript
interface DropdownOptions<T> extends Partial<DropdownProps> {
  // Items of the dropdown
  items?: DropdownItem[]
  // Service
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format items data
  formatData?: (data: T) => DropdownItem[]
  // Default command
  defaultCommand?: string | number | object
  // Callback when an item is clicked
  onCommand?: (command: string | number | object) => void
  // Callback when dropdown visibility changes
  onVisibleChange?: (visible: boolean) => void
  // Callback when the triggering element is clicked (split button)
  onClick?: () => void
}
```

### DropdownItem

```typescript
interface DropdownItem {
  // Label of the dropdown item
  label?: string
  // Command of the dropdown item, passed to the command event
  command?: string | number | object
  // Whether the item is disabled
  disabled?: boolean
  // Whether to show a divider before the item
  divided?: boolean
  // Icon of the item
  icon?: string | Component
  // Render function of the item content
  render?: (val: unknown) => VNode
}
```

### DropdownReturnType

```typescript
type DropdownReturnType = [
  // Dropdown component
  Component,
  // Command ref, tracks the last selected item's command
  Ref<string | number | object | undefined>,
]
```
