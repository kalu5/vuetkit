// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuecraft/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useTimeline } from './index'

vi.mock('element-plus', () => ({
  ElTimeline: defineComponent({
    props: ['reverse', 'mode'],
    setup(props, { slots }) {
      return () => h('ul', {
        'data-reverse': props.reverse ? 'true' : 'false',
        'data-mode': props.mode || '',
      }, [
        slots.default?.(),
      ])
    },
  }),
  ElTimelineItem: defineComponent({
    props: ['timestamp', 'hideTimestamp', 'center', 'placement', 'type', 'color', 'size', 'icon', 'hollow'],
    setup(props, { slots }) {
      return () => h('li', {
        'class': 'el-timeline-item',
        'data-timestamp': props.timestamp || '',
        'data-hide-timestamp': props.hideTimestamp ? 'true' : 'false',
        'data-center': props.center ? 'true' : 'false',
        'data-placement': props.placement || '',
        'data-type': props.type || '',
        'data-color': props.color || '',
        'data-size': props.size || '',
        'data-hollow': props.hollow ? 'true' : 'false',
      }, [
        h('div', { class: 'el-timeline-item__wrapper' }, slots.default?.()),
        h('div', { class: 'el-timeline-item__node' }, slots.dot?.()),
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

vi.mock('@vuecraft/core', () => ({
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

describe('useTimeline', () => {
  it('returns a component', () => {
    const [TimelineComp] = useTimeline({
      columns: [],
    })
    expect(TimelineComp).toBeDefined()
    expect(typeof TimelineComp).toBe('object')
  })

  it('renders basic columns with content and timestamp', () => {
    const [TimelineComp] = useTimeline({
      columns: [
        { content: 'Event start', timestamp: '2018-04-15' },
        { content: 'Approved', timestamp: '2018-04-13' },
      ],
    })
    const wrapper = mount(TimelineComp)
    const items = wrapper.findAll('.el-timeline-item')
    expect(items.length).toBe(2)
    expect(items[0].attributes('data-timestamp')).toBe('2018-04-15')
    expect(items[1].attributes('data-timestamp')).toBe('2018-04-13')
    expect(items[0].find('.el-timeline-item__wrapper').text()).toBe('Event start')
    expect(items[1].find('.el-timeline-item__wrapper').text()).toBe('Approved')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Rendered: ${val}`))
    const [TimelineComp] = useTimeline({
      columns: [
        { content: 'test', render: customRender },
      ],
    })
    const wrapper = mount(TimelineComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered: test')
    expect(customRender).toHaveBeenCalledWith('test')
  })

  it('uses custom renderDot function for item dot', () => {
    const customDotRender = vi.fn((item: unknown) => h('span', { class: 'custom-dot' }, `Dot: ${(item as { content: string }).content}`))
    const [TimelineComp] = useTimeline({
      columns: [
        { content: 'test', renderDot: customDotRender },
      ],
    })
    const wrapper = mount(TimelineComp)
    expect(wrapper.find('.custom-dot').exists()).toBe(true)
    expect(wrapper.find('.custom-dot').text()).toBe('Dot: test')
    expect(customDotRender).toHaveBeenCalled()
  })

  it('supports both render and renderDot functions', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-content' }, 'Content'))
    const customDotRender = vi.fn(() => h('span', { class: 'custom-dot' }, 'Dot'))
    const [TimelineComp] = useTimeline({
      columns: [
        { content: 'test', render: customRender, renderDot: customDotRender },
      ],
    })
    const wrapper = mount(TimelineComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-dot').exists()).toBe(true)
    expect(customRender).toHaveBeenCalled()
    expect(customDotRender).toHaveBeenCalled()
  })

  it('renders default slot content when provided', () => {
    const [TimelineComp] = useTimeline({
      columns: [
        { content: 'should-not-show', timestamp: '2018-04-15' },
      ],
    })
    const wrapper = mount(TimelineComp, {
      slots: {
        default: () => h('div', { class: 'custom-slot' }, 'Custom Slot Content'),
      },
    })
    expect(wrapper.find('.custom-slot').exists()).toBe(true)
    expect(wrapper.find('.custom-slot').text()).toBe('Custom Slot Content')
    expect(wrapper.findAll('.el-timeline-item').length).toBe(0)
  })

  it('returns empty string when columns is empty array', () => {
    const [TimelineComp] = useTimeline({
      columns: [],
    })
    const wrapper = mount(TimelineComp)
    expect(wrapper.find('.el-timeline-item').exists()).toBe(false)
  })

  it('passes rest props to ElTimeline', () => {
    const [TimelineComp] = useTimeline({
      columns: [],
      reverse: true,
      mode: 'alternate',
    })
    const wrapper = mount(TimelineComp)
    const ul = wrapper.find('ul')
    expect(ul.attributes('data-reverse')).toBe('true')
    expect(ul.attributes('data-mode')).toBe('alternate')
  })

  it('passes column properties to ElTimelineItem', () => {
    const [TimelineComp] = useTimeline({
      columns: [
        {
          content: 'Custom node',
          timestamp: '2018-04-03 20:46',
          type: 'primary',
          color: '#0bbd87',
          size: 'large',
          hollow: true,
          placement: 'top',
          hideTimestamp: false,
          center: true,
        },
      ],
    })
    const wrapper = mount(TimelineComp)
    const item = wrapper.find('.el-timeline-item')
    expect(item.attributes('data-timestamp')).toBe('2018-04-03 20:46')
    expect(item.attributes('data-type')).toBe('primary')
    expect(item.attributes('data-color')).toBe('#0bbd87')
    expect(item.attributes('data-size')).toBe('large')
    expect(item.attributes('data-hollow')).toBe('true')
    expect(item.attributes('data-placement')).toBe('top')
    expect(item.attributes('data-center')).toBe('true')
  })

  it('handles undefined render function gracefully', () => {
    const [TimelineComp] = useTimeline({
      columns: [
        { content: 'test', render: undefined },
      ],
    })
    const wrapper = mount(TimelineComp)
    expect(wrapper.find('.el-timeline-item__wrapper').text()).toBe('test')
  })

  it('handles undefined renderDot function gracefully', () => {
    const [TimelineComp] = useTimeline({
      columns: [
        { content: 'test', renderDot: undefined },
      ],
    })
    const wrapper = mount(TimelineComp)
    expect(wrapper.find('.el-timeline-item__node').text()).toBe('')
  })

  it('handles null content gracefully', () => {
    const [TimelineComp] = useTimeline({
      columns: [
        { content: null as unknown as string },
      ],
    })
    const wrapper = mount(TimelineComp)
    expect(() => wrapper.find('.el-timeline-item__wrapper').text()).not.toThrow()
  })

  it('handles undefined content gracefully', () => {
    const [TimelineComp] = useTimeline({
      columns: [
        { content: undefined as unknown as string },
      ],
    })
    const wrapper = mount(TimelineComp)
    expect(() => wrapper.find('.el-timeline-item__wrapper').text()).not.toThrow()
  })

  it('supports component props passed during mount', () => {
    const [TimelineComp] = useTimeline({
      columns: [],
    })
    const wrapper = mount(TimelineComp, {
      props: {
        reverse: true,
        mode: 'end',
      },
    })
    const ul = wrapper.find('ul')
    expect(ul.attributes('data-reverse')).toBe('true')
    expect(ul.attributes('data-mode')).toBe('end')
  })

  it('component props override options props', () => {
    const [TimelineComp] = useTimeline({
      columns: [],
      reverse: false,
      mode: 'start',
    })
    const wrapper = mount(TimelineComp, {
      props: {
        reverse: true,
        mode: 'end',
      },
    })
    const ul = wrapper.find('ul')
    expect(ul.attributes('data-reverse')).toBe('true')
    expect(ul.attributes('data-mode')).toBe('end')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ name: 'async' }))
      useTimeline({
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
      useTimeline({
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
      useTimeline({
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
      useTimeline({
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
        { content: 'Async Event', timestamp: '2018-04-15' },
        { content: 'Async Approved', timestamp: '2018-04-13' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TimelineComp] = useTimeline({
        columns: [
          { content: 'Static Event', timestamp: '2018-04-15' },
        ],
        service: mockService,
      })
      const wrapper = mount(TimelineComp)
      const items = wrapper.findAll('.el-timeline-item')
      expect(items.length).toBe(2)
      expect(items[0].find('.el-timeline-item__wrapper').text()).toBe('Async Event')
      expect(items[1].find('.el-timeline-item__wrapper').text()).toBe('Async Approved')
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
      const [TimelineComp] = useTimeline({
        columns: [
          { content: 'Static Event', timestamp: '2018-04-15' },
        ],
        service: mockService,
      })
      const wrapper = mount(TimelineComp)
      const items = wrapper.findAll('.el-timeline-item')
      expect(items.length).toBe(1)
      expect(items[0].find('.el-timeline-item__wrapper').text()).toBe('Static Event')
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
      const [TimelineComp] = useTimeline({
        columns: [
          { content: 'Static Event', timestamp: '2018-04-15' },
        ],
        service: mockService,
      })
      const wrapper = mount(TimelineComp)
      const items = wrapper.findAll('.el-timeline-item')
      expect(items.length).toBe(1)
      expect(items[0].find('.el-timeline-item__wrapper').text()).toBe('Static Event')
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
      const [TimelineComp] = useTimeline({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(TimelineComp)
      const ul = wrapper.find('ul')
      expect(ul.attributes('data-loading')).toBe('true')
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
      const [TimelineComp] = useTimeline({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(TimelineComp)
      const ul = wrapper.find('ul')
      expect(ul.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [TimelineComp] = useTimeline({
        columns: [],
      })
      const wrapper = mount(TimelineComp)
      const ul = wrapper.find('ul')
      expect(ul.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static columns is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { content: 'Async Event', timestamp: '2018-04-15' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TimelineComp] = useTimeline({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(TimelineComp)
      const items = wrapper.findAll('.el-timeline-item')
      expect(items.length).toBe(1)
      expect(items[0].find('.el-timeline-item__wrapper').text()).toBe('Async Event')
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
      const [TimelineComp] = useTimeline({
        columns: [
          { content: 'Static Event', timestamp: '2018-04-15' },
        ],
        service: mockService,
      })
      const wrapper = mount(TimelineComp)
      const items = wrapper.findAll('.el-timeline-item')
      expect(items.length).toBe(0)
    })
  })
})
