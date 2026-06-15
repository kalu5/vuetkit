# Get Started

VueTkit is a collection of business development tools for Vue3 projects. Includes Hooks, Utils, Components.

## Installation

```bash
# npm
npm install @vuetkit/core

# yarn
yarn add @vuetkit/core

# pnpm
pnpm add @vuetkit/core

```

## Usage Example

Simply import the hook you need from `@vuetkit/core`.

```vue
<script setup lang="ts">
import { useRequest } from '@vuetkit/core'
import axios from 'axios'

function asyncSevice() {
  return axios.get('/api/data')
}

const { data, loading, error } = useRequest(asyncSevice)
</script>
```
