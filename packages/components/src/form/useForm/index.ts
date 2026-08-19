import type { ComponentSize, FormRules } from 'element-plus'
import type { Component, Slots } from 'vue'
import { isFunc } from '@vuecraft/shared'
import { ElCascader, ElCheckbox, ElCol, ElColorPicker, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElInputOtp, ElLink, ElMention, ElRadio, ElRate, ElRow, ElSelect, ElSelectV2, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTransfer, ElTreeSelect, ElUpload } from 'element-plus'
import { computed, defineComponent, h, nextTick, onMounted, ref, useTemplateRef } from 'vue'

export type CustomRender = (...args: unknown[]) => unknown

export type Recordable = Record<string, unknown>

type DeepKeys<T> = T extends null | undefined
  ? never
  : T extends object
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends null | undefined
            ? `${K}`
            : T[K] extends object
              ? `${K}` | `${K}.${DeepKeys<T[K]>}`
              : `${K}`
          : never
      }[keyof T]
    : never

export type DefaultComponentKey
  = 'input'
    | 'select'
    | 'date-picker'
    | 'time-picker'
    | 'checkbox'
    | 'radio'
    | 'upload'
    | 'input-number'
    | 'switch'
    | 'rate'
    | 'tree-select'
    | 'cascader'
    | 'color-picker'
    | 'input-otp'
    | 'mention'
    | 'select-v2'
    | 'slider'
    | 'time-select'
    | 'transfer'

export type FormItemType = DefaultComponentKey | string | CustomRender

export interface FormSchema<T> {
  // FormItem label
  label: string
  // FormItem prop
  prop: DeepKeys<T>
  // FormItem type
  type: FormItemType
  // The width occupied by each column
  span?: number
  // FormItem child component props , eg: ElInput props { placeholder: 'Please input' }
  componentProps?: Recordable
}

export type FormRuleFn<T> = (data: T) => FormRules<Recordable>

export interface FormOptions<T> {
  // Form schema
  'schemas': FormSchema<T>[]
  // Form validate rules
  'rules'?: FormRules<Recordable> | FormRuleFn<T>
  // Default form data
  'defaultData'?: T
  // Inline form
  'inline'?: boolean
  // Whether to enable collapse. When true, the form collapses to one row by default and an expand/collapse trigger is rendered inline with the footer.
  'collapsible'?: boolean
  // Expand trigger text, shown when the form is collapsed. Default 'Expand'.
  'expandText'?: string
  // Collapse trigger text, shown when the form is expanded. Default 'Collapse'.
  'collapseText'?: string
  // The width occupied by each column
  'colSpan'?: number
  // Form size
  'size'?: ComponentSize
  // Row gutter
  'rowGutter'?: number
  // Label width
  'labelWidth'?: string
  // Label position
  'labelPosition'?: 'left' | 'top' | 'right'
  // Label-suffix
  'labelSuffix'?: string
  // After change rules property, trigger validate form
  'validate-on-rule-change'?: boolean
  // Disabled form
  'disabled'?: boolean
  // Position of asterisk.
  'require-asterisk-position'?: 'left' | 'right'
  // When validation fails, scroll to the first error form entry.
  'scrollTo-error'?: boolean
  // When validation fails, it scrolls to the first error item based on the scrollIntoView option.
  'scroll-into-view-options'?: boolean | ScrollIntoViewOptions
  // Whether to display an icon indicating the validation result.
  'status-icon'?: boolean
  // Whether to show the error message.
  'show-message'?: boolean
  // Whether to display the error message inline with the form item.
  'inline-message'?: boolean
  // Enter callback
  'enterCallback'?: () => void
  /**
   * Custom component merged with default component. Only affects this useForm instance.
   * eg: { 'c-input': CInput, 'c-select': CSelect }
   * If the same key will retain the custom component.
   */
  'customComponent'?: Record<string, Component>
}

export type FormReturnType<T extends object> = [
  // Use FormComp in template
  Component,
  {
    // Validate form , after success , callback will be called
    validate: (callback: (data: T) => void) => void
    // Reset form data, form validate rules will be reset
    reset: () => void
    // Get form data
    getData: () => T
    // Set form data
    setData: (newData: T) => void
  },
]

const defaultComponent: Record<DefaultComponentKey, Component> = {
  'input': ElInput,
  'select': ElSelect,
  'date-picker': ElDatePicker,
  'time-picker': ElTimePicker,
  'checkbox': ElCheckbox,
  'radio': ElRadio,
  'upload': ElUpload,
  'input-number': ElInputNumber,
  'switch': ElSwitch,
  'rate': ElRate,
  'tree-select': ElTreeSelect,
  'cascader': ElCascader,
  'color-picker': ElColorPicker,
  'input-otp': ElInputOtp,
  'mention': ElMention,
  'select-v2': ElSelectV2,
  'slider': ElSlider,
  'time-select': ElTimeSelect,
  'transfer': ElTransfer,
}

// set deep property value
export function setDeepProperty(data: Recordable, propArr: string[], value: unknown) {
  let temp: Recordable = data
  for (let i = 0; i < propArr.length - 1; i++) {
    const key = propArr[i]
    if (temp[key] === undefined) {
      temp[key] = {}
    }
    temp = temp[key] as Recordable
  }
  temp[propArr[propArr.length - 1]] = value
}

// get schemas that fit in the first grid row (24 columns), reserving one
// action slot (colSpan) so the trigger column can sit on the same row.
// at least one schema is always shown. (Ant Pro: showLength = 24/colSpan - 1)
function getFirstRowSchemas<T>(schemas: FormSchema<T>[], colSpan: number): FormSchema<T>[] {
  let used = 0
  const res: FormSchema<T>[] = []
  for (const schema of schemas) {
    const span = schema.span ?? colSpan
    if (res.length > 0 && used + span + colSpan > 24)
      break
    res.push(schema)
    used += span
  }
  return res
}

// span used in the last grid row by the given schemas, accounting for row wrapping
function getLastRowUsedSpan<T>(schemas: FormSchema<T>[], colSpan: number): number {
  let running = 0
  for (const s of schemas) {
    const span = s.span ?? colSpan
    if (24 - (running % 24) < span)
      running += 24 - (running % 24)
    running += span
  }
  return running % 24
}

// offset to right-align the action col within the grid (Ant Pro calcSubmitterOffset):
// when the action fits on the current last row, offset fills the gap to the right edge;
// otherwise the action wraps to a new row and is right-aligned there.
function getActionOffset(lastRowUsedSpan: number, actionSpan: number): number {
  const offsetSpan = lastRowUsedSpan + actionSpan
  if (offsetSpan > 24)
    return 24 - actionSpan
  return 24 - offsetSpan
}

export function useForm(options: undefined): [null, Recordable]
export function useForm<T extends object>(options: FormOptions<T>): FormReturnType<T>
export function useForm<T extends object>(options?: FormOptions<T>): FormReturnType<T> | [null, Recordable] {
  if (!options || !options.schemas?.length) {
    return [null, {}]
  }

  const { schemas = [], rules = {}, colSpan = 24, defaultData, disabled = false, inline = false, collapsible = false, expandText = 'Expand', collapseText = 'Collapse', size, rowGutter = 20, labelWidth, labelSuffix = '', labelPosition = 'left', 'validate-on-rule-change': validateOnRuleChange = true, enterCallback, customComponent, 'scrollTo-error': scrollToError = false, 'scroll-into-view-options': scrollIntoViewOptions = true, 'status-icon': statusIcon = false, 'require-asterisk-position': requireAsteriskPosition = 'left', 'show-message': showMessage = true, 'inline-message': inlineMessage = false,
  } = options

  type ComponentsKey = DefaultComponentKey | DefaultComponentKey & keyof typeof customComponent
  const components: Record<ComponentsKey, Component> | Record<string, Component> = {}
  if (customComponent) {
    Object.assign(components, defaultComponent, customComponent)
  }
  else {
    Object.assign(components, defaultComponent)
  }

  // initial form data
  const initFormData = schemas.reduce((prev, cur) => {
    const prop = cur.prop
    const propArr = prop.split('.')
    if (propArr?.length < 2) {
      prev[prop] = undefined
    }
    else {
      setDeepProperty(prev, propArr, undefined)
    }
    return prev
  }, {} as Recordable)

  // default form data
  const defaultFormData = defaultData || initFormData

  const copyInitFormData = JSON.parse(JSON.stringify(defaultFormData))

  const formData = ref<T>(defaultFormData as T)
  const formInstanceRef = ref<InstanceType<typeof ElForm>>()

  // get component by type
  function getComponent(type: FormItemType) {
    if (type && typeof type !== 'string') {
      return type as CustomRender
    }
    return components[type as ComponentsKey] as Component
  }

  const FormComp = defineComponent((props, { slots }) => {
    const formRef = useTemplateRef<InstanceType<typeof ElForm>>(
      'formRef',
    )

    /**
     * get data value
     * @data data object
     * @prop bind prop
     * eg:
     *   prop: 'user.name'
     *   data: {
     *     user: {
     *       usename: 'vuecraft',
     *     }
     *   }
     */
    function getFormData(data: T, prop: string) {
      const propArr = prop.split('.')
      if (propArr?.length < 2)
        return (data as Recordable)[prop] ?? undefined

      let value: unknown = data
      for (const propItem of propArr) {
        if (value === undefined || value === null) {
          return undefined
        }
        if (typeof value !== 'object') {
          return undefined
        }
        value = (value as Recordable)[propItem]
      }
      return value
    }

    function setFormData(data: Recordable, prop: string, value: unknown) {
      const propArr = prop.split('.')
      if (propArr?.length < 2) {
        data[prop] = value
        return
      }
      setDeepProperty(data, propArr, value)
    }

    // enter event
    function handleEnter() {
      enterCallback?.()
    }

    // render form item
    const renderFormItem = (schema: FormSchema<T>, slots: Slots) => {
      // custom render component
      if (isFunc(schema.type)) {
        return h(schema.type, {})
      }
      // render formItem component
      return h(ElFormItem, {
        label: schema.label,
        prop: schema.prop,
        size,
      }, () => {
        // render slots
        // eg #prop
        if (slots[schema.prop]) {
          return slots[schema.prop]?.()
        }
        // render type component
        const component = getComponent(schema.type)
        if (!component) {
          return null
        }
        return h(component, {
          'modelValue': getFormData(formData.value, schema.prop),
          'onUpdate:modelValue': (val: unknown) => {
            return setFormData(formData.value, schema.prop, val)
          },
          'onKeydown': (e: KeyboardEvent) => {
            // ignore ctrl key and meta key
            // eg: textarea ctrl + enter will \n
            if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
              e.preventDefault()
              e.stopPropagation()
              handleEnter()
            }
          },
          // form component props
          ...schema.componentProps || {},
        })
      })
    }

    // collapse state. the grid-based collapse only applies to non-inline (grid)
    // forms — inline items flow freely and have no well-defined "first row",
    // so in inline mode all items are always shown and no trigger is rendered.
    const collapsed = ref(Boolean(collapsible))
    const firstRowSchemas = getFirstRowSchemas(schemas, colSpan)
    const hasOverflow = schemas.length > firstRowSchemas.length
    const effectiveSchemas = computed(() => {
      return !inline && collapsible && collapsed.value ? firstRowSchemas : schemas
    })
    const showCollapseTrigger = !inline && collapsible && hasOverflow

    // render form items
    const renderFormItems = (slots: Slots) => {
      return effectiveSchemas.value.map((schema) => {
        if (inline) {
          return renderFormItem(schema, slots)
        }
        return h(ElCol, {
          span: schema.span ? schema.span : colSpan,
          propItem: schema.prop,
        }, () => renderFormItem(schema, slots))
      })
    }

    // render collapse trigger (placed inside the action column, right-aligned)
    function renderCollapseTrigger() {
      const isCollapsed = collapsed.value
      const text = isCollapsed ? expandText : collapseText
      return h(ElLink, {
        type: 'primary',
        underline: false,
        onClick: () => {
          collapsed.value = !collapsed.value
        },
      }, () => [
        h('span', text),
        h('span', {
          class: 'vk-form__collapse-icon',
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1em',
            height: '1em',
            lineHeight: 1,
            marginLeft: '4px',
            verticalAlign: 'middle',
            overflow: 'visible',
            flexShrink: 0,
          },
        }, [h('svg', {
          viewBox: '0 0 1024 1024',
          width: '1em',
          height: '1em',
          fill: 'currentColor',
          style: {
            display: 'block',
            width: '1em',
            height: '1em',
            overflow: 'visible',
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s',
          },
        }, [h('path', { d: 'M858.4 311.7H165.6c-19.4 0-30.4 13.6-30.4 28.8 0 6.4 2.2 12.8 6.7 18.9l346.4 424.3c8.8 10.8 22.9 16.3 35.7 16.3 12.8 0 26.4-5.5 35.2-16.3l346.4-424.3c4.5-6.1 6.7-12.5 6.7-18.9 0-15.1-11-28.8-30.4-28.8z' })])]),
      ])
    }

    // render the action column (footer + trigger) as the last ElCol.
    // Ant Pro style: the action occupies one field slot (colSpan) and is
    // right-aligned via `offset`; it wraps to a new row when the last field
    // row cannot fit it (e.g. colSpan 24 / a single full-width field).
    function renderActionCol(slots: Slots) {
      const actionSpan = colSpan
      const lastRowUsedSpan = getLastRowUsedSpan(effectiveSchemas.value, colSpan)
      const offset = getActionOffset(lastRowUsedSpan, actionSpan)
      const footer = slots?.footer?.() ?? []
      const content = [...footer, renderCollapseTrigger()]
      return h(ElCol, { span: actionSpan, offset }, () => h('div', {
        class: 'vk-form__action',
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        },
      }, content))
    }

    onMounted(async () => {
      await nextTick()
      formInstanceRef.value = formRef.value!
    })

    const formRules = computed<FormRules<Recordable>>(() => {
      if (isFunc(rules)) {
        const ruleRes = (rules as FormRuleFn<T>)?.(formData.value) ?? undefined
        return ruleRes as FormRules<Recordable>
      }
      return rules as FormRules<Recordable>
    })

    return () => {
      return h(ElForm, {
        model: formData.value,
        rules: formRules.value,
        size,
        validateOnRuleChange,
        labelWidth,
        labelPosition,
        labelSuffix,
        ref: 'formRef',
        inline,
        disabled,
        scrollToError,
        scrollIntoViewOptions,
        statusIcon,
        requireAsteriskPosition,
        showMessage,
        inlineMessage,
        ...props,
      }, () => {
        const children: unknown[] = []
        if (inline) {
          children.push(renderFormItems(slots))
          if (slots?.footer)
            children.push(slots.footer())
        }
        else if (showCollapseTrigger) {
          children.push(h(ElRow, {
            gutter: rowGutter,
            align: 'middle',
          }, () => [
            ...renderFormItems(slots),
            renderActionCol(slots),
          ]))
        }
        else {
          children.push(h(ElRow, {
            gutter: rowGutter,
          }, () => renderFormItems(slots)))
          if (slots?.footer)
            children.push(slots.footer())
        }
        return children
      })
    }
  })

  async function validate(callback?: (data: T) => void) {
    return await formInstanceRef.value?.validate((valid) => {
      if (valid)
        callback?.(formData.value)
    })
  }

  function reset() {
    formData.value = copyInitFormData
    formInstanceRef.value?.resetFields()
  }

  function getData() {
    return formData.value
  }

  function setData(newData: T) {
    formData.value = newData
  }

  return [
    FormComp,
    {
      validate,
      reset,
      getData,
      setData,
    },
  ]
}
