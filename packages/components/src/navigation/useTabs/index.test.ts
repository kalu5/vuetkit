// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuecraft/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useTabs } from './index'

vi.mock('element-plus', () => ({
  ElTabs: defineComponent({
    props: ['modelValue', 'type', 'closable', 'addable', 'editable', 'tabPosition', 'stretch'],
    setup(props, { slots, emit }) {
      const localValue = ref(props.modelValue ?? 0)
      return () => h('div', {
        'class': 'el-tabs',
        'data-model-value': props.modelValue != null ? String(props.modelValue) : '',
        'data-type': props.type || '',
        'data-tab-position': props.tabPosition || '',
        'data-stretch': props.stretch ? 'true' : '',
        'onClick': () => {
          localValue.value = localValue.value === 0 ? 1 : 0
          emit('update:modelValue', localValue.value)
        },
      }, [
        slots.default?.(),
      ])
    },
  }),
  ElTabPane: defineComponent({
    props: ['label', 'name', 'disabled', 'closable', 'lazy'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-tab-pane',
        'data-label': props.label || '',
        'data-name': props.name != null ? String(props.name) : '',
        'data-disabled': props.disabled ? 'true' : '',
        'data-closable': props.closable ? 'true' : '',
      }, [
        h('div', { class: 'el-tab-pane__label' }, slots.label ? slots.label() : props.label),
        h('div', { class: 'el-tab-pane__content' }, slots.default?.()),
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

describe('useTabs', () => {
  it('returns a component and activeName ref', () => {
    const [TabsComp, activeName] = useTabs({
      tabs: [],
    })
    expect(TabsComp).toBeDefined()
    expect(typeof TabsComp).toBe('object')
    expect(activeName).toBeDefined()
    expect(activeName.value).toBe(0)
  })

  it('uses defaultActive when provided as number', () => {
    const [, activeName] = useTabs({
      tabs: [],
      defaultActive: 1,
    })
    expect(activeName.value).toBe(1)
  })

  it('uses defaultActive when provided as string', () => {
    const [, activeName] = useTabs({
      tabs: [],
      defaultActive: 'first',
    })
    expect(activeName.value).toBe('first')
  })

  it('binds modelValue to ElTabs', () => {
    const [TabsComp] = useTabs({
      tabs: [],
      defaultActive: 'second',
    })
    const wrapper = mount(TabsComp)
    const el = wrapper.find('.el-tabs')
    expect(el.attributes('data-model-value')).toBe('second')
  })

  it('updates activeName ref when component emits update:modelValue', () => {
    const [TabsComp, activeName] = useTabs({
      tabs: [],
      defaultActive: 0,
    })
    const wrapper = mount(TabsComp)
    expect(activeName.value).toBe(0)
    const el = wrapper.find('.el-tabs')
    el.trigger('click')
    expect(activeName.value).toBe(1)
    el.trigger('click')
    expect(activeName.value).toBe(0)
  })

  it('updates component when activeName ref is changed externally', async () => {
    const [TabsComp, activeName] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first' },
        { label: 'Tab 2', name: 'second' },
      ],
      defaultActive: 'first',
    })
    const wrapper = mount(TabsComp)
    expect(wrapper.find('.el-tabs').attributes('data-model-value')).toBe('first')
    activeName.value = 'second'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-tabs').attributes('data-model-value')).toBe('second')
  })

  it('renders basic tabs with label and name', () => {
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first' },
        { label: 'Tab 2', name: 'second' },
      ],
    })
    const wrapper = mount(TabsComp)
    const items = wrapper.findAll('.el-tab-pane')
    expect(items.length).toBe(2)
    expect(items[0].attributes('data-label')).toBe('Tab 1')
    expect(items[1].attributes('data-label')).toBe('Tab 2')
    expect(items[0].attributes('data-name')).toBe('first')
    expect(items[1].attributes('data-name')).toBe('second')
  })

  it('uses index as name when name is not provided', () => {
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1' },
        { label: 'Tab 2' },
      ],
    })
    const wrapper = mount(TabsComp)
    const items = wrapper.findAll('.el-tab-pane')
    expect(items[0].attributes('data-name')).toBe('0')
    expect(items[1].attributes('data-name')).toBe('1')
  })

  it('uses custom render function for tab content', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Rendered: ${(val as { label: string }).label}`))
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first', render: customRender },
      ],
    })
    const wrapper = mount(TabsComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered: Tab 1')
    expect(customRender).toHaveBeenCalled()
  })

  it('uses custom renderLabel function for tab label', () => {
    const customLabelRender = vi.fn((val: unknown) => h('span', { class: 'custom-label' }, `Label: ${val}`))
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first', renderLabel: customLabelRender },
      ],
    })
    const wrapper = mount(TabsComp)
    expect(wrapper.find('.custom-label').exists()).toBe(true)
    expect(wrapper.find('.custom-label').text()).toBe('Label: Tab 1')
    expect(customLabelRender).toHaveBeenCalledWith('Tab 1')
  })

  it('supports both render and renderLabel functions', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-content' }, 'Content'))
    const customLabelRender = vi.fn(() => h('span', { class: 'custom-label' }, 'Label'))
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first', render: customRender, renderLabel: customLabelRender },
      ],
    })
    const wrapper = mount(TabsComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-label').exists()).toBe(true)
    expect(customRender).toHaveBeenCalled()
    expect(customLabelRender).toHaveBeenCalled()
  })

  it('renders default slot content when provided', () => {
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first' },
      ],
    })
    const wrapper = mount(TabsComp, {
      slots: {
        default: () => h('div', { class: 'custom-slot' }, 'Custom Slot Content'),
      },
    })
    expect(wrapper.find('.custom-slot').exists()).toBe(true)
    expect(wrapper.find('.custom-slot').text()).toBe('Custom Slot Content')
    expect(wrapper.findAll('.el-tab-pane').length).toBe(0)
  })

  it('returns empty string when tabs is empty array', () => {
    const [TabsComp] = useTabs({
      tabs: [],
    })
    const wrapper = mount(TabsComp)
    expect(wrapper.find('.el-tab-pane').exists()).toBe(false)
  })

  it('passes rest props to ElTabs', () => {
    const [TabsComp] = useTabs({
      tabs: [],
      type: 'card',
      tabPosition: 'left',
      stretch: true,
    })
    const wrapper = mount(TabsComp)
    const el = wrapper.find('.el-tabs')
    expect(el.attributes('data-type')).toBe('card')
    expect(el.attributes('data-tab-position')).toBe('left')
    expect(el.attributes('data-stretch')).toBe('true')
  })

  it('passes tab properties to ElTabPane', () => {
    const [TabsComp] = useTabs({
      tabs: [
        {
          label: 'Tab 1',
          name: 'first',
          disabled: true,
          closable: true,
        },
      ],
    })
    const wrapper = mount(TabsComp)
    const item = wrapper.find('.el-tab-pane')
    expect(item.attributes('data-label')).toBe('Tab 1')
    expect(item.attributes('data-name')).toBe('first')
    expect(item.attributes('data-disabled')).toBe('true')
    expect(item.attributes('data-closable')).toBe('true')
  })

  it('handles undefined render function gracefully', () => {
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first', render: undefined },
      ],
    })
    const wrapper = mount(TabsComp)
    expect(() => wrapper.find('.el-tab-pane__content').text()).not.toThrow()
  })

  it('handles undefined renderLabel function gracefully', () => {
    const [TabsComp] = useTabs({
      tabs: [
        { label: 'Tab 1', name: 'first', renderLabel: undefined },
      ],
    })
    const wrapper = mount(TabsComp)
    expect(wrapper.find('.el-tab-pane__label').text()).toBe('Tab 1')
  })

  it('supports component props passed during mount', () => {
    const [TabsComp] = useTabs({
      tabs: [],
    })
    const wrapper = mount(TabsComp, {
      props: {
        modelValue: 'second',
        type: 'card',
      },
    })
    const el = wrapper.find('.el-tabs')
    expect(el.attributes('data-model-value')).toBe('second')
    expect(el.attributes('data-type')).toBe('card')
  })

  it('component props override options props', () => {
    const [TabsComp] = useTabs({
      tabs: [],
      modelValue: 'first',
      type: '',
    })
    const wrapper = mount(TabsComp, {
      props: {
        modelValue: 'second',
        type: 'card',
      },
    })
    const el = wrapper.find('.el-tabs')
    expect(el.attributes('data-model-value')).toBe('second')
    expect(el.attributes('data-type')).toBe('card')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ tabs: [] }))
      useTabs({
        tabs: [],
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
      useTabs({
        tabs: [],
        service: mockService,
        params: mockParams,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        defaultParams: mockParams,
      }))
    })

    it('passes formatData to useRequest', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockFormatData = vi.fn(() => [{ label: 'Tab 1', name: 'first' }])
      useTabs({
        tabs: [],
        service: mockService,
        formatData: mockFormatData,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        formatData: mockFormatData,
      }))
    })

    it('passes formatData as undefined when formatData is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      useTabs({
        tabs: [],
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
        { label: 'Async Tab 1', name: 'async-first' },
        { label: 'Async Tab 2', name: 'async-second' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TabsComp] = useTabs({
        tabs: [
          { label: 'Static Tab 1', name: 'static-first' },
        ],
        service: mockService,
      })
      const wrapper = mount(TabsComp)
      const items = wrapper.findAll('.el-tab-pane')
      expect(items.length).toBe(2)
      expect(items[0].attributes('data-label')).toBe('Async Tab 1')
      expect(items[1].attributes('data-label')).toBe('Async Tab 2')
      expect(items[0].attributes('data-name')).toBe('async-first')
      expect(items[1].attributes('data-name')).toBe('async-second')
    })

    it('falls back to static tabs when data.value is null', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(null)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TabsComp] = useTabs({
        tabs: [
          { label: 'Static Tab 1', name: 'static-first' },
        ],
        service: mockService,
      })
      const wrapper = mount(TabsComp)
      const items = wrapper.findAll('.el-tab-pane')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Static Tab 1')
      expect(items[0].attributes('data-name')).toBe('static-first')
    })

    it('falls back to static tabs when data.value is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(undefined)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TabsComp] = useTabs({
        tabs: [
          { label: 'Static Tab 1', name: 'static-first' },
        ],
        service: mockService,
      })
      const wrapper = mount(TabsComp)
      const items = wrapper.findAll('.el-tab-pane')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Static Tab 1')
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
      const [TabsComp] = useTabs({
        tabs: [],
        service: mockService,
      })
      const wrapper = mount(TabsComp)
      const el = wrapper.find('.el-tabs')
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
      const [TabsComp] = useTabs({
        tabs: [],
        service: mockService,
      })
      const wrapper = mount(TabsComp)
      const el = wrapper.find('.el-tabs')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [TabsComp] = useTabs({
        tabs: [],
      })
      const wrapper = mount(TabsComp)
      const el = wrapper.find('.el-tabs')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static tabs is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { label: 'Async Tab 1', name: 'async-first' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TabsComp] = useTabs({
        tabs: [],
        service: mockService,
      })
      const wrapper = mount(TabsComp)
      const items = wrapper.findAll('.el-tab-pane')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Async Tab 1')
      expect(items[0].attributes('data-name')).toBe('async-first')
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
      const [TabsComp] = useTabs({
        tabs: [
          { label: 'Static Tab 1', name: 'static-first' },
        ],
        service: mockService,
      })
      const wrapper = mount(TabsComp)
      const items = wrapper.findAll('.el-tab-pane')
      expect(items.length).toBe(0)
    })
  })
})
