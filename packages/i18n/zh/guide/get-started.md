# 快速开始

VueCraft 收集了开发中常用的组合式工具函数、通用工具函数和组合式组件。

## 安装

```bash
# npm
npm install @vuecraft/core

# yarn
yarn add @vuecraft/core

# pnpm
pnpm add @vuecraft/core

```

## 使用示例

只需从 `@vuecraft/core` 导入你需要的函数。

```vue
<script setup lang="ts">
import { useRequest } from '@vuecraft/core'
import axios from 'axios'

function asyncSevice() {
  return axios.get('/api/data')
}

const { data, loading, error } = useRequest(asyncSevice)
</script>
```
