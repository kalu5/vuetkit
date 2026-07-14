// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useSegmented } from './index'

vi.mock('element-plus', () => ({
  ElSegmented: defineComponent({
    props: ['modelValue', 'options', 'props', 'size', 'block', 'disabled', 'validateEvent', 'name', 'id', 'ariaLabel', 'direction'],
    emits: ['update:modelValue', 'change'],
    setup(props, { slots, emit }) {
      const triggerChange = () => {
        const next = 'changed-value'
        emit('update:modelValue', next)
        emit('change', next)
      }
      return () => h('div', {
        'class': 'el-segmented',
        'data-model-value': props.modelValue != null ? String(props.modelValue) : '',
        'data-size': props.size || '',
        'data-block': props.block ? 'true' : 'false',
        'data-disabled': props.disabled ? 'true' : 'false',
        'data-direction': props.direction || '',
        'data-name': props.name || '',
        'data-id': props.id || '',
      }, [
        ...(props.options || []).map((opt: any, index: number) => {
          const item = typeof opt === 'object' && opt !== null ? opt : { value: opt, label: String(opt) }
          return h('div', {
            'class': 'el-segmented-item',
            'key': index,
            'data-value': item.value != null ? String(item.value) : '',
            'data-label': item.label || '',
            'data-disabled': item.disabled ? 'true' : 'false',
          }, slots.default ? [slots.default({ item: opt })] : [item.label || String(item.value ?? '')])
        }),
        h('button', { class: 'mock-trigger', onClick: triggerChange }, 'Trigger'),
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

describe('useSegmented', () => {
  it('returns a component and value ref', () => {
    const [SegmentedComp, modelValue] = useSegmented({
      columns: [],
    })
    expect(SegmentedComp).toBeDefined()
    expect(typeof SegmentedComp).toBe('object')
    expect(modelValue).toBeDefined()
    expect(modelValue.value).toBeUndefined()
  })

  it('renders basic columns with value and label', () => {
    const [SegmentedComp] = useSegmented({
      columns: [
        { label: 'Mon', value: 'Mon' },
        { label: 'Tue', value: 'Tue' },
      ],
    })
    const wrapper = mount(SegmentedComp)
    const items = wrapper.findAll('.el-segmented-item')
    expect(items.length).toBe(2)
    expect(items[0].attributes('data-label')).toBe('Mon')
    expect(items[1].attributes('data-label')).toBe('Tue')
    expect(items[0].attributes('data-value')).toBe('Mon')
    expect(items[1].attributes('data-value')).toBe('Tue')
  })

  it('renders label as value fallback when label is missing', () => {
    const [SegmentedComp] = useSegmented({
      columns: [
        { value: 'Mon' },
        { value: 'Tue' },
      ],
    })
    const wrapper = mount(SegmentedComp)
    const items = wrapper.findAll('.el-segmented-item')
    expect(items[0].attributes('data-label')).toBe('')
    expect(items[0].attributes('data-value')).toBe('Mon')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn((item: any) => h('span', { class: 'custom-content' }, `Rendered: ${item.label}`))
    const [SegmentedComp] = useSegmented({
      columns: [
        { label: 'Mon', value: 'Mon', render: customRender },
        { label: 'Tue', value: 'Tue' },
      ],
    })
    const wrapper = mount(SegmentedComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered: Mon')
    expect(customRender).toHaveBeenCalled()
  })

  it('uses default slot for custom rendering when provided', () => {
    const [SegmentedComp] = useSegmented({
      columns: [
        { label: 'Mon', value: 'Mon' },
        { label: 'Tue', value: 'Tue' },
      ],
    })
    const wrapper = mount(SegmentedComp, {
      slots: {
        default: ({ item }: any) => h('span', { class: 'slot-content' }, `Slot: ${item.label}`),
      },
    })
    expect(wrapper.findAll('.slot-content').length).toBe(2)
    expect(wrapper.findAll('.slot-content')[0].text()).toBe('Slot: Mon')
    expect(wrapper.findAll('.slot-content')[1].text()).toBe('Slot: Tue')
  })

  it('column render function takes precedence over default slot', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-content' }, 'Custom'))
    const [SegmentedComp] = useSegmented({
      columns: [
        { label: 'Mon', value: 'Mon', render: customRender },
        { label: 'Tue', value: 'Tue' },
      ],
    })
    const wrapper = mount(SegmentedComp, {
      slots: {
        default: ({ item }: any) => h('span', { class: 'slot-content' }, `Slot: ${item.label}`),
      },
    })
    // First item uses column render, second item uses slot
    expect(wrapper.findAll('.custom-content').length).toBe(1)
    expect(wrapper.findAll('.slot-content').length).toBe(1)
    expect(wrapper.findAll('.slot-content')[0].text()).toBe('Slot: Tue')
  })

  it('returns empty string when columns is empty array', () => {
    const [SegmentedComp] = useSegmented({
      columns: [],
    })
    const wrapper = mount(SegmentedComp)
    expect(wrapper.find('.el-segmented-item').exists()).toBe(false)
  })

  it('passes rest props to ElSegmented', () => {
    const [SegmentedComp] = useSegmented({
      columns: [],
      size: 'large',
      block: true,
      disabled: true,
      direction: 'vertical',
      name: 'segmented-name',
      id: 'segmented-id',
    })
    const wrapper = mount(SegmentedComp)
    const seg = wrapper.find('.el-segmented')
    expect(seg.attributes('data-size')).toBe('large')
    expect(seg.attributes('data-block')).toBe('true')
    expect(seg.attributes('data-disabled')).toBe('true')
    expect(seg.attributes('data-direction')).toBe('vertical')
    expect(seg.attributes('data-name')).toBe('segmented-name')
    expect(seg.attributes('data-id')).toBe('segmented-id')
  })

  it('passes column properties to ElSegmentedItem', () => {
    const [SegmentedComp] = useSegmented({
      columns: [
        {
          label: 'Mon',
          value: 'Mon',
          disabled: true,
        },
      ],
    })
    const wrapper = mount(SegmentedComp)
    const item = wrapper.find('.el-segmented-item')
    expect(item.attributes('data-label')).toBe('Mon')
    expect(item.attributes('data-value')).toBe('Mon')
    expect(item.attributes('data-disabled')).toBe('true')
  })

  it('handles undefined render function gracefully', () => {
    const [SegmentedComp] = useSegmented({
      columns: [
        { label: 'Mon', value: 'Mon', render: undefined },
      ],
    })
    const wrapper = mount(SegmentedComp)
    expect(() => wrapper.find('.el-segmented-item').text()).not.toThrow()
  })

  it('supports component props passed during mount', () => {
    const [SegmentedComp] = useSegmented({
      columns: [],
    })
    const wrapper = mount(SegmentedComp, {
      props: {
        size: 'small',
        block: true,
      },
    })
    const seg = wrapper.find('.el-segmented')
    expect(seg.attributes('data-size')).toBe('small')
    expect(seg.attributes('data-block')).toBe('true')
  })

  it('component props override options props', () => {
    const [SegmentedComp] = useSegmented({
      columns: [],
      size: 'large',
      block: false,
    })
    const wrapper = mount(SegmentedComp, {
      props: {
        size: 'small',
        block: true,
      },
    })
    const seg = wrapper.find('.el-segmented')
    expect(seg.attributes('data-size')).toBe('small')
    expect(seg.attributes('data-block')).toBe('true')
  })

  describe('v-model', () => {
    it('uses defaultValue as initial value', () => {
      const [SegmentedComp, modelValue] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
          { label: 'Tue', value: 'Tue' },
        ],
        defaultValue: 'Mon',
      })
      const wrapper = mount(SegmentedComp)
      expect(modelValue.value).toBe('Mon')
      expect(wrapper.find('.el-segmented').attributes('data-model-value')).toBe('Mon')
    })

    it('uses modelValue prop when provided', () => {
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
          { label: 'Tue', value: 'Tue' },
        ],
        defaultValue: 'Mon',
      })
      const wrapper = mount(SegmentedComp, {
        props: {
          modelValue: 'Tue',
        },
      })
      expect(wrapper.find('.el-segmented').attributes('data-model-value')).toBe('Tue')
    })

    it('modelValue prop overrides defaultValue', () => {
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
          { label: 'Tue', value: 'Tue' },
        ],
        defaultValue: 'Mon',
      })
      const wrapper = mount(SegmentedComp, {
        props: {
          modelValue: 'Tue',
        },
      })
      expect(wrapper.find('.el-segmented').attributes('data-model-value')).toBe('Tue')
    })

    it('modelValue in options is used when prop not provided', () => {
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
          { label: 'Tue', value: 'Tue' },
        ],
        modelValue: 'Tue',
      })
      const wrapper = mount(SegmentedComp)
      expect(wrapper.find('.el-segmented').attributes('data-model-value')).toBe('Tue')
    })
  })

  describe('events', () => {
    it('triggers onChange callback when value changes', async () => {
      const onChange = vi.fn()
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
        ],
        onChange,
      })
      const wrapper = mount(SegmentedComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(onChange).toHaveBeenCalledWith('changed-value')
    })

    it('updates modelValue ref when value changes', async () => {
      const [SegmentedComp, modelValue] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
        ],
        defaultValue: 'Mon',
      })
      const wrapper = mount(SegmentedComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(modelValue.value).toBe('changed-value')
    })

    it('emits change event when value changes', async () => {
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
        ],
      })
      const wrapper = mount(SegmentedComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')![0]).toEqual(['changed-value'])
    })

    it('emits update:modelValue event when value changes', async () => {
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Mon', value: 'Mon' },
        ],
      })
      const wrapper = mount(SegmentedComp)
      await wrapper.find('.mock-trigger').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['changed-value'])
    })
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ name: 'async' }))
      useSegmented({
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
      useSegmented({
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
      const mockFormatData = vi.fn(() => [{ label: 'Mon', value: 'Mon' }])
      useSegmented({
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
      useSegmented({
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
        { label: 'Async Mon', value: 'a1' },
        { label: 'Async Tue', value: 'a2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Static Mon', value: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(SegmentedComp)
      const items = wrapper.findAll('.el-segmented-item')
      expect(items.length).toBe(2)
      expect(items[0].attributes('data-label')).toBe('Async Mon')
      expect(items[1].attributes('data-label')).toBe('Async Tue')
      expect(items[0].attributes('data-value')).toBe('a1')
      expect(items[1].attributes('data-value')).toBe('a2')
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
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Static Mon', value: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(SegmentedComp)
      const items = wrapper.findAll('.el-segmented-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Static Mon')
      expect(items[0].attributes('data-value')).toBe('s1')
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
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Static Mon', value: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(SegmentedComp)
      const items = wrapper.findAll('.el-segmented-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Static Mon')
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
      const [SegmentedComp] = useSegmented({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(SegmentedComp)
      const seg = wrapper.find('.el-segmented')
      expect(seg.attributes('data-loading')).toBe('true')
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
      const [SegmentedComp] = useSegmented({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(SegmentedComp)
      const seg = wrapper.find('.el-segmented')
      expect(seg.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [SegmentedComp] = useSegmented({
        columns: [],
      })
      const wrapper = mount(SegmentedComp)
      const seg = wrapper.find('.el-segmented')
      expect(seg.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static columns is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { label: 'Async Mon', value: 'a1' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [SegmentedComp] = useSegmented({
        columns: [],
        service: mockService,
      })
      const wrapper = mount(SegmentedComp)
      const items = wrapper.findAll('.el-segmented-item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-label')).toBe('Async Mon')
      expect(items[0].attributes('data-value')).toBe('a1')
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
      const [SegmentedComp] = useSegmented({
        columns: [
          { label: 'Static Mon', value: 's1' },
        ],
        service: mockService,
      })
      const wrapper = mount(SegmentedComp)
      const items = wrapper.findAll('.el-segmented-item')
      expect(items.length).toBe(0)
    })
  })
})
