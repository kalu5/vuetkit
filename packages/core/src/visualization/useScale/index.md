# useScale

Encapsulates the large-screen scaling solution. The container keeps the design draft size and scales to fit the viewport, centered via translate.

::: tip :zap:Feature

1. Keep the design draft size fixed, scale to fit the viewport.
2. Center the container via translate.
3. Debounced resize listener to avoid frequent reflow.
   :::

## Basic Usage

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

## More Example

### Manual Update

You can call `update` to recompute the scale manually, for example after the container size or layout changes.

```ts
import { useScale } from '@vuecraft/core'

const { scale, update } = useScale('#screen', {
  width: 1920,
  height: 1080,
})

// recompute scale manually
update()
```

### Custom Design Draft Size

```ts
import { useScale } from '@vuecraft/core'

useScale('#screen', {
  width: 2560,
  height: 1440,
})
```

## Declaration Types

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
