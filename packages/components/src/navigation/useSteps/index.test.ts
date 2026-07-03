// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useSteps } from './index'

vi.mock('element-plus', () => ({
  ElSteps: defineComponent({
    props: ['active', 'modelValue', 'processStatus', 'finishStatus', 'alignCenter', 'simple', 'space'],
    setup(props, { slots, emit }) {
      const localValue = ref(props.active ?? props.modelValue ?? 0)
      return () => h('div', {
        'class': 'el-steps',
        'data-active': props.active != null ? String(props.active) : props.modelValue != null ? String(props.modelValue) : '',
        'data-simple': props.simple ? 'true' : 'false',
        'data-space': props.space || '',
        'onClick': () => {
          localValue.value++
          emit('update:active', localValue.value)
        },
      }, [
        slots.default?.(),
      ])
    },
  }),
  ElStep: defineComponent({
    props: ['title', 'description', 'icon', 'status'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-step',
        'data-title': props.title || '',
        'data-status': props.status || '',
        'data-icon': props.icon || '',
      }, [
        h('div', { class: 'el-step__icon' }, slots.icon ? slots.icon() : props.icon),
        h('div', { class: 'el-step__title' }, slots.title ? slots.title() : props.title),
        h('div', { class: 'el-step__description' }, slots.description?.()),
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

describe('useSteps', () => {
  it('returns a component and active ref', () => {
    const [StepsComp, active] = useSteps({
      steps: [],
    })
    expect(StepsComp).toBeDefined()
    expect(typeof StepsComp).toBe('object')
    expect(active).toBeDefined()
    expect(typeof active.value).toBe('number')
    expect(active.value).toBe(0)
  })

  it('uses defaultActive when provided', () => {
    const [, active] = useSteps({
      steps: [],
      defaultActive: 2,
    })
    expect(active.value).toBe(2)
  })

  it('binds modelValue to ElSteps', () => {
    const [StepsComp] = useSteps({
      steps: [],
      defaultActive: 1,
    })
    const wrapper = mount(StepsComp)
    const el = wrapper.find('.el-steps')
    expect(el.attributes('data-active')).toBe('1')
  })

  it('updates active ref when component emits update:modelValue', () => {
    const [StepsComp, active] = useSteps({
      steps: [],
      defaultActive: 0,
    })
    const wrapper = mount(StepsComp)
    expect(active.value).toBe(0)
    const el = wrapper.find('.el-steps')
    el.trigger('click')
    expect(active.value).toBe(1)
    el.trigger('click')
    expect(active.value).toBe(2)
  })

  it('updates component when active ref is changed externally', async () => {
    const [StepsComp, active] = useSteps({
      steps: [
        { title: 'Step 1', description: 'Desc 1' },
        { title: 'Step 2', description: 'Desc 2' },
      ],
      defaultActive: 0,
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.el-steps').attributes('data-active')).toBe('0')
    active.value = 1
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-steps').attributes('data-active')).toBe('1')
  })

  it('renders basic steps with title and description', () => {
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'Description 1' },
        { title: 'Step 2', description: 'Description 2' },
      ],
    })
    const wrapper = mount(StepsComp)
    const items = wrapper.findAll('.el-step')
    expect(items.length).toBe(2)
    expect(items[0].attributes('data-title')).toBe('Step 1')
    expect(items[1].attributes('data-title')).toBe('Step 2')
    expect(items[0].find('.el-step__description').text()).toBe('Description 1')
    expect(items[1].find('.el-step__description').text()).toBe('Description 2')
  })

  it('uses custom render function for step description', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Rendered: ${val}`))
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', render: customRender },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered: test')
    expect(customRender).toHaveBeenCalledWith('test')
  })

  it('uses custom renderTitle function for step title', () => {
    const customTitleRender = vi.fn((val: unknown) => h('span', { class: 'custom-title' }, `Title: ${val}`))
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', renderTitle: customTitleRender },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('Title: Step 1')
    expect(customTitleRender).toHaveBeenCalledWith('Step 1')
  })

  it('supports both render and renderTitle functions', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-content' }, 'Content'))
    const customTitleRender = vi.fn(() => h('span', { class: 'custom-title' }, 'Title'))
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', render: customRender, renderTitle: customTitleRender },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(customRender).toHaveBeenCalled()
    expect(customTitleRender).toHaveBeenCalled()
  })

  it('uses custom renderIcon function for step icon', () => {
    const customIconRender = vi.fn((val: unknown) => h('span', { class: 'custom-icon' }, `Icon: ${val}`))
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', icon: 'circle', renderIcon: customIconRender },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').text()).toBe('Icon: circle')
    expect(customIconRender).toHaveBeenCalledWith('circle')
  })

  it('handles undefined renderIcon function gracefully', () => {
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', icon: 'circle', renderIcon: undefined },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.el-step__icon').text()).toBe('circle')
  })

  it('supports render, renderTitle and renderIcon functions together', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-content' }, 'Content'))
    const customTitleRender = vi.fn(() => h('span', { class: 'custom-title' }, 'Title'))
    const customIconRender = vi.fn(() => h('span', { class: 'custom-icon' }, 'Icon'))
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', icon: 'circle', render: customRender, renderTitle: customTitleRender, renderIcon: customIconRender },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(customRender).toHaveBeenCalled()
    expect(customTitleRender).toHaveBeenCalled()
    expect(customIconRender).toHaveBeenCalled()
  })

  it('renders default slot content when provided', () => {
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'should-not-show' },
      ],
    })
    const wrapper = mount(StepsComp, {
      slots: {
        default: () => h('div', { class: 'custom-slot' }, 'Custom Slot Content'),
      },
    })
    expect(wrapper.find('.custom-slot').exists()).toBe(true)
    expect(wrapper.find('.custom-slot').text()).toBe('Custom Slot Content')
    expect(wrapper.findAll('.el-step').length).toBe(0)
  })

  it('returns empty string when steps is empty array', () => {
    const [StepsComp] = useSteps({
      steps: [],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.el-step').exists()).toBe(false)
  })

  it('passes rest props to ElSteps', () => {
    const [StepsComp] = useSteps({
      steps: [],
      active: 1,
      simple: true,
      space: '100px',
    })
    const wrapper = mount(StepsComp)
    const el = wrapper.find('.el-steps')
    expect(el.attributes('data-active')).toBe('1')
    expect(el.attributes('data-simple')).toBe('true')
    expect(el.attributes('data-space')).toBe('100px')
  })

  it('passes step properties to ElStep', () => {
    const [StepsComp] = useSteps({
      steps: [
        {
          title: 'Step 1',
          description: 'test',
          status: 'success',
        },
      ],
    })
    const wrapper = mount(StepsComp)
    const item = wrapper.find('.el-step')
    expect(item.attributes('data-title')).toBe('Step 1')
    expect(item.attributes('data-status')).toBe('success')
  })

  it('handles undefined render function gracefully', () => {
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', render: undefined },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.el-step__description').text()).toBe('test')
  })

  it('handles undefined renderTitle function gracefully', () => {
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: 'test', renderTitle: undefined },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(wrapper.find('.el-step__title').text()).toBe('Step 1')
  })

  it('handles null item description gracefully', () => {
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: null as unknown as string },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(() => wrapper.find('.el-step__description').text()).not.toThrow()
  })

  it('handles undefined item description gracefully', () => {
    const [StepsComp] = useSteps({
      steps: [
        { title: 'Step 1', description: undefined as unknown as string },
      ],
    })
    const wrapper = mount(StepsComp)
    expect(() => wrapper.find('.el-step__description').text()).not.toThrow()
  })

  it('supports component props passed during mount', () => {
    const [StepsComp] = useSteps({
      steps: [],
    })
    const wrapper = mount(StepsComp, {
      props: {
        modelValue: 2,
        simple: true,
      },
    })
    const el = wrapper.find('.el-steps')
    expect(el.attributes('data-active')).toBe('2')
    expect(el.attributes('data-simple')).toBe('true')
  })

  it('component props override options props', () => {
    const [StepsComp] = useSteps({
      steps: [],
      active: 1,
      simple: false,
    })
    const wrapper = mount(StepsComp, {
      props: {
        modelValue: 2,
        simple: true,
      },
    })
    const el = wrapper.find('.el-steps')
    expect(el.attributes('data-active')).toBe('2')
    expect(el.attributes('data-simple')).toBe('true')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ steps: [] }))
      useSteps({
        steps: [],
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
      useSteps({
        steps: [],
        service: mockService,
        params: mockParams,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        defaultParams: mockParams,
      }))
    })

    it('passes formatData to useRequest', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockFormatData = vi.fn(() => [{ title: 'Step 1', description: 'test' }])
      useSteps({
        steps: [],
        service: mockService,
        formatData: mockFormatData,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        formatData: mockFormatData,
      }))
    })

    it('passes formatData as undefined when formatData is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      useSteps({
        steps: [],
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
        { title: 'Async Step 1', description: 'async-desc-1' },
        { title: 'Async Step 2', description: 'async-desc-2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [StepsComp] = useSteps({
        steps: [
          { title: 'Static Step 1', description: 'static-desc' },
        ],
        service: mockService,
      })
      const wrapper = mount(StepsComp)
      const items = wrapper.findAll('.el-step')
      expect(items.length).toBe(2)
      expect(items[0].attributes('data-title')).toBe('Async Step 1')
      expect(items[1].attributes('data-title')).toBe('Async Step 2')
      expect(items[0].find('.el-step__description').text()).toBe('async-desc-1')
      expect(items[1].find('.el-step__description').text()).toBe('async-desc-2')
    })

    it('falls back to static steps when data.value is null', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(null)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [StepsComp] = useSteps({
        steps: [
          { title: 'Static Step 1', description: 'static-desc' },
        ],
        service: mockService,
      })
      const wrapper = mount(StepsComp)
      const items = wrapper.findAll('.el-step')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-title')).toBe('Static Step 1')
      expect(items[0].find('.el-step__description').text()).toBe('static-desc')
    })

    it('falls back to static steps when data.value is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(undefined)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [StepsComp] = useSteps({
        steps: [
          { title: 'Static Step 1', description: 'static-desc' },
        ],
        service: mockService,
      })
      const wrapper = mount(StepsComp)
      const items = wrapper.findAll('.el-step')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-title')).toBe('Static Step 1')
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
      const [StepsComp] = useSteps({
        steps: [],
        service: mockService,
      })
      const wrapper = mount(StepsComp)
      const el = wrapper.find('.el-steps')
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
      const [StepsComp] = useSteps({
        steps: [],
        service: mockService,
      })
      const wrapper = mount(StepsComp)
      const el = wrapper.find('.el-steps')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [StepsComp] = useSteps({
        steps: [],
      })
      const wrapper = mount(StepsComp)
      const el = wrapper.find('.el-steps')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static steps is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { title: 'Async Step 1', description: 'async-desc' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [StepsComp] = useSteps({
        steps: [],
        service: mockService,
      })
      const wrapper = mount(StepsComp)
      const items = wrapper.findAll('.el-step')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-title')).toBe('Async Step 1')
      expect(items[0].find('.el-step__description').text()).toBe('async-desc')
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
      const [StepsComp] = useSteps({
        steps: [
          { title: 'Static Step 1', description: 'static-desc' },
        ],
        service: mockService,
      })
      const wrapper = mount(StepsComp)
      const items = wrapper.findAll('.el-step')
      expect(items.length).toBe(0)
    })
  })
})
