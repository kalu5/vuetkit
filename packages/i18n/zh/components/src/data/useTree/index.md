# useTree

快速为你的数据定义树形组件。

- 更多可配置选项请参考 [Tree Attributes](https://element-plus.org/en-US/component/tree#tree-api)

## 基础用法

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'

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

## 自定义节点内容（节点级渲染）

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'
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

## 自定义节点内容（选项级渲染）

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'
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

## 默认插槽

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'

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

## 可选择

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'

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

## 访问树实例

使用返回的 ref 调用暴露的方法，如 `filter`、`getCheckedKeys` 等。

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'

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

## 异步数据

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'

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

## 传递 props 给 ElTree

向底层的 ElTree 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useTree } from '@vuecraft/components'

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

## 类型声明

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
