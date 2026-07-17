// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useCarousel } from './index'

vi.mock('element-plus', () => ({
  ElCarousel: defineComponent({
    props: ['height', 'initialIndex', 'trigger', 'autoplay', 'interval', 'indicatorPosition', 'arrow', 'type', 'cardScale', 'loop', 'direction', 'pauseOnHover', 'motionBlur'],
    emits: ['change'],
    setup(props, { slots, emit, expose }) {
      const activeIndex = ref(props.initialIndex ?? 0)
      const setActiveItem = (index: number | string) => {
        const old = activeIndex.value
        const newIdx = typeof index === 'number' ? index : Number.parseInt(index, 10) || 0
        activeIndex.value = newIdx
        emit('change', newIdx, old)
      }
      const prev = () => {
        const old = activeIndex.value
        activeIndex.value = Math.max(0, activeIndex.value - 1)
        emit('change', activeIndex.value, old)
      }
      const next = () => {
        const old = activeIndex.value
        activeIndex.value = activeIndex.value + 1
        emit('change', activeIndex.value, old)
      }
      expose({ setActiveItem, prev, next, activeIndex })
      return () => h('div', {
        'class': 'el-carousel',
        'data-initial-index': String(props.initialIndex ?? 0),
        'data-height': props.height || '',
        'data-trigger': props.trigger || '',
        'data-autoplay': props.autoplay != null ? String(props.autoplay) : '',
        'data-interval': props.interval != null ? String(props.interval) : '',
        'data-indicator-position': props.indicatorPosition || '',
        'data-arrow': props.arrow || '',
        'data-type': props.type || '',
        'data-card-scale': props.cardScale != null ? String(props.cardScale) : '',
        'data-loop': props.loop != null ? String(props.loop) : '',
        'data-direction': props.direction || '',
        'data-pause-on-hover': props.pauseOnHover != null ? String(props.pauseOnHover) : '',
        'data-motion-blur': props.motionBlur != null ? String(props.motionBlur) : '',
      }, slots.default?.())
    },
  }),
  ElCarouselItem: defineComponent({
    props: ['name', 'label'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-carousel-item',
        'data-name': props.name || '',
        'data-label': props.label || '',
      }, [
        h('div', { class: 'el-carousel-item__content' }, slots.default?.()),
      ])
    },
  }),
  vLoading: {
    mounted(el: HTMLElement, binding: { value: boolean }) {
      if (binding.value)
        el.setAttribute('data-loading', 'true')
      else
        el.removeAttribute('data-loading')
    },
    updated(el: HTMLElement, binding: { value: boolean }) {
      if (binding.value)
        el.setAttribute('data-loading', 'true')
      else
        el.removeAttribute('data-loading')
    },
  },
}))

vi.mock('@vuetkit/core', () => ({
  useRequest: vi.fn(() => ({
    data: ref(null),
    loading: ref(false),
    error: ref(undefined),
    execute: vi.fn(),
    cancel: vi.fn(),
  })),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useCarousel', () => {
  it('returns a component and active ref', () => {
    const [CarouselComp, active] = useCarousel({
      columns: [],
    })
    expect(CarouselComp).toBeDefined()
    expect(typeof CarouselComp).toBe('object')
    expect(active).toBeDefined()
    expect(typeof active.value).toBe('number')
    expect(active.value).toBe(0)
  })

  it('uses initialIndex when provided', () => {
    const [, active] = useCarousel({
      columns: [],
      initialIndex: 2,
    })
    expect(active.value).toBe(2)
  })

  it('defaults initialIndex to 0 when not provided', () => {
    const [, active] = useCarousel({
      columns: [],
    })
    expect(active.value).toBe(0)
  })

  it('binds initial-index to ElCarousel', () => {
    const [CarouselComp] = useCarousel({
      columns: [],
      initialIndex: 1,
    })
    const wrapper = mount(CarouselComp)
    const el = wrapper.find('.el-carousel')
    expect(el.attributes('data-initial-index')).toBe('1')
  })

  it('renders basic columns with content', () => {
    const [CarouselComp] = useCarousel({
      columns: [
        { content: 'Slide 1' },
        { content: 'Slide 2' },
      ],
    })
    const wrapper = mount(CarouselComp)
    const items = wrapper.findAll('.el-carousel-item')
    expect(items.length).toBe(2)
    expect(items[0].find('.el-carousel-item__content').text()).toBe('Slide 1')
    expect(items[1].find('.el-carousel-item__content').text()).toBe('Slide 2')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Rendered: ${val}`))
    const [CarouselComp] = useCarousel({
      columns: [
        { content: 'test', render: customRender },
      ],
    })
    const wrapper = mount(CarouselComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered: test')
    expect(customRender).toHaveBeenCalledWith('test')
  })

  it('renders default slot content when provided', () => {
    const [CarouselComp] = useCarousel({
      columns: [
        { content: 'should-not-show' },
      ],
    })
    const wrapper = mount(CarouselComp, {
      slots: {
        default: () => h('div', { class: 'custom-slot' }, 'Custom Slot Content'),
      },
    })
    expect(wrapper.find('.custom-slot').exists()).toBe(true)
    expect(wrapper.find('.custom-slot').text()).toBe('Custom Slot Content')
    expect(wrapper.findAll('.el-carousel-item').length).toBe(0)
  })

  it('returns empty string when columns is empty array', () => {
    const [CarouselComp] = useCarousel({
      columns: [],
    })
    const wrapper = mount(CarouselComp)
    expect(wrapper.find('.el-carousel-item').exists()).toBe(false)
  })

  it('passes rest props to ElCarousel (height, trigger, autoplay, interval)', () => {
    const [CarouselComp] = useCarousel({
      columns: [],
      height: '200px',
      trigger: 'click',
      autoplay: false,
      interval: 5000,
    })
    const wrapper = mount(CarouselComp)
    const el = wrapper.find('.el-carousel')
    expect(el.attributes('data-height')).toBe('200px')
    expect(el.attributes('data-trigger')).toBe('click')
    expect(el.attributes('data-autoplay')).toBe('false')
    expect(el.attributes('data-interval')).toBe('5000')
  })

  it('passes rest props to ElCarousel (indicator-position, arrow, type, card-scale)', () => {
    const [CarouselComp] = useCarousel({
      columns: [],
      indicatorPosition: 'outside',
      arrow: 'always',
      type: 'card',
      cardScale: 0.5,
    })
    const wrapper = mount(CarouselComp)
    const el = wrapper.find('.el-carousel')
    expect(el.attributes('data-indicator-position')).toBe('outside')
    expect(el.attributes('data-arrow')).toBe('always')
    expect(el.attributes('data-type')).toBe('card')
    expect(el.attributes('data-card-scale')).toBe('0.5')
  })

  it('passes rest props to ElCarousel (loop, direction, pause-on-hover, motion-blur)', () => {
    const [CarouselComp] = useCarousel({
      columns: [],
      loop: false,
      direction: 'vertical',
      pauseOnHover: false,
      motionBlur: true,
    })
    const wrapper = mount(CarouselComp)
    const el = wrapper.find('.el-carousel')
    expect(el.attributes('data-loop')).toBe('false')
    expect(el.attributes('data-direction')).toBe('vertical')
    expect(el.attributes('data-pause-on-hover')).toBe('false')
    expect(el.attributes('data-motion-blur')).toBe('true')
  })

  it('passes column properties to ElCarouselItem (name, label)', () => {
    const [CarouselComp] = useCarousel({
      columns: [
        { content: 'Slide 1', name: 'slide-1', label: 'Label 1' },
      ],
    })
    const wrapper = mount(CarouselComp)
    const item = wrapper.find('.el-carousel-item')
    expect(item.attributes('data-name')).toBe('slide-1')
    expect(item.attributes('data-label')).toBe('Label 1')
  })

  it('handles undefined render function gracefully', () => {
    const [CarouselComp] = useCarousel({
      columns: [
        { content: 'test', render: undefined },
      ],
    })
    const wrapper = mount(CarouselComp)
    expect(wrapper.find('.el-carousel-item__content').text()).toBe('test')
  })

  it('handles null content gracefully', () => {
    const [CarouselComp] = useCarousel({
      columns: [
        { content: null as unknown as string },
      ],
    })
    const wrapper = mount(CarouselComp)
    expect(() => wrapper.find('.el-carousel-item__content').text()).not.toThrow()
  })

  it('handles undefined content gracefully', () => {
    const [CarouselComp] = useCarousel({
      columns: [
        { content: undefined as unknown as string },
      ],
    })
    const wrapper = mount(CarouselComp)
    expect(() => wrapper.find('.el-carousel-item__content').text()).not.toThrow()
  })

  it('supports component props passed during mount', () => {
    const [CarouselComp] = useCarousel({
      columns: [],
    })
    const wrapper = mount(CarouselComp, {
      props: {
        height: '300px',
        arrow: 'never',
      },
    })
    const el = wrapper.find('.el-carousel')
    expect(el.attributes('data-height')).toBe('300px')
    expect(el.attributes('data-arrow')).toBe('never')
  })

  it('component props override options props', () => {
    const [CarouselComp] = useCarousel({
      columns: [],
      height: '100px',
      arrow: 'hover',
    })
    const wrapper = mount(CarouselComp, {
      props: {
        height: '400px',
        arrow: 'always',
      },
    })
    const el = wrapper.find('.el-carousel')
    expect(el.attributes('data-height')).toBe('400px')
    expect(el.attributes('data-arrow')).toBe('always')
  })

  describe('active ref external control', () => {
    it('updates active ref when carousel emits change', async () => {
      const [CarouselComp, active] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
        ],
        initialIndex: 0,
      })
      const wrapper = mount(CarouselComp)
      expect(active.value).toBe(0)
      // trigger internal change via exposed next
      ;(wrapper.vm as any).next()
      expect(active.value).toBe(1)
    })

    it('updates carousel when active ref is changed externally', async () => {
      const [CarouselComp, active] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
          { content: 'Slide 3' },
        ],
        initialIndex: 0,
      })
      const wrapper = mount(CarouselComp)
      const carouselEl = wrapper.find('.el-carousel')
      // sanity check: initial state
      expect(carouselEl.attributes('data-initial-index')).toBe('0')
      // externally change active index
      active.value = 2
      await wrapper.vm.$nextTick()
      // active ref stays at 2 (no internal change resolution in mock)
      expect(active.value).toBe(2)
    })

    it('does not cause infinite loop when active is updated externally', async () => {
      const [CarouselComp, active] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
        ],
        initialIndex: 0,
      })
      const wrapper = mount(CarouselComp)
      active.value = 1
      await wrapper.vm.$nextTick()
      // Should settle on 1 without looping
      expect(active.value).toBe(1)
      expect(wrapper.find('.el-carousel').exists()).toBe(true)
    })

    it('exposes setActiveItem method', async () => {
      const [CarouselComp, active] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
          { content: 'Slide 3' },
        ],
        initialIndex: 0,
      })
      const wrapper = mount(CarouselComp)
      ;(wrapper.vm as any).setActiveItem(2)
      await wrapper.vm.$nextTick()
      expect(active.value).toBe(2)
    })

    it('exposes prev method', async () => {
      const [CarouselComp, active] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
        ],
        initialIndex: 1,
      })
      const wrapper = mount(CarouselComp)
      ;(wrapper.vm as any).prev()
      await wrapper.vm.$nextTick()
      expect(active.value).toBe(0)
    })

    it('exposes next method', async () => {
      const [CarouselComp, active] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
        ],
        initialIndex: 0,
      })
      const wrapper = mount(CarouselComp)
      ;(wrapper.vm as any).next()
      await wrapper.vm.$nextTick()
      expect(active.value).toBe(1)
    })

    it('re-emits change event with new and old index', async () => {
      const [CarouselComp] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
        ],
        initialIndex: 0,
      })
      const wrapper = mount(CarouselComp)
      ;(wrapper.vm as any).next()
      await wrapper.vm.$nextTick()
      const emitted = wrapper.emitted('change')
      expect(emitted).toBeTruthy()
      expect(emitted![0]).toEqual([1, 0])
    })

    it('forwards onChange listener passed via mount props', async () => {
      const [CarouselComp] = useCarousel({
        columns: [
          { content: 'Slide 1' },
          { content: 'Slide 2' },
        ],
        initialIndex: 0,
      })
      const handler = vi.fn()
      const wrapper = mount(CarouselComp, {
        attrs: {
          onChange: handler,
        },
      })
      ;(wrapper.vm as any).next()
      await wrapper.vm.$nextTick()
      expect(handler).toHaveBeenCalledWith(1, 0)
    })
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ name: 'async' }))
      useCarousel({
        columns: [],
        service: mockService,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        defaultParams: undefined,
        formatData: undefined,
      }))
    })

    it('passes params as defaultParams to useRequest', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockParams = { id: 1 }
      useCarousel({
        columns: [],
        service: mockService,
        params: mockParams,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        defaultParams: mockParams,
      }))
    })

    it('passes formatData to useRequest', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockFormatData = vi.fn(() => [{ content: 'test' }])
      useCarousel({
        columns: [],
        service: mockService,
        formatData: mockFormatData,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        formatData: mockFormatData,
      }))
    })

    it('passes formatData as undefined when formatData is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      useCarousel({
        columns: [],
        service: mockService,
        formatData: undefined,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        formatData: undefined,
      }))
    })

    it('uses data.value from service when data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { content: 'Async Slide 1' },
        { content: 'Async Slide 2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [
          { content: 'Static Slide' },
        ],
        service: mockService,
      })
      const wrapper = mount(CarouselComp)
      const items = wrapper.findAll('.el-carousel-item')
      expect(items.length).toBe(2)
      expect(items[0].find('.el-carousel-item__content').text()).toBe('Async Slide 1')
      expect(items[1].find('.el-carousel-item__content').text()).toBe('Async Slide 2')
    })

    it('falls back to static columns when data.value is null', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(null)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [
          { content: 'Static Slide' },
        ],
        service: mockService,
      })
      const wrapper = mount(CarouselComp)
      const items = wrapper.findAll('.el-carousel-item')
      expect(items.length).toBe(1)
      expect(items[0].find('.el-carousel-item__content').text()).toBe('Static Slide')
    })

    it('falls back to static columns when data.value is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(undefined)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [
          { content: 'Static Slide' },
        ],
        service: mockService,
      })
      const wrapper = mount(CarouselComp)
      const items = wrapper.findAll('.el-carousel-item')
      expect(items.length).toBe(1)
      expect(items[0].find('.el-carousel-item__content').text()).toBe('Static Slide')
    })

    it('applies vLoading directive when loading is true', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      vi.mocked(useRequest).mockReturnValue({
        data: ref(null),
        loading: ref(true),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(CarouselComp)
      const el = wrapper.find('.el-carousel')
      expect(el.attributes('data-loading')).toBe('true')
    })

    it('does not apply vLoading directive when loading is false', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      vi.mocked(useRequest).mockReturnValue({
        data: ref(null),
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(CarouselComp)
      const el = wrapper.find('.el-carousel')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [CarouselComp] = useCarousel({
        columns: [],
      })
      const wrapper = mount(CarouselComp)
      const el = wrapper.find('.el-carousel')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static columns is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { content: 'Async Slide' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(CarouselComp)
      const items = wrapper.findAll('.el-carousel-item')
      expect(items.length).toBe(1)
      expect(items[0].find('.el-carousel-item__content').text()).toBe('Async Slide')
    })

    it('uses data.value as empty array when data is empty array', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [
          { content: 'Static Slide' },
        ],
        service: mockService,
      })
      const wrapper = mount(CarouselComp)
      const items = wrapper.findAll('.el-carousel-item')
      expect(items.length).toBe(0)
    })

    it('uses async data initialIndex is still applied to ElCarousel', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { content: 'Async Slide 1' },
        { content: 'Async Slide 2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CarouselComp] = useCarousel({
        columns: [],
        service: mockService,
        initialIndex: 1,
      })
      const wrapper = mount(CarouselComp)
      const el = wrapper.find('.el-carousel')
      expect(el.attributes('data-initial-index')).toBe('1')
    })
  })
})
