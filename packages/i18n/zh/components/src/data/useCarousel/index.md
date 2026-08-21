# useCarousel

快速为你的数据定义轮播。

- 更多可配置选项请参考 [CarouselProps](https://element-plus.org/en-US/component/carousel#carousel-api)

## 基础用法

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'

const [Carousel] = useCarousel({
  columns: [
    { content: 'Slide 1' },
    { content: 'Slide 2' },
    { content: 'Slide 3' },
    { content: 'Slide 4' },
  ],
})
</script>

<template>
  <div>
    <Carousel height="200px" />
  </div>
</template>
```

## 自定义渲染项内容

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'
import { h } from 'vue'

const [Carousel] = useCarousel({
  columns: [
    {
      content: 'Slide 1',
      render: (val: string) => h('h3', { class: 'slide' }, `${val} (custom)`),
    },
    { content: 'Slide 2' },
  ],
})
</script>

<template>
  <div>
    <Carousel height="200px" />
  </div>
</template>
```

## 指示器位置和箭头

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'

const [Carousel] = useCarousel({
  columns: [
    { content: 'Slide 1' },
    { content: 'Slide 2' },
    { content: 'Slide 3' },
  ],
  indicatorPosition: 'outside',
  arrow: 'always',
  interval: 5000,
})
</script>

<template>
  <div>
    <Carousel height="200px" />
  </div>
</template>
```

## 卡片模式

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'

const [Carousel] = useCarousel({
  columns: [
    { content: 'Slide 1' },
    { content: 'Slide 2' },
    { content: 'Slide 3' },
    { content: 'Slide 4' },
    { content: 'Slide 5' },
    { content: 'Slide 6' },
  ],
  type: 'card',
})
</script>

<template>
  <div>
    <Carousel height="200px" />
  </div>
</template>
```

## 垂直方向

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'

const [Carousel] = useCarousel({
  columns: [
    { content: 'Slide 1' },
    { content: 'Slide 2' },
    { content: 'Slide 3' },
  ],
  direction: 'vertical',
  autoplay: false,
})
</script>

<template>
  <div>
    <Carousel height="200px" />
  </div>
</template>
```

## v-model 控制

使用返回的 active ref 控制当前激活的幻灯片。

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'

const [Carousel, active] = useCarousel({
  columns: [
    { content: 'Slide 1', name: 's1' },
    { content: 'Slide 2', name: 's2' },
    { content: 'Slide 3', name: 's3' },
  ],
  initialIndex: 0,
})

function goNext() {
  if (active.value < 2) {
    active.value++
  }
}

function goPrev() {
  if (active.value > 0) {
    active.value--
  }
}
</script>

<template>
  <div>
    <Carousel height="200px" :autoplay="false" />
    <button @click="goPrev">
      Previous
    </button>
    <button @click="goNext">
      Next
    </button>
  </div>
</template>
```

## 暴露的方法

轮播组件通过模板 ref 暴露了 `setActiveItem`、`prev` 和 `next` 方法。

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'
import { ref } from 'vue'

const [Carousel] = useCarousel({
  columns: [
    { content: 'Slide 1', name: 's1' },
    { content: 'Slide 2', name: 's2' },
    { content: 'Slide 3', name: 's3' },
  ],
})

const carouselRef = ref()
</script>

<template>
  <div>
    <Carousel ref="carouselRef" height="200px" :autoplay="false" />
    <button @click="carouselRef?.prev()">
      Prev
    </button>
    <button @click="carouselRef?.setActiveItem('s3')">
      Go to s3
    </button>
    <button @click="carouselRef?.next()">
      Next
    </button>
  </div>
</template>
```

## 异步数据

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'

async function fetchSlides() {
  const res = await fetch('/api/slides')
  return res.json()
}

function formatData(data: any) {
  return data.map((item: any) => ({
    content: item.content,
    name: item.name,
    label: item.label,
  }))
}

const [Carousel] = useCarousel({
  columns: [],
  service: fetchSlides,
  formatData,
})
</script>

<template>
  <div>
    <Carousel height="200px" />
  </div>
</template>
```

## 传递 props 给 ElCarousel

向底层的 ElCarousel 组件传递额外的 props。

```vue
<script setup lang="ts">
import { useCarousel } from '@vuecraft/components'

const [Carousel] = useCarousel({
  columns: [
    { content: 'Slide 1' },
    { content: 'Slide 2' },
    { content: 'Slide 3' },
  ],
  height: '200px',
  trigger: 'click',
  loop: false,
  pauseOnHover: false,
  motionBlur: true,
})
</script>

<template>
  <div>
    <Carousel />
  </div>
</template>
```

## 类型声明

### CarouselOptions

```typescript
interface CarouselOptions<T> extends Partial<CarouselProps> {
  // Columns of the carousel
  columns: CarouselColumn[]
  // Service for fetching async data
  service?: RequestService<T>
  // Service params
  params?: unknown
  // Format carousel data
  formatData?: (data: T) => CarouselColumn[]
  // Initial active slide index
  initialIndex?: number
}
```

### CarouselColumn

```typescript
interface CarouselColumn extends Partial<CarouselItemProps> {
  // Content of the carousel item
  content?: string
  // Render function of the carousel item content
  render?: (val: unknown) => VNode
}
```

### CarouselReturnType

```typescript
type CarouselReturnType = [
  // Carousel component
  Component,
  // Active index ref, can be used to control active slide externally
  Ref<number>,
]
```
