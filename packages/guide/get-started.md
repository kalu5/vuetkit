# Get Started

VueTkit is a collect commonly used Composable Utilities, Shared Utilities, and Composable Components in development.

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

Simply import the function you need from `@vuetkit/core`.

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
