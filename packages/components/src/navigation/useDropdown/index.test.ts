// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, provide, ref } from 'vue'
import { useDropdown } from './index'

const DROPDOWN_COMMAND_KEY = Symbol('dropdownCommand')

vi.mock('element-plus', () => ({
  ElDropdown: defineComponent({
    props: ['trigger', 'type', 'size', 'placement', 'effect', 'splitButton', 'disabled', 'hideOnClick', 'maxHeight', 'placement'],
    emits: ['command', 'visible-change', 'click'],
    setup(props, { slots, emit }) {
      provide(DROPDOWN_COMMAND_KEY, (cmd: unknown) => emit('command', cmd))
      return () => h('div', {
        'class': 'el-dropdown',
        'data-trigger': props.trigger || '',
        'data-type': props.type || '',
        'data-size': props.size || '',
        'data-placement': props.placement || '',
        'data-effect': props.effect || '',
        'data-split-button': props.splitButton ? 'true' : '',
        'data-disabled': props.disabled ? 'true' : '',
        'data-hide-on-click': props.hideOnClick != null ? String(props.hideOnClick) : '',
        'data-max-height': props.maxHeight != null ? String(props.maxHeight) : '',
        'onClick': () => emit('click'),
        'onMouseenter': () => emit('visible-change', true),
        'onMouseleave': () => emit('visible-change', false),
      }, [
        h('div', { class: 'el-dropdown__trigger' }, slots.default?.()),
        h('div', { class: 'el-dropdown__menu-wrapper' }, slots.dropdown?.()),
      ])
    },
  }),
  ElDropdownMenu: defineComponent({
    setup(_props, { slots }) {
      return () => h('div', { class: 'el-dropdown-menu' }, [
        slots.default?.(),
      ])
    },
  }),
  ElDropdownItem: defineComponent({
    props: ['command', 'disabled', 'divided', 'icon'],
    setup(props, { slots }) {
      const reportCommand = inject<(cmd: unknown) => void>(DROPDOWN_COMMAND_KEY, () => {})
      return () => h('div', {
        'class': 'el-dropdown-item',
        'data-command': props.command != null ? String(props.command) : '',
        'data-disabled': props.disabled ? 'true' : '',
        'data-divided': props.divided ? 'true' : '',
        'data-icon': props.icon ? String(props.icon) : '',
        'onClick': () => reportCommand(props.command),
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

describe('useDropdown', () => {
  it('returns a component and command ref', () => {
    const [DropdownComp, command] = useDropdown({
      items: [],
    })
    expect(DropdownComp).toBeDefined()
    expect(typeof DropdownComp).toBe('object')
    expect(command).toBeDefined()
    expect(command.value).toBeUndefined()
  })

  it('uses defaultCommand when provided as string', () => {
    const [, command] = useDropdown({
      items: [],
      defaultCommand: 'a',
    })
    expect(command.value).toBe('a')
  })

  it('uses defaultCommand when provided as number', () => {
    const [, command] = useDropdown({
      items: [],
      defaultCommand: 1,
    })
    expect(command.value).toBe(1)
  })

  it('renders basic items with label and command', () => {
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
        { label: 'Action 2', command: 'b' },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', { class: 'trigger' }, 'Dropdown List'),
      },
    })
    const items = wrapper.findAll('.el-dropdown-item')
    expect(items.length).toBe(2)
    expect(items[0].text()).toBe('Action 1')
    expect(items[1].text()).toBe('Action 2')
    expect(items[0].attributes('data-command')).toBe('a')
    expect(items[1].attributes('data-command')).toBe('b')
  })

  it('renders items inside el-dropdown-menu', () => {
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    expect(wrapper.find('.el-dropdown-menu').exists()).toBe(true)
    expect(wrapper.find('.el-dropdown-menu .el-dropdown-item').exists()).toBe(true)
  })

  it('passes item properties to ElDropdownItem', () => {
    const [DropdownComp] = useDropdown({
      items: [
        {
          label: 'Action 1',
          command: 'a',
          disabled: true,
          divided: true,
          icon: 'Plus',
        },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    const item = wrapper.find('.el-dropdown-item')
    expect(item.attributes('data-command')).toBe('a')
    expect(item.attributes('data-disabled')).toBe('true')
    expect(item.attributes('data-divided')).toBe('true')
    expect(item.attributes('data-icon')).toBe('Plus')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Rendered: ${(val as { label: string }).label}`))
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a', render: customRender },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Rendered: Action 1')
    expect(customRender).toHaveBeenCalled()
  })

  it('renders empty string when label is not provided and no render', () => {
    const [DropdownComp] = useDropdown({
      items: [
        { command: 'a' },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    const item = wrapper.find('.el-dropdown-item')
    expect(item.text()).toBe('')
  })

  it('renders default slot as the trigger element', () => {
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', { class: 'custom-trigger' }, 'Custom Trigger'),
      },
    })
    expect(wrapper.find('.el-dropdown__trigger .custom-trigger').exists()).toBe(true)
    expect(wrapper.find('.custom-trigger').text()).toBe('Custom Trigger')
  })

  it('renders empty trigger when default slot is not provided', () => {
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
      ],
    })
    const wrapper = mount(DropdownComp)
    expect(wrapper.find('.el-dropdown__trigger').text()).toBe('')
  })

  it('renders dropdown slot content when provided', () => {
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
        dropdown: () => h('div', { class: 'custom-dropdown' }, 'Custom Dropdown Content'),
      },
    })
    expect(wrapper.find('.custom-dropdown').exists()).toBe(true)
    expect(wrapper.find('.custom-dropdown').text()).toBe('Custom Dropdown Content')
    expect(wrapper.findAll('.el-dropdown-item').length).toBe(0)
  })

  it('returns empty when items is empty array', () => {
    const [DropdownComp] = useDropdown({
      items: [],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    expect(wrapper.find('.el-dropdown-item').exists()).toBe(false)
  })

  it('passes rest props to ElDropdown', () => {
    const [DropdownComp] = useDropdown({
      items: [],
      trigger: 'click',
      type: 'primary',
      size: 'large',
      placement: 'top-start',
      effect: 'dark',
      splitButton: true,
      disabled: true,
      hideOnClick: false,
      maxHeight: 200,
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    const el = wrapper.find('.el-dropdown')
    expect(el.attributes('data-trigger')).toBe('click')
    expect(el.attributes('data-type')).toBe('primary')
    expect(el.attributes('data-size')).toBe('large')
    expect(el.attributes('data-placement')).toBe('top-start')
    expect(el.attributes('data-effect')).toBe('dark')
    expect(el.attributes('data-split-button')).toBe('true')
    expect(el.attributes('data-disabled')).toBe('true')
    expect(el.attributes('data-hide-on-click')).toBe('false')
    expect(el.attributes('data-max-height')).toBe('200')
  })

  it('updates command ref when an item is clicked', async () => {
    const [DropdownComp, command] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
        { label: 'Action 2', command: 'b' },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    expect(command.value).toBeUndefined()
    const items = wrapper.findAll('.el-dropdown-item')
    await items[1].trigger('click')
    expect(command.value).toBe('b')
    await items[0].trigger('click')
    expect(command.value).toBe('a')
  })

  it('calls onCommand callback when an item is clicked', async () => {
    const onCommand = vi.fn()
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
      ],
      onCommand,
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    await wrapper.find('.el-dropdown-item').trigger('click')
    expect(onCommand).toHaveBeenCalledWith('a')
  })

  it('emits command event when an item is clicked', async () => {
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a' },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    await wrapper.find('.el-dropdown-item').trigger('click')
    expect(wrapper.emitted('command')).toBeTruthy()
    expect(wrapper.emitted('command')![0]).toEqual(['a'])
  })

  it('emits click event when triggering element is clicked', async () => {
    const [DropdownComp] = useDropdown({
      items: [],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    await wrapper.find('.el-dropdown').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('calls onClick callback when triggering element is clicked', async () => {
    const onClick = vi.fn()
    const [DropdownComp] = useDropdown({
      items: [],
      onClick,
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    await wrapper.find('.el-dropdown').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('calls onVisibleChange callback when dropdown visibility changes', async () => {
    const onVisibleChange = vi.fn()
    const [DropdownComp] = useDropdown({
      items: [],
      onVisibleChange,
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    await wrapper.find('.el-dropdown').trigger('mouseenter')
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    await wrapper.find('.el-dropdown').trigger('mouseleave')
    expect(onVisibleChange).toHaveBeenCalledWith(false)
  })

  it('emits visible-change event when dropdown visibility changes', async () => {
    const [DropdownComp] = useDropdown({
      items: [],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    await wrapper.find('.el-dropdown').trigger('mouseenter')
    expect(wrapper.emitted('visible-change')).toBeTruthy()
    expect(wrapper.emitted('visible-change')![0]).toEqual([true])
  })

  it('handles undefined render function gracefully', () => {
    const [DropdownComp] = useDropdown({
      items: [
        { label: 'Action 1', command: 'a', render: undefined },
      ],
    })
    const wrapper = mount(DropdownComp, {
      slots: {
        default: () => h('span', 'Trigger'),
      },
    })
    expect(() => wrapper.find('.el-dropdown-item').text()).not.toThrow()
    expect(wrapper.find('.el-dropdown-item').text()).toBe('Action 1')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ items: [] }))
      useDropdown({
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
      useDropdown({
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
      const mockFormatData = vi.fn(() => [{ label: 'Action 1', command: 'a' }])
      useDropdown({
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
      useDropdown({
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
        { label: 'Async Action 1', command: 'async-a' },
        { label: 'Async Action 2', command: 'async-b' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [DropdownComp] = useDropdown({
        items: [
          { label: 'Static Action 1', command: 'static-a' },
        ],
        service: mockService,
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const items = wrapper.findAll('.el-dropdown-item')
      expect(items.length).toBe(2)
      expect(items[0].text()).toBe('Async Action 1')
      expect(items[1].text()).toBe('Async Action 2')
      expect(items[0].attributes('data-command')).toBe('async-a')
      expect(items[1].attributes('data-command')).toBe('async-b')
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
      const [DropdownComp] = useDropdown({
        items: [
          { label: 'Static Action 1', command: 'static-a' },
        ],
        service: mockService,
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const items = wrapper.findAll('.el-dropdown-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Static Action 1')
      expect(items[0].attributes('data-command')).toBe('static-a')
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
      const [DropdownComp] = useDropdown({
        items: [
          { label: 'Static Action 1', command: 'static-a' },
        ],
        service: mockService,
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const items = wrapper.findAll('.el-dropdown-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Static Action 1')
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
      const [DropdownComp] = useDropdown({
        items: [],
        service: mockService,
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const el = wrapper.find('.el-dropdown')
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
      const [DropdownComp] = useDropdown({
        items: [],
        service: mockService,
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const el = wrapper.find('.el-dropdown')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [DropdownComp] = useDropdown({
        items: [],
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const el = wrapper.find('.el-dropdown')
      expect(el.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static items is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { label: 'Async Action 1', command: 'async-a' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [DropdownComp] = useDropdown({
        items: [],
        service: mockService,
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const items = wrapper.findAll('.el-dropdown-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Async Action 1')
      expect(items[0].attributes('data-command')).toBe('async-a')
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
      const [DropdownComp] = useDropdown({
        items: [
          { label: 'Static Action 1', command: 'static-a' },
        ],
        service: mockService,
      })
      const wrapper = mount(DropdownComp, {
        slots: {
          default: () => h('span', 'Trigger'),
        },
      })
      const items = wrapper.findAll('.el-dropdown-item')
      expect(items.length).toBe(0)
    })
  })
})
