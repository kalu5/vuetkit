// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useCollapse } from './index'

vi.mock('element-plus', () => ({
  ElCollapse: defineComponent({
    props: ['modelValue', 'accordion', 'expandIconPosition', 'beforeCollapse'],
    emits: ['update:modelValue', 'change'],
    setup(props, { slots, emit }) {
      const triggerChange = () => {
        const next = props.accordion ? '2' : ['2']
        emit('update:modelValue', next)
        emit('change', next)
      }
      return () => h('div', {
        'class': 'el-collapse',
        'data-model-value': JSON.stringify(props.modelValue ?? null),
        'data-accordion': props.accordion ? 'true' : 'false',
        'data-expand-icon-position': props.expandIconPosition || '',
      }, [
        slots.default?.(),
        h('button', { class: 'mock-trigger', onClick: triggerChange }, 'Trigger'),
      ])
    },
  }),
  ElCollapseItem: defineComponent({
    props: ['title', 'name', 'disabled', 'icon'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-collapse-item',
        'data-title': props.title || '',
        'data-name': props.name != null ? String(props.name) : '',
        'data-disabled': props.disabled ? 'true' : 'false',
      }, [
        h('div', { class: 'el-collapse-item__header' }, slots.title?.()),
        h('div', { class: 'el-collapse-item__icon' }, slots.icon?.()),
        h('div', { class: 'el-collapse-item__content' }, slots.default?.()),
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

describe('useCollapse', () => {
  it('returns a component and active ref', () => {
    const [CollapseComp, activeNames] = useCollapse({
      columns: [],
    })
    expect(CollapseComp).toBeDefined()
    expect(typeof CollapseComp).toBe('object')
    expect(activeNames).toBeDefined()
    expect(activeNames.value).toEqual([])
  })

  it('renders basic columns with title and name', () => {
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1' },
        { title: 'Feedback', name: '2' },
      ],
    })
    const wrapper = mount(CollapseComp)
    const items = wrapper.findAll('.el-collapse-item')
    expect(items.length).toBe(2)
    expect(items[0].attributes('data-title')).toBe('Consistency')
    expect(items[1].attributes('data-title')).toBe('Feedback')
    expect(items[0].attributes('data-name')).toBe('1')
    expect(items[1].attributes('data-name')).toBe('2')
  })

  it('uses index as name when name is not provided', () => {
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency' },
        { title: 'Feedback' },
      ],
    })
    const wrapper = mount(CollapseComp)
    const items = wrapper.findAll('.el-collapse-item')
    expect(items[0].attributes('data-name')).toBe('0')
    expect(items[1].attributes('data-name')).toBe('1')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-content' }, 'Rendered Content'))
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1', render: customRender },
      ],
    })
    const wrapper = mount(CollapseComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered Content')
    expect(customRender).toHaveBeenCalled()
  })

  it('uses custom renderTitle function for item title', () => {
    const customTitleRender = vi.fn((val: unknown) => h('span', { class: 'custom-title' }, `Title: ${val}`))
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1', renderTitle: customTitleRender },
      ],
    })
    const wrapper = mount(CollapseComp)
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('Title: Consistency')
    expect(customTitleRender).toHaveBeenCalledWith('Consistency')
  })

  it('uses custom renderIcon function for item icon', () => {
    const customIconRender = vi.fn(() => h('span', { class: 'custom-icon' }, 'Icon'))
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1', renderIcon: customIconRender },
      ],
    })
    const wrapper = mount(CollapseComp)
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').text()).toBe('Icon')
    expect(customIconRender).toHaveBeenCalled()
  })

  it('supports default slot content when provided', () => {
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1' },
      ],
    })
    const wrapper = mount(CollapseComp, {
      slots: {
        default: () => h('div', { class: 'custom-slot' }, 'Custom Slot Content'),
      },
    })
    expect(wrapper.find('.custom-slot').exists()).toBe(true)
    expect(wrapper.find('.custom-slot').text()).toBe('Custom Slot Content')
    expect(wrapper.findAll('.el-collapse-item').length).toBe(0)
  })

  it('returns empty string when columns is empty array', () => {
    const [CollapseComp] = useCollapse({
      columns: [],
    })
    const wrapper = mount(CollapseComp)
    expect(wrapper.find('.el-collapse-item').exists()).toBe(false)
  })

  it('passes rest props to ElCollapse', () => {
    const [CollapseComp] = useCollapse({
      columns: [],
      accordion: true,
      expandIconPosition: 'right',
    })
    const wrapper = mount(CollapseComp)
    const collapse = wrapper.find('.el-collapse')
    expect(collapse.attributes('data-accordion')).toBe('true')
    expect(collapse.attributes('data-expand-icon-position')).toBe('right')
  })

  it('passes column properties to ElCollapseItem', () => {
    const [CollapseComp] = useCollapse({
      columns: [
        {
          title: 'Consistency',
          name: '1',
          disabled: true,
        },
      ],
    })
    const wrapper = mount(CollapseComp)
    const item = wrapper.find('.el-collapse-item')
    expect(item.attributes('data-title')).toBe('Consistency')
    expect(item.attributes('data-name')).toBe('1')
    expect(item.attributes('data-disabled')).toBe('true')
  })

  it('handles undefined render function gracefully', () => {
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1', render: undefined },
      ],
    })
    const wrapper = mount(CollapseComp)
    expect(() => wrapper.find('.el-collapse-item__content').text()).not.toThrow()
  })

  it('handles undefined renderTitle function gracefully', () => {
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1', renderTitle: undefined },
      ],
    })
    const wrapper = mount(CollapseComp)
    expect(() => wrapper.find('.el-collapse-item__header').text()).not.toThrow()
  })

  it('handles undefined renderIcon function gracefully', () => {
    const [CollapseComp] = useCollapse({
      columns: [
        { title: 'Consistency', name: '1', renderIcon: undefined },
      ],
    })
    const wrapper = mount(CollapseComp)
    expect(() => wrapper.find('.el-collapse-item__icon').text()).not.toThrow()
  })

  it('supports component props passed during mount', () => {
    const [CollapseComp] = useCollapse({
      columns: [],
    })
    const wrapper = mount(CollapseComp, {
      props: {
        accordion: true,
      },
    })
    const collapse = wrapper.find('.el-collapse')
    expect(collapse.attributes('data-accordion')).toBe('true')
  })

  it('component props override options props', () => {
    const [CollapseComp] = useCollapse({
      columns: [],
      accordion: false,
    })
    const wrapper = mount(CollapseComp, {
      props: {
        accordion: true,
      },
    })
    const collapse = wrapper.find('.el-collapse')
    expect(collapse.attributes('data-accordion')).toBe('true')
  })

  describe('v-model', () => {
    it('uses defaultActive as initial value', () => {
      const [CollapseComp, activeNames] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
          { title: 'Feedback', name: '2' },
        ],
        defaultActive: ['1'],
      })
      const wrapper = mount(CollapseComp)
      expect(activeNames.value).toEqual(['1'])
      expect(wrapper.find('.el-collapse').attributes('data-model-value')).toBe(JSON.stringify(['1']))
    })

    it('uses defaultActive string for accordion mode', () => {
      const [CollapseComp, activeNames] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
          { title: 'Feedback', name: '2' },
        ],
        defaultActive: '1',
        accordion: true,
      })
      const wrapper = mount(CollapseComp)
      expect(activeNames.value).toBe('1')
      expect(wrapper.find('.el-collapse').attributes('data-model-value')).toBe(JSON.stringify('1'))
    })

    it('uses modelValue prop when provided', () => {
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
          { title: 'Feedback', name: '2' },
        ],
        defaultActive: ['1'],
      })
      const wrapper = mount(CollapseComp, {
        props: {
          modelValue: ['2'],
        },
      })
      expect(wrapper.find('.el-collapse').attributes('data-model-value')).toBe(JSON.stringify(['2']))
    })

    it('modelValue prop overrides defaultActive', () => {
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
          { title: 'Feedback', name: '2' },
        ],
        defaultActive: ['1'],
      })
      const wrapper = mount(CollapseComp, {
        props: {
          modelValue: ['2'],
        },
      })
      expect(wrapper.find('.el-collapse').attributes('data-model-value')).toBe(JSON.stringify(['2']))
    })
  })

  describe('events', () => {
    it('triggers onChange callback when active changes', async () => {
      const onChange = vi.fn()
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
        ],
        onChange,
      })
      const wrapper = mount(CollapseComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(onChange).toHaveBeenCalledWith(['2'])
    })

    it('updates activeNames ref when active changes', async () => {
      const [CollapseComp, activeNames] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
        ],
        defaultActive: [],
      })
      const wrapper = mount(CollapseComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(activeNames.value).toEqual(['2'])
    })

    it('emits change event when active changes', async () => {
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
        ],
      })
      const wrapper = mount(CollapseComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')![0]).toEqual([['2']])
    })

    it('uses accordion value in accordion mode', async () => {
      const onChange = vi.fn()
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Consistency', name: '1' },
        ],
        accordion: true,
        onChange,
      })
      const wrapper = mount(CollapseComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(onChange).toHaveBeenCalledWith('2')
    })
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ name: 'async' }))
      useCollapse({
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
      useCollapse({
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
      const mockFormatData = vi.fn(() => [{ title: 'Name', name: '1' }])
      useCollapse({
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
      useCollapse({
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
        { title: 'Async Title', name: 'a1' },
        { title: 'Async Title 2', name: 'a2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Static Title', name: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(CollapseComp)
      const items = wrapper.findAll('.el-collapse-item')
      expect(items.length).toBe(2)
      expect(items[0].attributes('data-title')).toBe('Async Title')
      expect(items[1].attributes('data-title')).toBe('Async Title 2')
      expect(items[0].attributes('data-name')).toBe('a1')
      expect(items[1].attributes('data-name')).toBe('a2')
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
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Static Title', name: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(CollapseComp)
      const items = wrapper.findAll('.el-collapse-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-title')).toBe('Static Title')
      expect(items[0].attributes('data-name')).toBe('s1')
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
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Static Title', name: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(CollapseComp)
      const items = wrapper.findAll('.el-collapse-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-title')).toBe('Static Title')
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
      const [CollapseComp] = useCollapse({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(CollapseComp)
      const collapse = wrapper.find('.el-collapse')
      expect(collapse.attributes('data-loading')).toBe('true')
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
      const [CollapseComp] = useCollapse({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(CollapseComp)
      const collapse = wrapper.find('.el-collapse')
      expect(collapse.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [CollapseComp] = useCollapse({
        columns: [],
      })
      const wrapper = mount(CollapseComp)
      const collapse = wrapper.find('.el-collapse')
      expect(collapse.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static columns is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { title: 'Async Title', name: 'a1' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [CollapseComp] = useCollapse({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(CollapseComp)
      const items = wrapper.findAll('.el-collapse-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-title')).toBe('Async Title')
      expect(items[0].attributes('data-name')).toBe('a1')
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
      const [CollapseComp] = useCollapse({
        columns: [
          { title: 'Static Title', name: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(CollapseComp)
      const items = wrapper.findAll('.el-collapse-item')
      expect(items.length).toBe(0)
    })
  })
})
