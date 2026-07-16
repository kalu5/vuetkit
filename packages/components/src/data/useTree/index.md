# useTree

Quickly define a tree for your data.

- More configurable options refer to [Tree Attributes](https://element-plus.org/en-US/component/tree#tree-api)

## Basic Usage

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'

const [Tree] = useTree({
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
    <Tree />
  </div>
</template>
```

## Custom node content (per-node render)

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'
import { h } from 'vue'

const [Tree] = useTree({
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
    <Tree />
  </div>
</template>
```

## Custom node content (option-level render)

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'
import { h } from 'vue'

const [Tree] = useTree({
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
  render: (node, data) => h('span', { style: { color: 'green' } }, node.label),
})
</script>

<template>
  <div>
    <Tree />
  </div>
</template>
```

## Default slot

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'

const [Tree] = useTree({
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
})
</script>

<template>
  <div>
    <Tree>
      <template #default="{ node }">
        <span style="color: blue">{{ node.label }}</span>
      </template>
    </Tree>
  </div>
</template>
```

## Selectable

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'

const [Tree] = useTree({
  showCheckbox: true,
  nodeKey: 'id',
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
})
</script>

<template>
  <div>
    <Tree />
  </div>
</template>
```

## Access tree instance

Use the returned ref to call exposed methods like `filter`, `getCheckedKeys`, etc.

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'

const [Tree, treeRef] = useTree({
  showCheckbox: true,
  nodeKey: 'id',
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
    <Tree />
    <button @click="logCheckedKeys">
      Log checked keys
    </button>
  </div>
</template>
```

## Async Data

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'

async function fetchTree() {
  const res = await fetch('/api/tree')
  return res.json()
}

function formatData(data: any) {
  return data.list
}

const [Tree] = useTree({
  data: [],
  service: fetchTree,
  formatData,
})
</script>

<template>
  <div>
    <Tree />
  </div>
</template>
```

## Pass props to ElTree

Pass additional props to the underlying ElTree component.

```vue
<script setup lang="ts">
import { useTree } from '@vuetkit/components'

const [Tree] = useTree({
  nodeKey: 'id',
  indent: 20,
  highlightCurrent: true,
  defaultExpandAll: true,
  data: [
    { id: '1', label: 'Level one 1' },
    { id: '2', label: 'Level one 2' },
  ],
})
</script>

<template>
  <div>
    <Tree />
  </div>
</template>
```

## Declaration Types

### TreeOptions

```typescript
interface TreeOptions<T> extends Omit<TreeComponentProps, 'data'> {
  // Tree data
  data?: TreeColumn[]
  // Service for fetching async data
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format tree data
  formatData?: (data: T) => TreeColumn[]
  // Default render function for all nodes, used when the node has no per-node render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}
```

### TreeColumn

```typescript
interface TreeColumn extends TreeNodeData {
  // Children nodes of the current node
  children?: TreeColumn[]
  // Render function of the node content, takes priority over option-level render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}
```

### TreeReturnType

```typescript
type TreeReturnType = [
  // Tree component
  Component,
  // Tree instance ref, can be used to call exposed methods externally
  Ref<TreeInstance | undefined>,
]
```
