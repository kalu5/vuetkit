import { mount } from '@vue/test-utils'

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { useDialog } from './index'

interface DialogProps {
  'title'?: string
  'modelValue'?: boolean
  'update:modelValue'?: (val: boolean) => void
  'before-close'?: () => void
  [key: string]: unknown
}

let elDialogProps: DialogProps | undefined

vi.mock('element-plus', () => ({
  ElDialog: (props: DialogProps, { slots }: { slots: Record<string, () => ReturnType<typeof h> | ReturnType<typeof h>[] | undefined> }) => {
    elDialogProps = props
    return h('div', {
      'class': 'el-dialog',
      'data-title': props.title || '',
      'data-model-value': props.modelValue ? 'true' : 'false',
    }, [
      slots?.default?.(),
      slots?.footer?.(),
      slots?.header?.(),
    ])
  },
  ElScrollbar: defineComponent({
    props: ['maxHeight'],
    setup(props, { slots }) {
      return () => h('div', {
        'class': 'el-scrollbar',
        'data-max-height': props.maxHeight || '',
      }, slots.default?.())
    },
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  elDialogProps = undefined
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useDialog', () => {
  it('returns a component and methods', () => {
    const [DialogComp, methods] = useDialog({})
    expect(DialogComp).toBeDefined()
    expect(typeof DialogComp).toBe('object')
    expect(methods).toBeDefined()
    expect(typeof methods.open).toBe('function')
    expect(typeof methods.close).toBe('function')
  })

  it('uses default title when not provided', () => {
    const [DialogComp] = useDialog({})
    const wrapper = mount(DialogComp)
    expect(wrapper.find('.el-dialog').attributes('data-title')).toBe('Dialog Title')
  })

  it('uses custom title when provided', () => {
    const [DialogComp] = useDialog({ title: 'Custom Title' })
    const wrapper = mount(DialogComp)
    expect(wrapper.find('.el-dialog').attributes('data-title')).toBe('Custom Title')
  })

  it('opens dialog when open() is called', async () => {
    const TestComponent = defineComponent({
      setup() {
        const [DialogComp, { open }] = useDialog({})
        return { DialogComp, open }
      },
      render() {
        return h(this.DialogComp)
      },
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('false')
    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('true')
  })

  it('closes dialog when close() is called', async () => {
    const TestComponent = defineComponent({
      setup() {
        const [DialogComp, { open, close }] = useDialog({})
        return { DialogComp, open, close }
      },
      render() {
        return h(this.DialogComp)
      },
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('true')
    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('false')
  })

  it('provides update:modelValue callback to ElDialog', () => {
    const [DialogComp] = useDialog({})
    mount(DialogComp)
    expect(elDialogProps).toBeDefined()
    expect(typeof elDialogProps?.['update:modelValue']).toBe('function')
  })

  it('update:modelValue callback updates showDialog', async () => {
    const TestComponent = defineComponent({
      setup() {
        const [DialogComp, { open }] = useDialog({})
        return { DialogComp, open }
      },
      render() {
        return h(this.DialogComp)
      },
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('true')
    const updateCallback = elDialogProps?.['update:modelValue'] as (val: boolean) => void
    updateCallback(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('false')
  })

  it('provides before-close callback to ElDialog', () => {
    const [DialogComp] = useDialog({})
    mount(DialogComp)
    expect(elDialogProps).toBeDefined()
    expect(typeof elDialogProps?.['before-close']).toBe('function')
  })

  it('before-close callback updates showDialog', async () => {
    const TestComponent = defineComponent({
      setup() {
        const [DialogComp, { open }] = useDialog({})
        return { DialogComp, open }
      },
      render() {
        return h(this.DialogComp)
      },
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('true')
    const beforeCloseCallback = elDialogProps?.['before-close'] as () => void
    beforeCloseCallback()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').attributes('data-model-value')).toBe('false')
  })

  it('renders default slot content', () => {
    const [DialogComp] = useDialog({})
    const wrapper = mount(DialogComp, {
      slots: {
        default: () => h('div', { class: 'custom-content' }, 'Hello World'),
      },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Hello World')
  })

  it('renders footer slot content', () => {
    const [DialogComp] = useDialog({})
    const wrapper = mount(DialogComp, {
      slots: {
        footer: () => h('div', { class: 'custom-footer' }, 'Footer Content'),
      },
    })
    expect(wrapper.find('.custom-footer').exists()).toBe(true)
    expect(wrapper.find('.custom-footer').text()).toBe('Footer Content')
  })

  it('renders header slot content', () => {
    const [DialogComp] = useDialog({})
    const wrapper = mount(DialogComp, {
      slots: {
        header: () => h('div', { class: 'custom-header' }, 'Header Content'),
      },
    })
    expect(wrapper.find('.custom-header').exists()).toBe(true)
    expect(wrapper.find('.custom-header').text()).toBe('Header Content')
  })

  it('passes props to ElDialog', () => {
    const [DialogComp] = useDialog({ title: 'Test', width: '500px' })
    const wrapper = mount(DialogComp)
    const dialogEl = wrapper.find('.el-dialog').element
    expect(dialogEl.getAttribute('data-title')).toBe('Test')
  })

  it('renders ElScrollbar with maxHeight', () => {
    const [DialogComp] = useDialog({})
    const wrapper = mount(DialogComp, {
      slots: {
        default: () => h('div', 'Scrollable Content'),
      },
    })
    expect(wrapper.find('.el-scrollbar').exists()).toBe(true)
    expect(wrapper.find('.el-scrollbar').attributes('data-max-height')).toBe('60vh')
  })

  it('handles undefined slots gracefully', () => {
    const [DialogComp] = useDialog({})
    const wrapper = mount(DialogComp)
    expect(wrapper.find('.el-dialog').exists()).toBe(true)
  })

  it('handles empty options object', () => {
    const [DialogComp, methods] = useDialog({})
    expect(DialogComp).toBeDefined()
    expect(methods.open).toBeDefined()
    expect(methods.close).toBeDefined()
  })

  it('passes component props to ElDialog', () => {
    const [DialogComp] = useDialog({})
    const wrapper = mount(DialogComp, {
      props: {
        width: '800px',
      },
    })
    expect(wrapper.find('.el-dialog').exists()).toBe(true)
  })
})
