# Get Started

VueCraft is a collect commonly used Composable Utilities, Shared Utilities, and Composable Components in development.

## Installation

```bash
# npm
npm install @vuecraft/core

# yarn
yarn add @vuecraft/core

# pnpm
pnpm add @vuecraft/core

```

## Usage Example

Simply import the function you need from `@vuecraft/core`.

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
