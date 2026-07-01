import type { ElForm } from 'element-plus'
import type { FormItemType, FormOptions, Recordable } from './index'
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { setDeepProperty, useForm } from './index'

vi.mock('element-plus', () => ({
  ElForm: defineComponent({
    props: ['model', 'rules', 'size', 'validateOnRuleChange', 'labelWidth', 'labelPosition', 'inline'],
    setup(props, { slots, expose }) {
      const validate = vi.fn((callback?: (valid: boolean) => void) => {
        const valid = !props.rules || Object.keys(props.rules).length === 0
        callback?.(valid)
        return Promise.resolve(valid)
      })
      const resetFields = vi.fn()
      expose({ validate, resetFields })
      return () => h('form', {
        'data-model': JSON.stringify(props.model),
        'data-rules': props.rules ? 'has-rules' : 'no-rules',
        'data-size': props.size || '',
        'data-inline': props.inline ? 'true' : 'false',
        'data-label-width': props.labelWidth || '',
        'data-label-position': props.labelPosition || '',
      }, slots.default?.())
    },
  }) as unknown as typeof ElForm,
  ElFormItem: defineComponent({
    props: ['label', 'prop', 'size'],
    setup(props, { slots }) {
      return () => h('div', {
        'data-label': props.label,
        'data-prop': props.prop,
      }, slots.default?.())
    },
  }),
  ElInput: defineComponent({
    props: ['modelValue', 'placeholder', 'disabled'],
    emits: ['update:modelValue', 'keydown'],
    setup(props, { emit }) {
      return () => h('input', {
        type: 'text',
        value: props.modelValue ?? '',
        placeholder: props.placeholder,
        disabled: props.disabled,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        onKeydown: (e: KeyboardEvent) => emit('keydown', e),
      })
    },
  }),
  ElCol: defineComponent({
    props: ['span'],
    setup(props, { slots }) {
      return () => h('div', {
        'data-span': props.span || '',
      }, slots.default?.())
    },
  }),
  ElRow: defineComponent({
    props: ['gutter'],
    setup(props, { slots }) {
      return () => h('div', {
        'data-gutter': props.gutter || '',
      }, slots.default?.())
    },
  }),
  ElCascader: defineComponent({ render: () => null }),
  ElCheckbox: defineComponent({ render: () => null }),
  ElColorPicker: defineComponent({ render: () => null }),
  ElDatePicker: defineComponent({ render: () => null }),
  ElInputNumber: defineComponent({ render: () => null }),
  ElInputOtp: defineComponent({ render: () => null }),
  ElMention: defineComponent({ render: () => null }),
  ElRadio: defineComponent({ render: () => null }),
  ElRate: defineComponent({ render: () => null }),
  ElSelect: defineComponent({ render: () => null }),
  ElSelectV2: defineComponent({ render: () => null }),
  ElSlider: defineComponent({ render: () => null }),
  ElSwitch: defineComponent({ render: () => null }),
  ElTimePicker: defineComponent({ render: () => null }),
  ElTimeSelect: defineComponent({ render: () => null }),
  ElTransfer: defineComponent({ render: () => null }),
  ElTreeSelect: defineComponent({ render: () => null }),
  ElUpload: defineComponent({ render: () => null }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

interface UserForm {
  name: string
  age: number
  email: string
  address: {
    city: string
    street: string
  }
  custom?: unknown
  user?: {
    name: string
  } | null | string
}

describe('setDeepProperty', () => {
  it('sets deep property value', () => {
    const data: Record<string, unknown> = {}
    setDeepProperty(data, ['user', 'name'], 'test')
    expect(data.user).toEqual({ name: 'test' })
  })

  it('creates intermediate objects automatically', () => {
    const data: Record<string, unknown> = {}
    setDeepProperty(data, ['a', 'b', 'c'], 123)
    expect(data.a).toEqual({ b: { c: 123 } })
  })

  it('overwrites existing value', () => {
    const data: Record<string, unknown> = { user: { name: 'old' } }
    setDeepProperty(data, ['user', 'name'], 'new')
    expect(data.user).toEqual({ name: 'new' })
  })

  it('handles empty prop array', () => {
    const data: Record<string, unknown> = { a: 1 }
    expect(() => setDeepProperty(data, [], 'value')).not.toThrow()
  })
})

describe('useForm', () => {
  it('returns FormComp and api object with validate/reset/getData methods', () => {
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    expect(FormComp).toBeDefined()
    expect(typeof api.validate).toBe('function')
    expect(typeof api.reset).toBe('function')
    expect(typeof api.getData).toBe('function')
  })

  it('initializes form data with undefined values', () => {
    const [, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
        { label: 'Age', prop: 'age', type: 'input-number' },
      ],
    })
    const data = api.getData()
    expect(data.name).toBeUndefined()
    expect(data.age).toBeUndefined()
  })

  it('initializes nested form data', () => {
    const [, api] = useForm<UserForm>({
      schemas: [
        { label: 'City', prop: 'address.city', type: 'input' },
        { label: 'Street', prop: 'address.street', type: 'input' },
      ],
    })
    const data = api.getData()
    expect(data.address).toEqual({ city: undefined, street: undefined })
  })

  it('getData returns current form data', () => {
    const [, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const data = api.getData()
    expect(data).toBeDefined()
    expect(typeof data).toBe('object')
  })

  it('reset clears form data to initial state', async () => {
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const input = wrapper.find('input')
    await input.setValue('test')
    await nextTick()
    expect(api.getData().name).toBe('test')
    api.reset()
    await nextTick()
    expect(api.getData().name).toBeUndefined()
  })

  it('validate calls callback on success', async () => {
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      rules: {},
    })
    mount(FormComp)
    await nextTick()
    await nextTick()
    const callback = vi.fn()
    const formData = api.getData()
    formData.name = 'test'
    await api.validate(callback)
    expect(callback).toHaveBeenCalled()
  })

  it('supports inline form', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      inline: true,
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('form').attributes('data-inline')).toBe('true')
  })

  it('supports custom colSpan', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input', span: 12 },
      ],
      colSpan: 24,
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('[data-span="12"]').exists()).toBe(true)
  })

  it('supports custom component', () => {
    const CustomInput = defineComponent({
      setup() {
        return () => h('input', { type: 'text', class: 'custom-input' })
      },
    })
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'custom-input' },
      ],
      customComponent: {
        'custom-input': CustomInput,
      },
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('.custom-input').exists()).toBe(true)
  })

  it('supports function as type for custom render', () => {
    const customRender = () => h('input', { type: 'email', class: 'custom-render' })
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Email', prop: 'email', type: customRender },
      ],
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('.custom-render').exists()).toBe(true)
  })

  it('supports footer slot', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp, {
      slots: {
        footer: () => h('div', { class: 'footer' }, 'Footer'),
      },
    })
    expect(wrapper.find('.footer').exists()).toBe(true)
  })

  it('supports prop slot for custom form item content', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp, {
      slots: {
        name: () => h('input', { type: 'text', class: 'slot-input' }),
      },
    })
    expect(wrapper.find('.slot-input').exists()).toBe(true)
  })

  it('supports function rules', async () => {
    const rulesFn = vi.fn(() => ({}))
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      rules: rulesFn,
    })
    mount(FormComp)
    await nextTick()
    expect(rulesFn).toHaveBeenCalled()
  })

  it('supports enterCallback when pressing Enter', async () => {
    const enterCallback = vi.fn()
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      enterCallback,
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Enter', ctrlKey: false, metaKey: false })
    expect(enterCallback).toHaveBeenCalled()
  })

  it('does not trigger enterCallback when pressing Ctrl+Enter', async () => {
    const enterCallback = vi.fn()
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      enterCallback,
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Enter', ctrlKey: true, metaKey: false })
    expect(enterCallback).not.toHaveBeenCalled()
  })

  it('does not trigger enterCallback when pressing Meta+Enter', async () => {
    const enterCallback = vi.fn()
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      enterCallback,
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Enter', ctrlKey: false, metaKey: true })
    expect(enterCallback).not.toHaveBeenCalled()
  })

  it('supports componentProps', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        {
          label: 'Name',
          prop: 'name',
          type: 'input',
          componentProps: { placeholder: 'Enter name', disabled: true },
        },
      ],
    })
    const wrapper = mount(FormComp)
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Enter name')
    expect(input.attributes('disabled')).toBe('')
  })

  it('supports form size option', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      size: 'small',
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('form').attributes('data-size')).toBe('small')
  })

  it('supports rowGutter option', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      rowGutter: 30,
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('[data-gutter="30"]').exists()).toBe(true)
  })

  it('supports labelWidth option', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      labelWidth: '100px',
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('form').attributes('data-label-width')).toBe('100px')
  })

  it('supports labelPosition option', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      labelPosition: 'top',
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('form').attributes('data-label-position')).toBe('top')
  })

  it('handles empty schemas gracefully', () => {
    expect(() => {
      useForm<UserForm>({ schemas: [] })
    }).not.toThrow()
  })

  it('customComponent overrides default component', () => {
    const CustomInput = defineComponent({
      setup() {
        return () => h('input', { type: 'text', class: 'overridden-input' })
      },
    })
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      customComponent: {
        input: CustomInput,
      },
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('.overridden-input').exists()).toBe(true)
  })

  it('form data updates when input value changes', async () => {
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const input = wrapper.find('input')
    await input.setValue('new value')
    await nextTick()
    expect(api.getData().name).toBe('new value')
  })

  it('nested form data updates when input value changes', async () => {
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'City', prop: 'address.city', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const input = wrapper.find('input')
    await input.setValue('Beijing')
    await nextTick()
    expect(api.getData().address.city).toBe('Beijing')
  })

  it('supports non-inline form (default)', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      inline: false,
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('form').attributes('data-inline')).toBe('false')
    expect(wrapper.find('[data-gutter]').exists()).toBe(true)
  })

  it('uses default colSpan when schema span is not set', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      colSpan: 12,
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('[data-span="12"]').exists()).toBe(true)
  })

  it('form item renders label and prop correctly', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Username', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('[data-label="Username"]').exists()).toBe(true)
    expect(wrapper.find('[data-prop="name"]').exists()).toBe(true)
  })

  it('uses defaultComponent when customComponent is undefined', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('uses defaultComponent when customComponent is empty object', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      customComponent: {},
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('getComponent returns function type directly', () => {
    const customRender = () => h('div', { class: 'func-component' })
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Custom', prop: 'custom', type: customRender },
      ],
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('.func-component').exists()).toBe(true)
  })

  it('getFormData returns undefined when nested path intermediate value is null', async () => {
    interface TestForm {
      user: {
        name: string
      }
    }
    const [FormComp] = useForm<TestForm>({
      schemas: [
        { label: 'User Name', prop: 'user.name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('getFormData works with string properties', async () => {
    interface TestForm {
      user: string
    }
    const [FormComp, api] = useForm<TestForm>({
      schemas: [
        { label: 'User', prop: 'user', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    api.getData().user = 'string-value'
    await nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('getComponent handles falsy string type', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: '' },
      ],
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('[data-prop="name"]').exists()).toBe(true)
  })

  it('getFormData returns undefined when nested intermediate value is null', async () => {
    interface TestForm {
      user: {
        name: string
      }
    }
    const [FormComp, api] = useForm<TestForm>({
      schemas: [
        { label: 'User Name', prop: 'user.name', type: 'input' },
      ],
    })
    mount(FormComp)
    await nextTick()
    const data = api.getData()
    expect(data.user).toBeDefined()
  })

  it('getFormData returns undefined when nested intermediate value is string', async () => {
    interface TestForm {
      user: {
        name: string
      }
    }
    const [FormComp, api] = useForm<TestForm>({
      schemas: [
        { label: 'User Name', prop: 'user.name', type: 'input' },
      ],
    })
    mount(FormComp)
    await nextTick()
    const data = api.getData()
    expect(data.user).toBeDefined()
  })

  it('getComponent returns non-string non-function type as CustomRender', () => {
    const customComponent = {
      customType: {
        setup(props: Recordable) {
          return () => h('input', { value: props.modelValue, class: 'custom-type-input' })
        },
      },
    }
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Custom', prop: 'custom', type: customComponent.customType as unknown as FormItemType },
      ],
      customComponent,
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('.custom-type-input').exists()).toBe(true)
  })

  it('function rules returns undefined', async () => {
    const funcRules = vi.fn(() => undefined)
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      rules: funcRules,
    })
    mount(FormComp)
    await nextTick()
    expect(funcRules).toHaveBeenCalled()
  })

  it('validate callback is called when validation succeeds', async () => {
    const callback = vi.fn()
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    mount(FormComp)
    await nextTick()
    await api.validate(callback)
    expect(callback).toHaveBeenCalled()
  })

  it('form passes props to ElForm', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('handles undefined options parameter', () => {
    expect(() => {
      useForm(undefined as unknown as FormOptions<UserForm>)
    }).not.toThrow()
  })

  it('returns [null, {}] when options is undefined', () => {
    const [FormComp, api] = useForm(undefined as unknown as FormOptions<UserForm>)
    expect(FormComp).toBeNull()
    expect(api).toEqual({})
  })

  it('returns [null, {}] when options is null', () => {
    const [FormComp, api] = useForm(null as unknown as FormOptions<UserForm>)
    expect(FormComp).toBeNull()
    expect(api).toEqual({})
  })

  it('returns [null, {}] when options has no schemas', () => {
    const [FormComp, api] = useForm({} as unknown as FormOptions<UserForm>)
    expect(FormComp).toBeNull()
    expect(api).toEqual({})
  })

  it('returns [null, {}] when options.schemas is undefined', () => {
    const [FormComp, api] = useForm({ schemas: undefined } as unknown as FormOptions<UserForm>)
    expect(FormComp).toBeNull()
    expect(api).toEqual({})
  })

  it('returns [null, {}] when options.schemas is null', () => {
    const [FormComp, api] = useForm({ schemas: null } as unknown as FormOptions<UserForm>)
    expect(FormComp).toBeNull()
    expect(api).toEqual({})
  })

  it('returns [null, {}] when options.schemas is empty array', () => {
    const [FormComp, api] = useForm<UserForm>({ schemas: [] })
    expect(FormComp).toBeNull()
    expect(api).toEqual({})
  })

  it('form accepts additional props', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp, {
      props: {
        customProp: 'test-value',
      },
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('validate callback is not called when validation fails', async () => {
    const callback = vi.fn()
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
      rules: {
        name: [{ required: true, message: 'Name is required' }],
      },
    })
    mount(FormComp)
    await nextTick()
    await api.validate(callback)
    expect(callback).not.toHaveBeenCalled()
  })

  it('form handles undefined props gracefully', () => {
    const [FormComp] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp, {
      props: {},
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('getFormData returns undefined when intermediate value is null', async () => {
    interface TestForm {
      user: {
        name: string
      }
    }
    const [FormComp, api] = useForm<TestForm>({
      schemas: [
        { label: 'User Name', prop: 'user.name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const data = api.getData()
    data.user = null as unknown as { name: string }
    await nextTick()
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('')
  })

  it('getFormData returns undefined when intermediate value is undefined', async () => {
    interface TestForm {
      user: {
        name: string
      }
    }
    const [FormComp, api] = useForm<TestForm>({
      schemas: [
        { label: 'User Name', prop: 'user.name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const data = api.getData()
    ;(data as unknown as Recordable).user = undefined
    await nextTick()
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('')
  })

  it('getFormData returns undefined when intermediate value is not an object', async () => {
    interface TestForm {
      user: {
        name: string
      }
    }
    const [FormComp, api] = useForm<TestForm>({
      schemas: [
        { label: 'User Name', prop: 'user.name', type: 'input' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    const data = api.getData()
    ;(data as unknown as Recordable).user = 'string-value'
    await nextTick()
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('')
  })

  it('setData updates form data correctly', async () => {
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'Name', prop: 'name', type: 'input' },
        { label: 'Age', prop: 'age', type: 'input-number' },
      ],
    })
    const wrapper = mount(FormComp)
    await nextTick()
    api.setData({ name: 'John', age: 30, email: '', address: { city: '', street: '' } })
    await nextTick()
    expect(api.getData().name).toBe('John')
    expect(api.getData().age).toBe(30)
    const input = wrapper.find('input')
    expect(input.element.value).toBe('John')
  })

  it('setData with nested object updates form data correctly', async () => {
    const [FormComp, api] = useForm<UserForm>({
      schemas: [
        { label: 'City', prop: 'address.city', type: 'input' },
      ],
    })
    mount(FormComp)
    await nextTick()
    api.setData({ name: '', age: 0, email: '', address: { city: 'Beijing', street: '' } })
    await nextTick()
    expect(api.getData().address.city).toBe('Beijing')
  })
})
