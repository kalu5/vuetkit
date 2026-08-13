# useTreeV2

Quickly define a virtualized tree for your data.

- More configurable options refer to [TreeV2 Attributes](https://element-plus.org/en-US/component/tree-v2#treev2-api)

## Basic Usage

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'

const [TreeV2] = useTreeV2({
  data: [
    {
      id: '1',
      label: 'Level one 1',
      children: [
        { id: '1-1', label: 'Level two 1-1' },
      ],
    },
    {
      id: '2',
      label: 'Level one 2',
    },
  ],
})
</script>

<template>
  <div>
    <TreeV2 />
  </div>
</template>
```

## Custom node content (per-node render)

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'
import { h } from 'vue'

const [TreeV2] = useTreeV2({
  data: [
    {
      id: '1',
      label: 'Level one 1',
      render: (node, data) => h('span', { class: 'custom-node' }, `Custom: ${node.label}`),
      children: [
        { id: '1-1', label: 'Level two 1-1' },
      ],
    },
  ],
})
</script>

<template>
  <div>
    <TreeV2 />
  </div>
</template>
```

## Custom node content (option-level render)

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'
import { h } from 'vue'

const [TreeV2] = useTreeV2({
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
  render: (node, data) => h('span', { style: { color: 'green' } }, node.label),
})
</script>

<template>
  <div>
    <TreeV2 />
  </div>
</template>
```

## Default slot

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'

const [TreeV2] = useTreeV2({
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
})
</script>

<template>
  <div>
    <TreeV2>
      <template #default="{ node }">
        <span style="color: blue">{{ node.label }}</span>
      </template>
    </TreeV2>
  </div>
</template>
```

## Selectable

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'

const [TreeV2] = useTreeV2({
  showCheckbox: true,
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
})
</script>

<template>
  <div>
    <TreeV2 />
  </div>
</template>
```

## Access tree instance

Use the returned ref to call exposed methods like `filter`, `getCheckedKeys`, etc.

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'

const [TreeV2, treeRef] = useTreeV2({
  showCheckbox: true,
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
})

function logCheckedKeys() {
  console.log(treeRef.value?.getCheckedKeys())
}
</script>

<template>
  <div>
    <TreeV2 />
    <button @click="logCheckedKeys">
      Log checked keys
    </button>
  </div>
</template>
```

## Async Data

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'

async function fetchTree() {
  const res = await fetch('/api/tree')
  return res.json()
}

function formatData(data: any) {
  return data.list
}

const [TreeV2] = useTreeV2({
  data: [],
  service: fetchTree,
  formatData,
})
</script>

<template>
  <div>
    <TreeV2 />
  </div>
</template>
```

## Pass props to ElTreeV2

Pass additional props to the underlying ElTreeV2 component.

```vue
<script setup lang="ts">
import { useTreeV2 } from '@vuecraft/components'

const [TreeV2] = useTreeV2({
  height: 300,
  indent: 20,
  highlightCurrent: true,
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
})
</script>

<template>
  <div>
    <TreeV2 />
  </div>
</template>
```

## Declaration Types

### TreeV2Options

```typescript
interface TreeV2Options<T> extends Omit<TreeProps, 'data'> {
  // Tree data
  data?: TreeV2Column[]
  // Service for fetching async data
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format tree data
  formatData?: (data: T) => TreeV2Column[]
  // Default render function for all nodes, used when the node has no per-node render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}
```

### TreeV2Column

```typescript
interface TreeV2Column extends TreeNodeData {
  // Children nodes of the current node
  children?: TreeV2Column[]
  // Render function of the node content, takes priority over option-level render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}
```

### TreeV2ReturnType

```typescript
type TreeV2ReturnType = [
  // TreeV2 component
  Component,
  // TreeV2 instance ref, can be used to call exposed methods externally
  Ref<TreeV2Instance | undefined>,
]
```
