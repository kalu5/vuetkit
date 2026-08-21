# useTreeV2

快速为你的数据定义虚拟化树形组件。

- 更多可配置选项请参考 [TreeV2 Attributes](https://element-plus.org/en-US/component/tree-v2#treev2-api)

## 基础用法

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

## 自定义节点内容（节点级渲染）

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

## 自定义节点内容（选项级渲染）

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

## 默认插槽

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

## 可选择

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

## 访问树实例

使用返回的 ref 调用暴露的方法，如 `filter`、`getCheckedKeys` 等。

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

## 异步数据

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

## 传递 props 给 ElTreeV2

向底层的 ElTreeV2 组件传递额外的 props。

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

## 类型声明

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
