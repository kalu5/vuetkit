# useScale

封装大屏缩放方案。容器保持设计稿尺寸，通过缩放适配视口，并使用 translate 居中。

::: tip :zap:特性

1. 保持设计稿尺寸不变，通过缩放适配视口。
2. 通过 translate 实现容器居中。
3. 防抖的 resize 监听，避免频繁重排。
   :::

## 基础用法

```ts
import { useScale } from '@vuecraft/core'

// call in setup, pass the container selector and design draft size
useScale('#screen', {
  width: 1920,
  height: 1080,
})
```

```html
<template>
  <div id="screen">
    <!-- large screen content -->
  </div>
</template>
```

## 更多示例

### 手动更新

你可以调用 `update` 手动重新计算缩放比例，例如在容器尺寸或布局变化之后。

```ts
import { useScale } from '@vuecraft/core'

const { scale, update } = useScale('#screen', {
  width: 1920,
  height: 1080,
})

// recompute scale manually
update()
```

### 自定义设计稿尺寸

```ts
import { useScale } from '@vuecraft/core'

useScale('#screen', {
  width: 2560,
  height: 1440,
})
```

## 类型声明

### ScaleOptions

```typescript
interface ScaleOptions {
  // design draft width (default: 1920)
  width?: number
  // design draft height (default: 1080)
  height?: number
}
```

### ScaleReturn

```typescript
interface ScaleReturn {
  // current scale ratio
  scale: Ref<number>
  // recompute scale manually
  update: () => void
}
```
