# useForm

Quickly create a form with ElementPlus.

::: tip :zap:Feature

1. Quickly and Simply.
2. Everything can be configured.
3. Support dynamic validation.
4. Support change form data dynamically.
5. Support custom components.
   :::

- Common examples are listed in the documents, For more configurations, refer to options.

## Basic Usage

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'

const [FormComp, { validate, getData }] = useForm<{
  username: string
}>({
  schemas: [
    {
      prop: 'username',
      label: 'username',
      type: 'input',
    },
  ],
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## Validation

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'

const [FormComp, { validate, getData }] = useForm<{
  username: string
}>({
  schemas: [
    {
      prop: 'username',
      label: 'username',
      type: 'input',
    },
  ],
  rules: {
    username: [
      {
        required: true,
        message: 'Please input username',
        trigger: 'blur',
      },
    ],
  },
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## Dynamic Validation

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'

const [FormComp, { validate, getData }] = useForm<{
  username: string
  password: string
}>({
  schemas: [
    {
      prop: 'username',
      label: 'username',
      type: 'input',
    },
    {
      prop: 'password',
      label: 'password',
      type: 'input',
    },
  ],
  rules: (data) => {
    return {
      username: [
        {
          required: true,
          message: 'Please input username',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: Boolean(data?.username),
          message: 'Please input password',
          trigger: 'blur',
        },
      ],
    }
  },
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## ColSpan

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'

const [FormComp, { validate, getData }] = useForm<{
  username: string
  password: string
}>({
  schemas: [
    {
      prop: 'username',
      label: 'username',
      type: 'input',
    },
    {
      prop: 'password',
      label: 'password',
      type: 'input',
    },
  ],
  rules: (data) => {
    return {
      username: [
        {
          required: true,
          message: 'Please input username',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: Boolean(data?.username),
          message: 'Please input password',
          trigger: 'blur',
        },
      ],
    }
  },
  colSpan: 12,
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## Inline

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'

const [FormComp, { validate, getData }] = useForm<{
  username: string
  password: string
}>({
  schemas: [
    {
      prop: 'username',
      label: 'username',
      type: 'input',
    },
    {
      prop: 'password',
      label: 'password',
      type: 'input',
    },
  ],
  rules: (data) => {
    return {
      username: [
        {
          required: true,
          message: 'Please input username',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: Boolean(data?.username),
          message: 'Please input password',
          trigger: 'blur',
        },
      ],
    }
  },
  inline: true,
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## Collapse

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'

const [FormComp, { validate, getData }] = useForm<{
  username: string
  password: string
  email: string
  phone: string
}>({
  schemas: [
    { prop: 'username', label: 'username', type: 'input' },
    { prop: 'password', label: 'password', type: 'input' },
    { prop: 'email', label: 'email', type: 'input' },
    { prop: 'phone', label: 'phone', type: 'input' },
  ],
  colSpan: 12,
  collapsible: true,
  expandText: 'Expand',
  collapseText: 'Collapse',
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## Change Form Data

- setting default data
- change data dynamically

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'
import { onMounted } from 'vue'

const [FormComp, { validate, getData, setData }] = useForm<{
  username: string
}>({
  schemas: [
    {
      prop: 'username',
      label: 'username',
      type: 'input',
    },
  ],
  defaultData: {
    username: 'test111',
  },
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}

onMounted(() => {
  setTimeout(() => {
    setData({
      username: 'test222',
    })
  }, 1500)
})
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## Add Custom Component

```vue
<script setup lang="ts">
import { useForm } from '@vuecraft/components'
import CInput from './components/CInput.vue'

const [FormComp, { validate, getData }] = useForm<{
  username: string
}>({
  schemas: [
    {
      prop: 'username',
      label: 'username',
      type: 'input',
    },
  ],
  customComponent: {
    'c-input': CInput,
  },
})

function submit() {
  validate((data) => {
    console.log(data)
    const postData = getData()
    console.log(postData)
  })
}
</script>

<template>
  <div>
    <FormComp>
      <template #footer>
        <button @click.stop.prevent="submit">
          Submit
        </button>
      </template>
    </FormComp>
  </div>
</template>
```

## Form Options Type

```ts
interface FormOptions<T> {
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
```

## Form Schema Type

```ts
interface FormSchema<T> {
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
```

## Form Return Type

```ts
type FormReturnType<T extends object> = [
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
```
