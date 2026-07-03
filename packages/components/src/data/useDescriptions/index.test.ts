// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useDescriptions } from './index'

vi.mock('element-plus', () => ({
  ElDescriptions: defineComponent({
    props: ['border', 'column', 'size', 'title', 'extra', 'columnSpacing', 'direction', 'align', 'labelAlign'],
    setup(props, { slots }) {
      return () => h('dl', {
        'data-border': props.border ? 'true' : 'false',
        'data-column': props.column != null ? String(props.column) : '',
        'data-size': props.size || '',
        'data-title': props.title || '',
        'data-extra': props.extra || '',
      }, [
        slots.title?.(),
        slots.extra?.(),
        slots.default?.(),
      ])
    },
  }),
  ElDescriptionsItem: defineComponent({
    props: ['label', 'span', 'width', 'align', 'labelAlign', 'className', 'labelClassName'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-descriptions-item',
        'data-label': props.label || '',
        'data-span': props.span != null ? String(props.span) : '',
        'data-width': props.width || '',
      }, [
        h('dt', { class: 'el-descriptions-item__label' }, slots.label?.()),
        h('dd', { class: 'el-descriptions-item__content' }, slots.default?.()),
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

describe('useDescriptions', () => {
  it('returns a component', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [],
    })
    expect(DescriptionsComp).toBeDefined()
    expect(typeof DescriptionsComp).toBe('object')
  })

  it('renders basic columns with label and value', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: 'vuetkit' },
        { label: 'Age', value: '25' },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    const items = wrapper.findAll('.el-descriptions-item')
    expect(items.length).toBe(2)
    expect(items[0].attributes('data-label')).toBe('Name')
    expect(items[1].attributes('data-label')).toBe('Age')
    expect(items[0].find('.el-descriptions-item__content').text()).toBe('vuetkit')
    expect(items[1].find('.el-descriptions-item__content').text()).toBe('25')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Rendered: ${val}`))
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: 'test', render: customRender },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered: test')
    expect(customRender).toHaveBeenCalledWith('test')
  })

  it('uses custom renderLabel function for item label', () => {
    const customLabelRender = vi.fn((val: unknown) => h('span', { class: 'custom-label' }, `Label: ${val}`))
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: 'test', renderLabel: customLabelRender },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    expect(wrapper.find('.custom-label').exists()).toBe(true)
    expect(wrapper.find('.custom-label').text()).toBe('Label: Name')
    expect(customLabelRender).toHaveBeenCalledWith('Name')
  })

  it('supports both render and renderLabel functions', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-content' }, 'Content'))
    const customLabelRender = vi.fn(() => h('span', { class: 'custom-label' }, 'Label'))
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: 'test', render: customRender, renderLabel: customLabelRender },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-label').exists()).toBe(true)
    expect(customRender).toHaveBeenCalled()
    expect(customLabelRender).toHaveBeenCalled()
  })

  it('renders default slot content when provided', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: 'should-not-show' },
      ],
    })
    const wrapper = mount(DescriptionsComp, {
      slots: {
        default: () => h('div', { class: 'custom-slot' }, 'Custom Slot Content'),
      },
    })
    expect(wrapper.find('.custom-slot').exists()).toBe(true)
    expect(wrapper.find('.custom-slot').text()).toBe('Custom Slot Content')
    expect(wrapper.findAll('.el-descriptions-item').length).toBe(0)
  })

  it('returns empty string when columns is empty array', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [],
    })
    const wrapper = mount(DescriptionsComp)
    expect(wrapper.find('.el-descriptions-item').exists()).toBe(false)
  })

  it('passes rest props to ElDescriptions', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [],
      border: true,
      column: 3,
      size: 'small',
    })
    const wrapper = mount(DescriptionsComp)
    const dl = wrapper.find('dl')
    expect(dl.attributes('data-border')).toBe('true')
    expect(dl.attributes('data-column')).toBe('3')
    expect(dl.attributes('data-size')).toBe('small')
  })

  it('supports title slot', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [],
    })
    const wrapper = mount(DescriptionsComp, {
      slots: {
        title: () => h('div', { class: 'custom-title' }, 'Custom Title'),
      },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('Custom Title')
  })

  it('supports extra slot', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [],
    })
    const wrapper = mount(DescriptionsComp, {
      slots: {
        extra: () => h('div', { class: 'custom-extra' }, 'Custom Extra'),
      },
    })
    expect(wrapper.find('.custom-extra').exists()).toBe(true)
    expect(wrapper.find('.custom-extra').text()).toBe('Custom Extra')
  })

  it('passes column properties to ElDescriptionsItem', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [
        {
          label: 'Name',
          value: 'test',
          span: 2,
          width: '100px',
        },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    const item = wrapper.find('.el-descriptions-item')
    expect(item.attributes('data-label')).toBe('Name')
    expect(item.attributes('data-span')).toBe('2')
    expect(item.attributes('data-width')).toBe('100px')
  })

  it('handles undefined render function gracefully', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: 'test', render: undefined },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    expect(wrapper.find('.el-descriptions-item__content').text()).toBe('test')
  })

  it('handles undefined renderLabel function gracefully', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: 'test', renderLabel: undefined },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    expect(wrapper.find('.el-descriptions-item__label').text()).toBe('')
  })

  it('handles null item value gracefully', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: null as unknown as string },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    expect(() => wrapper.find('.el-descriptions-item__content').text()).not.toThrow()
  })

  it('handles undefined item value gracefully', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [
        { label: 'Name', value: undefined as unknown as string },
      ],
    })
    const wrapper = mount(DescriptionsComp)
    expect(() => wrapper.find('.el-descriptions-item__content').text()).not.toThrow()
  })

  it('supports component props passed during mount', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [],
    })
    const wrapper = mount(DescriptionsComp, {
      props: {
        border: true,
        column: 4,
      },
    })
    const dl = wrapper.find('dl')
    expect(dl.attributes('data-border')).toBe('true')
    expect(dl.attributes('data-column')).toBe('4')
  })

  it('component props override options props', () => {
    const [DescriptionsComp] = useDescriptions({
      columns: [],
      border: false,
      column: 2,
    })
    const wrapper = mount(DescriptionsComp, {
      props: {
        border: true,
        column: 4,
      },
    })
    const dl = wrapper.find('dl')
    expect(dl.attributes('data-border')).toBe('true')
    expect(dl.attributes('data-column')).toBe('4')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ name: 'async', age: 25 }))
      useDescriptions({
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
      useDescriptions({
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
      const mockFormatData = vi.fn(() => [{ label: 'Name', value: 'test' }])
      useDescriptions({
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
      useDescriptions({
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
        { label: 'Async Name', value: 'async-value' },
        { label: 'Async Age', value: '30' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [DescriptionsComp] = useDescriptions({
        columns: [
          { label: 'Static Name', value: 'static-value' },
        ],
        service: mockService,
      })
      const wrapper = mount(DescriptionsComp)
      const items = wrapper.findAll('.el-descriptions-item')
      expect(items.length).toBe(2)
      expect(items[0].attributes('data-label')).toBe('Async Name')
      expect(items[1].attributes('data-label')).toBe('Async Age')
      expect(items[0].find('.el-descriptions-item__content').text()).toBe('async-value')
      expect(items[1].find('.el-descriptions-item__content').text()).toBe('30')
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
      const [DescriptionsComp] = useDescriptions({
        columns: [
          { label: 'Static Name', value: 'static-value' },
        ],
        service: mockService,
      })
      const wrapper = mount(DescriptionsComp)
      const items = wrapper.findAll('.el-descriptions-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Static Name')
      expect(items[0].find('.el-descriptions-item__content').text()).toBe('static-value')
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
      const [DescriptionsComp] = useDescriptions({
        columns: [
          { label: 'Static Name', value: 'static-value' },
        ],
        service: mockService,
      })
      const wrapper = mount(DescriptionsComp)
      const items = wrapper.findAll('.el-descriptions-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Static Name')
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
      const [DescriptionsComp] = useDescriptions({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(DescriptionsComp)
      const dl = wrapper.find('dl')
      expect(dl.attributes('data-loading')).toBe('true')
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
      const [DescriptionsComp] = useDescriptions({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(DescriptionsComp)
      const dl = wrapper.find('dl')
      expect(dl.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [DescriptionsComp] = useDescriptions({
        columns: [],
      })
      const wrapper = mount(DescriptionsComp)
      const dl = wrapper.find('dl')
      expect(dl.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static columns is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { label: 'Async Name', value: 'async-value' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [DescriptionsComp] = useDescriptions({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(DescriptionsComp)
      const items = wrapper.findAll('.el-descriptions-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Async Name')
      expect(items[0].find('.el-descriptions-item__content').text()).toBe('async-value')
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
      const [DescriptionsComp] = useDescriptions({
        columns: [
          { label: 'Static Name', value: 'static-value' },
        ],
        service: mockService,
      })
      const wrapper = mount(DescriptionsComp)
      const items = wrapper.findAll('.el-descriptions-item')
      expect(items.length).toBe(0)
    })
  })
})
