import { mount } from '@vue/test-utils'

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useScale } from './index'

interface Harness<T> {
  result: T
  unmount: () => void
}

function runInComponent<T>(setup: () => T): Harness<T> {
  let result: T
  const Comp = defineComponent({
    setup() {
      result = setup()
      return () => null
    },
  })
  const wrapper = mount(Comp)
  return {
    result: result!,
    unmount: () => wrapper.unmount(),
  }
}

function setViewport(w: number, h: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: h })
}

describe('useScale', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    setViewport(1920, 1080)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  function createContainer(id = 'screen') {
    const el = document.createElement('div')
    el.id = id
    document.body.appendChild(el)
    return el
  }

  it('returns expected shape (scale, update)', () => {
    createContainer()
    const { result: res } = runInComponent(() => useScale('#screen'))
    expect(res.scale).toBeDefined()
    expect(typeof res.update).toBe('function')
  })

  it('sets container styles on mount', () => {
    const el = createContainer()
    runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    expect(el.style.width).toBe('1920px')
    expect(el.style.height).toBe('1080px')
    expect(el.style.transformOrigin).toBe('top left')
    expect(el.style.transition).toContain('transform')
  })

  it('computes scale 1 when viewport matches design size', () => {
    createContainer()
    const { result: res } = runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    expect(res.scale.value).toBe(1)
  })

  it('computes correct scale when viewport is smaller than design', () => {
    setViewport(960, 540)
    createContainer()
    const { result: res } = runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    expect(res.scale.value).toBeCloseTo(0.5)
  })

  it('keeps the smaller ratio to avoid deformation', () => {
    setViewport(1920, 540)
    createContainer()
    const { result: res } = runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    expect(res.scale.value).toBeCloseTo(0.5)
  })

  it('applies transform to container on mount', () => {
    setViewport(960, 540)
    const el = createContainer()
    runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    expect(el.style.transform).toContain('scale(0.5)')
  })

  it('updates scale on window resize (debounced)', () => {
    createContainer()
    const { result: res } = runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    expect(res.scale.value).toBe(1)
    setViewport(960, 540)
    window.dispatchEvent(new Event('resize'))
    // before debounce wait, no update
    vi.advanceTimersByTime(100)
    expect(res.scale.value).toBe(1)
    // after debounce wait, updated
    vi.advanceTimersByTime(100)
    expect(res.scale.value).toBeCloseTo(0.5)
  })

  it('update can be called manually', () => {
    createContainer()
    const { result: res } = runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    setViewport(960, 540)
    res.update()
    expect(res.scale.value).toBeCloseTo(0.5)
  })

  it('uses default design size 1920x1080', () => {
    const el = createContainer()
    runInComponent(() => useScale('#screen'))
    expect(el.style.width).toBe('1920px')
    expect(el.style.height).toBe('1080px')
  })

  it('does not throw when container is not found', () => {
    expect(() => runInComponent(() => useScale('#not-exist'))).not.toThrow()
  })

  it('removes resize listener on unmount', () => {
    createContainer()
    const { result: res, unmount } = runInComponent(() => useScale('#screen', { width: 1920, height: 1080 }))
    expect(res.scale.value).toBe(1)
    unmount()
    setViewport(960, 540)
    window.dispatchEvent(new Event('resize'))
    vi.advanceTimersByTime(300)
    expect(res.scale.value).toBe(1)
  })
})
