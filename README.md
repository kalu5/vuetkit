<p align="center">
<a href="https://github.com/kalu5/vuecraft">
  <img src="https://raw.githubusercontent.com/kalu5/vuecraft/main/packages/public/images/logo-tech.svg" alt="VueCraft - Collection of business development tools for Vue3 projects" width="300">
</a>
<br>
<p align="center" style="font-size: 32px;">VueCraft</p>
<br>
<p align="center">
  Collect commonly used Composable Utilities, Shared Utilities, and Composable Components in development.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vuecraft/core" target="__blank"><img src="https://img.shields.io/npm/v/@vuecraft/core?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@vuecraft/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vuecraft/core?color=50a36f&label="></a>
<a href="https://kalu5.github.io/vuecraft" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=1e8a7a" alt="Docs & Demos"></a>
<br>
<a href="https://github.com/kalu5/vuecraft" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/kalu5/vuecraft?style=social"></a>
</p>

## 🚀 Features

- 🎪 [**Interactive docs & demos**](https://kalu5.github.io/vuecraft)
- ⚡ **Fully tree shakeable**: Only take what you want
- 🦾 **Type Strong**: Written in [TypeScript](https://www.typescriptlang.org/), with [TS Docs](https://github.com/microsoft/tsdoc)

## 📦 Install

```bash
# npm
npm install @vuecraft/core

# yarn
yarn add @vuecraft/core

# pnpm
pnpm add @vuecraft/core

```

## 🦄 Usage

Simply import the hook you need from `@vuecraft/core`.

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

## 🌸 Thanks

This project is heavily inspired by the following awesome projects.

- [vueuse](https://github.com/vueuse/vueuse)
- [ahooks](https://ahooks.js.org/)

## 📝 License

MIT License © 2026-PRESENT Kalu5
