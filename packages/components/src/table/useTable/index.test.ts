import { mount } from '@vue/test-utils'

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useTable } from './index'

vi.mock('element-plus', () => ({
  ElTable: defineComponent({
    props: ['data', 'border', 'stripe', 'size', 'maxHeight'],
    setup(props, { slots }) {
      return () => h('table', {
        'data-data': JSON.stringify(props.data),
        'data-border': props.border ? 'true' : 'false',
        'data-stripe': props.stripe ? 'true' : 'false',
        'data-size': props.size || '',
      }, [
        slots.default?.(),
        slots.append?.(),
        slots.empty?.(),
      ])
    },
  }),
  ElTableColumn: defineComponent({
    props: ['prop', 'label', 'align', 'headerAlign', 'children', 'render'],
    setup(props, { slots }) {
      return () => h('th', {
        'data-prop': props.prop || '',
        'data-label': props.label || '',
        'data-align': props.align || '',
        'data-header-align': props.headerAlign || '',
      }, slots.default?.({ row: { id: 1, name: 'Test', age: 20, address: { city: '', street: '' } } }))
    },
  }),
}))

vi.mock('@vuetkit/shared', () => ({
  isFunc: vi.fn((val: unknown) => typeof val === 'function'),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

interface User {
  id: number
  name: string
  age: number
  address: {
    city: string
    street: string
  }
}

describe('useTable', () => {
  it('returns a component', () => {
    const [TableComp] = useTable<User>({
      columns: [],
    })
    expect(TableComp).toBeDefined()
    expect(typeof TableComp).toBe('object')
  })

  it('renders table with basic columns', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: 'Name' },
      ],
    })
    const wrapper = mount(TableComp)
    const columns = wrapper.findAll('th')
    expect(columns.length).toBe(2)
    expect(columns[0].attributes('data-prop')).toBe('id')
    expect(columns[0].attributes('data-label')).toBe('ID')
    expect(columns[1].attributes('data-prop')).toBe('name')
    expect(columns[1].attributes('data-label')).toBe('Name')
  })

  it('renders table with custom render function', () => {
    const customRender = vi.fn((row: User) => h('span', { class: 'custom-render' }, row.name))
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'name', label: 'Name', render: customRender },
      ],
    })
    const wrapper = mount(TableComp)
    expect(wrapper.find('.custom-render').exists()).toBe(true)
    expect(customRender).toHaveBeenCalled()
  })

  it('renders table with nested children columns', () => {
    const [TableComp] = useTable<User>({
      columns: [
        {
          label: 'Personal',
          children: [
            { prop: 'name', label: 'Name' },
            { prop: 'age', label: 'Age' },
          ],
        },
      ],
    })
    const wrapper = mount(TableComp)
    const columns = wrapper.findAll('th')
    expect(columns.length).toBe(3)
    expect(columns[0].attributes('data-label')).toBe('Personal')
    expect(columns[1].attributes('data-prop')).toBe('name')
    expect(columns[2].attributes('data-prop')).toBe('age')
  })

  it('applies global align to all columns', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: 'Name' },
      ],
      align: 'center',
    })
    const wrapper = mount(TableComp)
    const columns = wrapper.findAll('th')
    columns.forEach((col) => {
      expect(col.attributes('data-align')).toBe('center')
    })
  })

  it('applies global headerAlign to all columns', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: 'Name' },
      ],
      headerAlign: 'right',
    })
    const wrapper = mount(TableComp)
    const columns = wrapper.findAll('th')
    columns.forEach((col) => {
      expect(col.attributes('data-header-align')).toBe('right')
    })
  })

  it('column-level align overrides global align', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID', align: 'right' },
        { prop: 'name', label: 'Name' },
      ],
      align: 'center',
    })
    const wrapper = mount(TableComp)
    const columns = wrapper.findAll('th')
    expect(columns[0].attributes('data-align')).toBe('right')
    expect(columns[1].attributes('data-align')).toBe('center')
  })

  it('column-level headerAlign overrides global headerAlign', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID', headerAlign: 'left' },
        { prop: 'name', label: 'Name' },
      ],
      headerAlign: 'center',
    })
    const wrapper = mount(TableComp)
    const columns = wrapper.findAll('th')
    expect(columns[0].attributes('data-header-align')).toBe('left')
    expect(columns[1].attributes('data-header-align')).toBe('center')
  })

  it('uses default align when not specified', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
      ],
    })
    const wrapper = mount(TableComp)
    const column = wrapper.find('th')
    expect(column.attributes('data-align')).toBe('left')
    expect(column.attributes('data-header-align')).toBe('left')
  })

  it('passes rest props to ElTable', () => {
    const [TableComp] = useTable<User>({
      columns: [],
      border: true,
      stripe: true,
      size: 'small',
    })
    const wrapper = mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-border')).toBe('true')
    expect(table.attributes('data-stripe')).toBe('true')
    expect(table.attributes('data-size')).toBe('small')
  })

  it('passes component props to ElTable', () => {
    const [TableComp] = useTable<User>({
      columns: [],
    })
    const wrapper = mount(TableComp, {
      props: {
        data: [{ id: 1, name: 'Test', age: 20, address: { city: '', street: '' } }],
        maxHeight: 500,
      },
    })
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[{"id":1,"name":"Test","age":20,"address":{"city":"","street":""}}]')
  })

  it('supports actions slot', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
      ],
    })
    const wrapper = mount(TableComp, {
      slots: {
        actions: () => h('th', { class: 'actions-column' }, 'Actions'),
      },
    })
    expect(wrapper.find('.actions-column').exists()).toBe(true)
  })

  it('supports append slot', () => {
    const [TableComp] = useTable<User>({
      columns: [],
    })
    const wrapper = mount(TableComp, {
      slots: {
        append: () => h('div', { class: 'append-content' }, 'Append'),
      },
    })
    expect(wrapper.find('.append-content').exists()).toBe(true)
  })

  it('supports empty slot', () => {
    const [TableComp] = useTable<User>({
      columns: [],
    })
    const wrapper = mount(TableComp, {
      slots: {
        empty: () => h('div', { class: 'empty-content' }, 'No data'),
      },
    })
    expect(wrapper.find('.empty-content').exists()).toBe(true)
  })

  it('handles empty columns array gracefully', () => {
    const [TableComp] = useTable<User>({
      columns: [],
    })
    expect(() => mount(TableComp)).not.toThrow()
  })

  it('handles column without children and render', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
      ],
    })
    const wrapper = mount(TableComp)
    expect(wrapper.find('th').exists()).toBe(true)
  })

  it('handles column with children but without render', () => {
    const [TableComp] = useTable<User>({
      columns: [
        {
          label: 'Personal',
          children: [
            { prop: 'name', label: 'Name' },
          ],
        },
      ],
    })
    const wrapper = mount(TableComp)
    expect(wrapper.find('th').exists()).toBe(true)
  })

  it('passes all column properties to ElTableColumn', () => {
    const [TableComp] = useTable<User>({
      columns: [
        {
          prop: 'name',
          label: 'Name',
          width: '200px',
          minWidth: '100px',
          fixed: true,
        },
      ],
    })
    const wrapper = mount(TableComp)
    const column = wrapper.find('th')
    expect(column.attributes('data-prop')).toBe('name')
    expect(column.attributes('data-label')).toBe('Name')
  })

  it('renders custom render with row data', () => {
    const customRender = vi.fn((row: User) => h('span', { class: 'custom-render' }, `${row.id}-${row.name}`))
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: 'Name', render: customRender },
      ],
    })
    const wrapper = mount(TableComp)
    expect(wrapper.find('.custom-render').exists()).toBe(true)
    expect(customRender).toHaveBeenCalledWith({
      id: 1,
      name: 'Test',
      age: 20,
      address: { city: '', street: '' },
    })
  })

  it('handles column with both children and render', () => {
    const customRender = vi.fn(() => h('span', { class: 'custom-cell' }, 'Custom'))
    const [TableComp] = useTable<User>({
      columns: [
        {
          label: 'Personal',
          render: customRender,
          children: [
            { prop: 'name', label: 'Name' },
          ],
        },
      ],
    })
    const wrapper = mount(TableComp)
    expect(wrapper.find('th').exists()).toBe(true)
    expect(customRender).toHaveBeenCalled()
  })

  it('handles null column in columns array', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
        null as unknown as any,
        { prop: 'name', label: 'Name' },
      ],
    })
    expect(() => mount(TableComp)).not.toThrow()
  })

  it('handles undefined column in columns array', () => {
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'id', label: 'ID' },
        undefined as unknown as any,
        { prop: 'name', label: 'Name' },
      ],
    })
    expect(() => mount(TableComp)).not.toThrow()
  })
})
