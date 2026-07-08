// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, provide, ref } from 'vue'
import { useMenu } from './index'

const MENU_KEY = Symbol('menu')

vi.mock('element-plus', () => ({
  ElMenu: defineComponent({
    props: [
      'mode',
      'collapse',
      'ellipsis',
      'defaultActive',
      'defaultOpeneds',
      'uniqueOpened',
      'router',
      'menuTrigger',
      'collapseTransition',
      'popperEffect',
      'closeOnClickOutside',
      'popperClass',
      'popperStyle',
      'showTimeout',
      'hideTimeout',
      'persistent',
      'popperOffset',
      'ellipsisIcon',
      'backgroundColor',
      'textColor',
      'activeTextColor',
    ],
    emits: ['select', 'open', 'close'],
    setup(props, { slots, emit }) {
      provide(MENU_KEY, {
        reportSelect: (index: string, indexPath: string[], item: unknown) => {
          emit('select', index, indexPath, item)
        },
        reportOpen: (index: string, indexPath: string[]) => {
          emit('open', index, indexPath)
        },
        reportClose: (index: string, indexPath: string[]) => {
          emit('close', index, indexPath)
        },
      })
      return () => h('div', {
        'class': 'el-menu',
        'data-mode': props.mode || '',
        'data-default-active': props.defaultActive || '',
        'data-collapse': props.collapse ? 'true' : '',
        'data-ellipsis': props.ellipsis != null ? String(props.ellipsis) : '',
        'data-unique-opened': props.uniqueOpened ? 'true' : '',
        'data-router': props.router ? 'true' : '',
        'data-menu-trigger': props.menuTrigger || '',
        'data-collapse-transition': props.collapseTransition != null ? String(props.collapseTransition) : '',
        'data-popper-effect': props.popperEffect || '',
        'data-close-on-click-outside': props.closeOnClickOutside ? 'true' : '',
        'data-popper-class': props.popperClass || '',
        'data-show-timeout': props.showTimeout != null ? String(props.showTimeout) : '',
        'data-hide-timeout': props.hideTimeout != null ? String(props.hideTimeout) : '',
        'data-persistent': props.persistent != null ? String(props.persistent) : '',
        'data-popper-offset': props.popperOffset != null ? String(props.popperOffset) : '',
        'data-background-color': props.backgroundColor || '',
        'data-text-color': props.textColor || '',
        'data-active-text-color': props.activeTextColor || '',
      }, [
        slots.default?.(),
      ])
    },
  }),
  ElMenuItem: defineComponent({
    props: ['index', 'route', 'disabled'],
    emits: ['click'],
    setup(props, { slots }) {
      const menu = inject<{
        reportSelect: (index: string, indexPath: string[], item: unknown) => void
      }>(MENU_KEY, { reportSelect: () => {} })
      return () => h('div', {
        'class': 'el-menu-item',
        'data-index': props.index || '',
        'data-disabled': props.disabled ? 'true' : '',
        'data-route': props.route ? String(props.route) : '',
        'onClick': (e: Event) => {
          e.stopPropagation()
          menu.reportSelect(props.index, [props.index], { index: props.index, indexPath: [props.index] })
        },
      }, [
        slots.default?.(),
      ])
    },
  }),
  ElSubMenu: defineComponent({
    props: [
      'index',
      'popperClass',
      'popperStyle',
      'showTimeout',
      'hideTimeout',
      'disabled',
      'teleported',
      'popperOffset',
      'expandCloseIcon',
      'expandOpenIcon',
      'collapseCloseIcon',
      'collapseOpenIcon',
    ],
    setup(props, { slots }) {
      const isOpen = ref(false)
      const menu = inject<{
        reportOpen: (index: string, indexPath: string[]) => void
        reportClose: (index: string, indexPath: string[]) => void
      }>(MENU_KEY, { reportOpen: () => {}, reportClose: () => {} })
      const toggle = () => {
        isOpen.value = !isOpen.value
        if (isOpen.value)
          menu.reportOpen(props.index, [props.index])
        else
          menu.reportClose(props.index, [props.index])
      }
      return () => h('div', {
        'class': 'el-sub-menu',
        'data-index': props.index || '',
        'data-disabled': props.disabled ? 'true' : '',
        'data-popper-class': props.popperClass || '',
        'data-show-timeout': props.showTimeout != null ? String(props.showTimeout) : '',
        'data-hide-timeout': props.hideTimeout != null ? String(props.hideTimeout) : '',
        'data-teleported': props.teleported != null ? String(props.teleported) : '',
        'data-popper-offset': props.popperOffset != null ? String(props.popperOffset) : '',
        'data-expand-close-icon': props.expandCloseIcon ? String(props.expandCloseIcon) : '',
        'data-expand-open-icon': props.expandOpenIcon ? String(props.expandOpenIcon) : '',
        'data-collapse-close-icon': props.collapseCloseIcon ? String(props.collapseCloseIcon) : '',
        'data-collapse-open-icon': props.collapseOpenIcon ? String(props.collapseOpenIcon) : '',
      }, [
        h('div', { class: 'el-sub-menu__title', onClick: toggle }, [
          slots.title?.(),
        ]),
        h('div', { class: 'el-sub-menu__content' }, [
          slots.default?.(),
        ]),
      ])
    },
  }),
  ElMenuItemGroup: defineComponent({
    props: ['title'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-menu-item-group',
        'data-title': props.title || '',
      }, [
        h('div', { class: 'el-menu-item-group__title' }, props.title || ''),
        h('div', { class: 'el-menu-item-group__content' }, [
          slots.default?.(),
        ]),
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

describe('useMenu', () => {
  it('returns a component and activeIndex ref', () => {
    const [MenuComp, activeIndex] = useMenu({
      items: [],
    })
    expect(MenuComp).toBeDefined()
    expect(typeof MenuComp).toBe('object')
    expect(activeIndex).toBeDefined()
    expect(activeIndex.value).toBe('')
  })

  it('uses defaultActive when provided', () => {
    const [, activeIndex] = useMenu({
      items: [],
      defaultActive: '1',
    })
    expect(activeIndex.value).toBe('1')
  })

  it('renders basic menu items with label and index', () => {
    const [MenuComp] = useMenu({
      items: [
        { index: '1', label: 'Processing Center' },
        { index: '2', label: 'Orders' },
      ],
    })
    const wrapper = mount(MenuComp)
    const items = wrapper.findAll('.el-menu-item')
    expect(items.length).toBe(2)
    expect(items[0].text()).toBe('Processing Center')
    expect(items[1].text()).toBe('Orders')
    expect(items[0].attributes('data-index')).toBe('1')
    expect(items[1].attributes('data-index')).toBe('2')
  })

  it('passes defaultActive to ElMenu', () => {
    const [MenuComp] = useMenu({
      items: [],
      defaultActive: '2',
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.el-menu').attributes('data-default-active')).toBe('2')
  })

  it('renders sub-menu with title and children', () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          children: [
            { index: '1-1', label: 'item one' },
            { index: '1-2', label: 'item two' },
          ],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    const subMenu = wrapper.find('.el-sub-menu')
    expect(subMenu.exists()).toBe(true)
    expect(subMenu.attributes('data-index')).toBe('1')
    expect(wrapper.find('.el-sub-menu__title').text()).toBe('Workspace')
    const items = wrapper.findAll('.el-menu-item')
    expect(items.length).toBe(2)
    expect(items[0].text()).toBe('item one')
    expect(items[1].text()).toBe('item two')
  })

  it('renders nested sub-menus', () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          children: [
            { index: '1-1', label: 'item one' },
            {
              index: '1-2',
              label: 'item four',
              children: [
                { index: '1-2-1', label: 'nested one' },
                { index: '1-2-2', label: 'nested two' },
              ],
            },
          ],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    const subMenus = wrapper.findAll('.el-sub-menu')
    expect(subMenus.length).toBe(2)
    const items = wrapper.findAll('.el-menu-item')
    expect(items.length).toBe(3)
    expect(items[0].text()).toBe('item one')
    expect(items[1].text()).toBe('nested one')
    expect(items[2].text()).toBe('nested two')
  })

  it('passes item disabled property to ElMenuItem', () => {
    const [MenuComp] = useMenu({
      items: [
        { index: '1', label: 'Active', disabled: false },
        { index: '2', label: 'Disabled', disabled: true },
      ],
    })
    const wrapper = mount(MenuComp)
    const items = wrapper.findAll('.el-menu-item')
    expect(items[0].attributes('data-disabled')).toBe('')
    expect(items[1].attributes('data-disabled')).toBe('true')
  })

  it('passes item route property to ElMenuItem', () => {
    const [MenuComp] = useMenu({
      items: [
        { index: '1', label: 'Route Item', route: '/home' },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.el-menu-item').attributes('data-route')).toBe('/home')
  })

  it('passes sub-menu properties to ElSubMenu', () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          popperClass: 'custom-popper',
          showTimeout: 100,
          hideTimeout: 200,
          teleported: true,
          popperOffset: 10,
          disabled: true,
          children: [
            { index: '1-1', label: 'item one' },
          ],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    const subMenu = wrapper.find('.el-sub-menu')
    expect(subMenu.exists()).toBe(true)
    expect(subMenu.attributes('data-popper-class')).toBe('custom-popper')
    expect(subMenu.attributes('data-show-timeout')).toBe('100')
    expect(subMenu.attributes('data-hide-timeout')).toBe('200')
    expect(subMenu.attributes('data-teleported')).toBe('true')
    expect(subMenu.attributes('data-popper-offset')).toBe('10')
    expect(subMenu.attributes('data-disabled')).toBe('true')
  })

  it('renders empty string when label is not provided and no render', () => {
    const [MenuComp] = useMenu({
      items: [
        { index: '1' },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.el-menu-item').text()).toBe('')
  })

  it('uses custom render function for item content', () => {
    const customRender = vi.fn((val: unknown) => h('span', { class: 'custom-content' }, `Custom: ${(val as { label: string }).label}`))
    const [MenuComp] = useMenu({
      items: [
        { index: '1', label: 'Item 1', render: customRender },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Custom: Item 1')
    expect(customRender).toHaveBeenCalled()
  })

  it('uses custom renderTitle function for sub-menu title', () => {
    const customRenderTitle = vi.fn((val: unknown) => h('span', { class: 'custom-title' }, `Title: ${(val as { label: string }).label}`))
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          renderTitle: customRenderTitle,
          children: [
            { index: '1-1', label: 'item one' },
          ],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('Title: Workspace')
    expect(customRenderTitle).toHaveBeenCalled()
  })

  it('renders MenuItemGroup when groupTitle is set with children', () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          groupTitle: 'Group 1',
          children: [
            { index: '1-1', label: 'item one' },
            { index: '1-2', label: 'item two' },
          ],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    const group = wrapper.find('.el-menu-item-group')
    expect(group.exists()).toBe(true)
    expect(group.attributes('data-title')).toBe('Group 1')
    expect(wrapper.find('.el-menu-item-group__title').text()).toBe('Group 1')
    const items = wrapper.findAll('.el-menu-item')
    expect(items.length).toBe(2)
  })

  it('updates activeIndex when a menu item is clicked', async () => {
    const [MenuComp, activeIndex] = useMenu({
      items: [
        { index: '1', label: 'Item 1' },
        { index: '2', label: 'Item 2' },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(activeIndex.value).toBe('')
    const items = wrapper.findAll('.el-menu-item')
    await items[1].trigger('click')
    expect(activeIndex.value).toBe('2')
    await items[0].trigger('click')
    expect(activeIndex.value).toBe('1')
  })

  it('calls onSelect callback when a menu item is clicked', async () => {
    const onSelect = vi.fn()
    const [MenuComp] = useMenu({
      items: [
        { index: '1', label: 'Item 1' },
      ],
      onSelect,
    })
    const wrapper = mount(MenuComp)
    await wrapper.find('.el-menu-item').trigger('click')
    expect(onSelect).toHaveBeenCalledWith('1', ['1'], expect.objectContaining({ index: '1' }), undefined)
  })

  it('emits select event when a menu item is clicked', async () => {
    const [MenuComp] = useMenu({
      items: [
        { index: '1', label: 'Item 1' },
      ],
    })
    const wrapper = mount(MenuComp)
    await wrapper.find('.el-menu-item').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0][0]).toBe('1')
  })

  it('calls onOpen callback when a sub-menu opens', async () => {
    const onOpen = vi.fn()
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          children: [{ index: '1-1', label: 'item one' }],
        },
      ],
      onOpen,
    })
    const wrapper = mount(MenuComp)
    await wrapper.find('.el-sub-menu__title').trigger('click')
    expect(onOpen).toHaveBeenCalledWith('1', ['1'])
  })

  it('emits open event when a sub-menu opens', async () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          children: [{ index: '1-1', label: 'item one' }],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    await wrapper.find('.el-sub-menu__title').trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
    expect(wrapper.emitted('open')![0][0]).toBe('1')
  })

  it('calls onClose callback when a sub-menu closes', async () => {
    const onClose = vi.fn()
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          children: [{ index: '1-1', label: 'item one' }],
        },
      ],
      onClose,
    })
    const wrapper = mount(MenuComp)
    const title = wrapper.find('.el-sub-menu__title')
    await title.trigger('click')
    await title.trigger('click')
    expect(onClose).toHaveBeenCalledWith('1', ['1'])
  })

  it('emits close event when a sub-menu closes', async () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          children: [{ index: '1-1', label: 'item one' }],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    const title = wrapper.find('.el-sub-menu__title')
    await title.trigger('click')
    await title.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')![0][0]).toBe('1')
  })

  it('renders default slot content when provided', () => {
    const [MenuComp] = useMenu({
      items: [],
    })
    const wrapper = mount(MenuComp, {
      slots: {
        default: () => h('div', { class: 'custom-menu-content' }, 'Custom Content'),
      },
    })
    expect(wrapper.find('.custom-menu-content').exists()).toBe(true)
    expect(wrapper.find('.el-menu-item').exists()).toBe(false)
  })

  it('returns empty when items is empty array', () => {
    const [MenuComp] = useMenu({
      items: [],
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.el-menu-item').exists()).toBe(false)
    expect(wrapper.find('.el-sub-menu').exists()).toBe(false)
  })

  it('passes rest props to ElMenu', () => {
    const [MenuComp] = useMenu({
      items: [],
      mode: 'horizontal',
      uniqueOpened: true,
      menuTrigger: 'click',
      collapse: true,
      collapseTransition: false,
      popperEffect: 'light',
      closeOnClickOutside: true,
      popperClass: 'my-popper',
      showTimeout: 500,
      hideTimeout: 400,
      persistent: false,
      popperOffset: 12,
    })
    const wrapper = mount(MenuComp)
    const el = wrapper.find('.el-menu')
    expect(el.attributes('data-mode')).toBe('horizontal')
    expect(el.attributes('data-unique-opened')).toBe('true')
    expect(el.attributes('data-menu-trigger')).toBe('click')
    expect(el.attributes('data-collapse')).toBe('true')
    expect(el.attributes('data-collapse-transition')).toBe('false')
    expect(el.attributes('data-popper-effect')).toBe('light')
    expect(el.attributes('data-close-on-click-outside')).toBe('true')
    expect(el.attributes('data-popper-class')).toBe('my-popper')
    expect(el.attributes('data-show-timeout')).toBe('500')
    expect(el.attributes('data-hide-timeout')).toBe('400')
    expect(el.attributes('data-persistent')).toBe('false')
    expect(el.attributes('data-popper-offset')).toBe('12')
  })

  it('handles undefined render function gracefully', () => {
    const [MenuComp] = useMenu({
      items: [
        { index: '1', label: 'Item 1', render: undefined },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(() => wrapper.find('.el-menu-item').text()).not.toThrow()
    expect(wrapper.find('.el-menu-item').text()).toBe('Item 1')
  })

  it('handles undefined renderTitle function gracefully', () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          label: 'Workspace',
          renderTitle: undefined,
          children: [{ index: '1-1', label: 'item one' }],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.el-sub-menu__title').text()).toBe('Workspace')
  })

  it('renders empty title when label and renderTitle are not provided for sub-menu', () => {
    const [MenuComp] = useMenu({
      items: [
        {
          index: '1',
          children: [{ index: '1-1', label: 'item one' }],
        },
      ],
    })
    const wrapper = mount(MenuComp)
    expect(wrapper.find('.el-sub-menu__title').text()).toBe('')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve([]))
      useMenu({
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
      useMenu({
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
      const mockFormatData = vi.fn(() => [{ index: '1', label: 'Item 1' }])
      useMenu({
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
      useMenu({
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
        { index: 'async-1', label: 'Async Item 1' },
        { index: 'async-2', label: 'Async Item 2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [MenuComp] = useMenu({
        items: [
          { index: 'static-1', label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      const items = wrapper.findAll('.el-menu-item')
      expect(items.length).toBe(2)
      expect(items[0].text()).toBe('Async Item 1')
      expect(items[1].text()).toBe('Async Item 2')
      expect(items[0].attributes('data-index')).toBe('async-1')
      expect(items[1].attributes('data-index')).toBe('async-2')
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
      const [MenuComp] = useMenu({
        items: [
          { index: 'static-1', label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      const items = wrapper.findAll('.el-menu-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Static Item 1')
      expect(items[0].attributes('data-index')).toBe('static-1')
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
      const [MenuComp] = useMenu({
        items: [
          { index: 'static-1', label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      const items = wrapper.findAll('.el-menu-item')
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
      const [MenuComp] = useMenu({
        items: [],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      expect(wrapper.find('.el-menu').attributes('data-loading')).toBe('true')
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
      const [MenuComp] = useMenu({
        items: [],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      expect(wrapper.find('.el-menu').attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [MenuComp] = useMenu({
        items: [],
      })
      const wrapper = mount(MenuComp)
      expect(wrapper.find('.el-menu').attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static items is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { index: 'async-1', label: 'Async Item 1' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [MenuComp] = useMenu({
        items: [],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      const items = wrapper.findAll('.el-menu-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toBe('Async Item 1')
      expect(items[0].attributes('data-index')).toBe('async-1')
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
      const [MenuComp] = useMenu({
        items: [
          { index: 'static-1', label: 'Static Item 1' },
        ],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      expect(wrapper.findAll('.el-menu-item').length).toBe(0)
    })

    it('renders async sub-menus with children', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        {
          index: '1',
          label: 'Async Workspace',
          children: [
            { index: '1-1', label: 'Async Item 1' },
            { index: '1-2', label: 'Async Item 2' },
          ],
        },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [MenuComp] = useMenu({
        items: [],
        service: mockService,
      })
      const wrapper = mount(MenuComp)
      expect(wrapper.find('.el-sub-menu').exists()).toBe(true)
      expect(wrapper.find('.el-sub-menu__title').text()).toBe('Async Workspace')
      expect(wrapper.findAll('.el-menu-item').length).toBe(2)
    })
  })
})
