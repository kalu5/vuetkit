<p align="center">
<a href="https://github.com/kalu5/vuetkit">
  <img src="https://raw.githubusercontent.com/kalu5/vuetkit/main/packages/public/images/logo-large.png" alt="VueTkit - Collection of business development tools for Vue3 projects" width="300">
</a>
<br>
Collect commonly used Composable Utilities, Shared Utilities, and Composable Components in development.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vuetkit/core" target="__blank"><img src="https://img.shields.io/npm/v/@vuetkit/core?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@vuetkit/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vuetkit/core?color=50a36f&label="></a>
<a href="https://kalu5.github.io/vuetkit" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=1e8a7a" alt="Docs & Demos"></a>
<br>
<a href="https://github.com/kalu5/vuetkit" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/kalu5/vuetkit?style=social"></a>
</p>

## 🚀 Features

- 🎪 [**Interactive docs & demos**](https://kalu5.github.io/vuetkit)
- ⚡ **Fully tree shakeable**: Only take what you want
- 🦾 **Type Strong**: Written in [TypeScript](https://www.typescriptlang.org/), with [TS Docs](https://github.com/microsoft/tsdoc)

## 📦 Install

```bash
# npm
npm install @vuetkit/core

# yarn
yarn add @vuetkit/core

# pnpm
pnpm add @vuetkit/core

```

## 🦄 Usage

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

## 🌸 Thanks

This project is heavily inspired by the following awesome projects.

- [vueuse](https://github.com/vueuse/vueuse)
- [ahooks](https://ahooks.js.org/)

## 📝 License

MIT License © 2026-PRESENT Kalu5
