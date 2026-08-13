import type { Ref } from 'vue'

import { debounce } from '@vuecraft/shared'
import { onMounted, onUnmounted, ref } from 'vue'

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

/**
 * useScale
 * @description Encapsulates the large-screen scaling solution.
 * @description The container keeps the design draft size and scales to fit the viewport, centered via translate.
 * @param container large screen element selector
 * @param options design draft size
 */
export function useScale(
  container: string,
  options?: ScaleOptions,
): ScaleReturn {
  const { width = 1920, height = 1080 } = options || {}

  const scale = ref(1)
  let containerElement: HTMLElement | null = null

  // listen for viewport resize, sync scale (debounced)
  const resizeHandler = debounce(update, 200)

  function setElementStyle() {
    if (!containerElement)
      return
    Object.assign(containerElement.style, {
      width: `${width}px`,
      height: `${height}px`,
      transformOrigin: 'top left',
      transition: 'transform 0.5s',
    })
  }

  function update() {
    if (!containerElement)
      return
    // scale ratio of x and y axis
    const scaleX = innerWidth / width
    const scaleY = innerHeight / height
    // keep the smaller ratio to avoid deformation
    const currentScale = Math.min(scaleX, scaleY)
    scale.value = currentScale
    // move the container to center it
    const left = (innerWidth - width * currentScale) / 2
    const top = (innerHeight - height * currentScale) / 2
    containerElement.style.transform = `translate(${left}px, ${top}px) scale(${currentScale})`
  }

  onMounted(() => {
    containerElement = document.querySelector<HTMLElement>(container)
    if (!containerElement)
      return
    // set default styles
    setElementStyle()
    // initial scale
    update()
    // listen for viewport resize
    addEventListener('resize', resizeHandler)
  })

  onUnmounted(() => {
    removeEventListener('resize', resizeHandler)
    resizeHandler.cancel()
    containerElement = null
  })

  return {
    scale,
    update,
  }
}
