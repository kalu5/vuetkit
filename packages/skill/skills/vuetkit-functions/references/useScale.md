---
category: visualization
package: @vuetkit/core
---

# useScale

Encapsulates the large-screen scaling solution. The container keeps the design draft size and scales to fit the viewport, centered via translate.

::: tip :zap:Feature

1. Keep the design draft size fixed, scale to fit the viewport.
2. Center the container via translate.
3. Debounced resize listener to avoid frequent reflow.
   :::

## Basic Usage

```ts
import { useScale } from '@vuetkit/core'

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

## Options

<table>
  <thead>
   <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>

  <tr>
    <td>width</td>
    <td>number</td>
    <td>1920</td>
    <td>
      The design draft width.
    </td>
  </tr>
  <tr>
    <td>height</td>
    <td>number</td>
    <td>1080</td>
    <td>
      The design draft height.
    </td>
  </tr>
  </tbody>
</table>

## Return Value

<table>
  <thead>
   <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>scale</td>
    <td>number</td>
    <td>
      The current scale ratio.
    </td>
  </tr>
  <tr>
    <td>update</td>
    <td>function</td>
    <td>
      The function to recompute the scale manually.
    </td>
  </tr>
  </tbody>
</table>

## More Example

### Manual Update

You can call `update` to recompute the scale manually, for example after the container size or layout changes.

```ts
import { useScale } from '@vuetkit/core'

const { scale, update } = useScale('#screen', {
  width: 1920,
  height: 1080,
})

// recompute scale manually
update()
```

### Custom Design Draft Size

```ts
import { useScale } from '@vuetkit/core'

useScale('#screen', {
  width: 2560,
  height: 1440,
})
```

## Type Declarations

```ts
import type { Ref } from 'vue'

export interface ScaleOptions {
  // design draft width
  width?: number
  // design draft height
  height?: number
}

export interface ScaleReturn {
  // current scale ratio
  scale: Ref<number>
  // recompute scale manually
  update: () => void
}

export function useScale(
  container: string,
  options?: ScaleOptions,
): ScaleReturn;
```
