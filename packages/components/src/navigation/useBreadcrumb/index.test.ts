// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuecraft/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useBreadcrumb } from './index'

vi.mock('element-plus', () => ({
  ElBreadcrumb: defineComponent({
    props: ['separator', 'separatorIcon'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-breadcrumb',
        'data-separator': props.separator || '',
        'data-separator-icon': props.separatorIcon ? String(props.separatorIcon) : '',
      }, [
        slots.default?.(),
      ])
    },
  }),
  ElBreadcrumbItem: defineComponent({
    props: ['to', 'replace'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-breadcrumb-item',
        'data-to': props.to ? JSON.stringify(props.to) : '',
        'data-replace': props.replace ? 'true' : '',
      }, [
        slots.default?.(),
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

describe('useBreadcrumb', () => {
  it('returns a component', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [],
    })
    expect(BreadcrumbComp).toBeDefined()
    expect(typeof BreadcrumbComp).toBe('object')
  })

  it('renders basic breadcrumb items with label', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [
        { label: 'homepage' },
        { label: 'promotion management' },
        { label: 'promotion list' },
        { label: 'promotion detail' },
      ],
    })
    const wrapper = mount(BreadcrumbComp)
    const items = wrapper.findAll('.el-breadcrumb-item')
    expect(items.length).toBe(4)
    expect(items[0].text()).toBe('homepage')
    expect(items[1].text()).toBe('promotion management')
    expect(items[2].text()).toBe('promotion list')
    expect(items[3].text()).toBe('promotion detail')
  })

  it('renders empty string when label is not provided and no render', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [
        {},
      ],
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb-item').text()).toBe('')
  })

  it('passes item to property to ElBreadcrumbItem', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [
        { label: 'homepage', to: { path: '/' } },
      ],
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb-item').attributes('data-to')).toBe(JSON.stringify({ path: '/' }))
  })

  it('passes item replace property to ElBreadcrumbItem', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [
        { label: 'homepage', to: { path: '/' }, replace: true },
      ],
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb-item').attributes('data-replace')).toBe('true')
  })

  it('does not set replace when replace is false', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [
        { label: 'homepage', replace: false },
      ],
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb-item').attributes('data-replace')).toBe('')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Custom: ${(val as { label: string }).label}`))
    const [BreadcrumbComp] = useBreadcrumb({
      items: [
        { label: 'Item 1', render: customRender },
      ],
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Custom: Item 1')
    expect(customRender).toHaveBeenCalled()
  })

  it('handles undefined render function gracefully', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [
        { label: 'Item 1', render: undefined },
      ],
    })
    const wrapper = mount(BreadcrumbComp)
    expect(() => wrapper.find('.el-breadcrumb-item').text()).not.toThrow()
    expect(wrapper.find('.el-breadcrumb-item').text()).toBe('Item 1')
  })

  it('passes separator to ElBreadcrumb', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [],
      separator: '>',
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb').attributes('data-separator')).toBe('>')
  })

  it('passes separatorIcon to ElBreadcrumb', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [],
      separatorIcon: 'ArrowRight',
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb').attributes('data-separator-icon')).toBe('ArrowRight')
  })

  it('renders default slot content when provided', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [],
    })
    const wrapper = mount(BreadcrumbComp, {
      slots: {
        default: () => h('div', { class: 'custom-breadcrumb-content' }, 'Custom Content'),
      },
    })
    expect(wrapper.find('.custom-breadcrumb-content').exists()).toBe(true)
    expect(wrapper.find('.el-breadcrumb-item').exists()).toBe(false)
  })

  it('returns empty when items is empty array', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [],
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb-item').exists()).toBe(false)
  })

  it('passes rest props to ElBreadcrumb', () => {
    const [BreadcrumbComp] = useBreadcrumb({
      items: [],
      separator: '|',
    })
    const wrapper = mount(BreadcrumbComp)
    expect(wrapper.find('.el-breadcrumb').attributes('data-separator')).toBe('|')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve([]))
      useBreadcrumb({
        items: [],
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
      useBreadcrumb({
        items: [],
        service: mockService,
        params: mockParams,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        defaultParams: mockParams,
      }))
    })

    it('passes formatData to useRequest', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockFormatData = vi.fn(() => [{ label: 'Item 1' }])
      useBreadcrumb({
        items: [],
        service: mockService,
        formatData: mockFormatData,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        formatData: mockFormatData,
      }))
    })

    it('passes formatData as undefined when formatData is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      useBreadcrumb({
        items: [],
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
        { label: 'Async Item 1' },
        { label: 'Async Item 2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [BreadcrumbComp] = useBreadcrumb({
        items: [
          { label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      const items = wrapper.findAll('.el-breadcrumb-item')
      expect(items.length).toBe(2)
      expect(items[0].text()).toBe('Async Item 1')
      expect(items[1].text()).toBe('Async Item 2')
    })

    it('falls back to static items when data.value is null', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(null)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [BreadcrumbComp] = useBreadcrumb({
        items: [
          { label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      const items = wrapper.findAll('.el-breadcrumb-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Static Item 1')
    })

    it('falls back to static items when data.value is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(undefined)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [BreadcrumbComp] = useBreadcrumb({
        items: [
          { label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      const items = wrapper.findAll('.el-breadcrumb-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Static Item 1')
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
      const [BreadcrumbComp] = useBreadcrumb({
        items: [],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      expect(wrapper.find('.el-breadcrumb').attributes('data-loading')).toBe('true')
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
      const [BreadcrumbComp] = useBreadcrumb({
        items: [],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      expect(wrapper.find('.el-breadcrumb').attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [BreadcrumbComp] = useBreadcrumb({
        items: [],
      })
      const wrapper = mount(BreadcrumbComp)
      expect(wrapper.find('.el-breadcrumb').attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static items is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { label: 'Async Item 1' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [BreadcrumbComp] = useBreadcrumb({
        items: [],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      const items = wrapper.findAll('.el-breadcrumb-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Async Item 1')
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
      const [BreadcrumbComp] = useBreadcrumb({
        items: [
          { label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      expect(wrapper.findAll('.el-breadcrumb-item').length).toBe(0)
    })

    it('renders async items with to and replace properties', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { label: 'homepage', to: { path: '/' }, replace: true },
        { label: 'current' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [BreadcrumbComp] = useBreadcrumb({
        items: [],
        service: mockService,
      })
      const wrapper = mount(BreadcrumbComp)
      const items = wrapper.findAll('.el-breadcrumb-item')
      expect(items.length).toBe(2)
      expect(items[0].text()).toBe('homepage')
      expect(items[0].attributes('data-to')).toBe(JSON.stringify({ path: '/' }))
      expect(items[0].attributes('data-replace')).toBe('true')
      expect(items[1].text()).toBe('current')
      expect(items[1].attributes('data-to')).toBe('')
    })
  })
})
