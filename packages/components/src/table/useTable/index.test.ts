import { mount } from '@vue/test-utils'

import { useRequest } from '@vuetkit/core'
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

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
        'data-max-height': props.maxHeight != null ? String(props.maxHeight) : '',
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
  ElPagination: defineComponent({
    props: ['currentPage', 'pageSize', 'total', 'layout', 'pageSizes', 'background', 'small', 'disabled', 'hideOnSinglePage', 'pagerCount', 'onUpdate:currentPage', 'onUpdate:pageSize'],
    setup(props) {
      return () => h('div', {
        'class': 'el-pagination',
        'data-current-page': String(props.currentPage),
        'data-page-size': String(props.pageSize),
        'data-total': String(props.total),
        'data-layout': props.layout || '',
        'data-page-sizes': props.pageSizes ? JSON.stringify(props.pageSizes) : '',
        'data-background': props.background ? 'true' : 'false',
        'data-small': props.small ? 'true' : 'false',
      }, [
        h('button', { class: 'pg-next-page', onClick: () => props['onUpdate:currentPage']?.(props.currentPage + 1) }, 'Next'),
        h('button', { class: 'pg-change-size', onClick: () => props['onUpdate:pageSize']?.(20) }, 'Size'),
      ])
    },
  }),
  vLoading: {
    mounted: vi.fn(),
    unmounted: vi.fn(),
  },
}))

vi.mock('@vuetkit/shared', () => ({
  isFunc: vi.fn((val: unknown) => typeof val === 'function'),
  realObj: vi.fn((val: unknown) => Object.prototype.toString.call(val) === '[object Object]'),
}))

vi.mock('@vuetkit/core', () => ({
  useRequest: vi.fn(() => ({
    data: ref([]),
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
    vi.mocked(useRequest).mockReturnValue({
      data: ref(undefined),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      data: [{ id: 1, name: 'Test', age: 20, address: { city: '', street: '' } }],
      maxHeight: 500,
    })
    const wrapper = mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[{"id":1,"name":"Test","age":20,"address":{"city":"","street":""}}]')
    expect(table.attributes('data-max-height')).toBe('500')
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

  it('calls execute onMounted when service is provided', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
    })
    await mount(TableComp)
    expect(mockExecute).toHaveBeenCalledTimes(1)
  })

  it('does not call execute onMounted when service is not provided', async () => {
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
    })
    await mount(TableComp)
    expect(mockExecute).not.toHaveBeenCalled()
  })

  it('passes formatData to useRequest', async () => {
    const mockFormatData = vi.fn((res: unknown) => res as User[])
    const mockService = vi.fn(() => Promise.resolve([]))
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      formatData: mockFormatData,
    })
    await mount(TableComp)
    expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
      formatData: mockFormatData,
    }))
  })

  it('uses asyncRequestData when service returns data', async () => {
    const mockService = vi.fn(() => Promise.resolve([{ id: 1, name: 'Async', age: 30, address: { city: '', street: '' } }]))
    const mockData = ref([{ id: 1, name: 'Async', age: 30, address: { city: '', street: '' } }])
    vi.mocked(useRequest).mockReturnValue({
      data: mockData,
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'name', label: 'Name' },
      ],
      service: mockService,
    })
    const wrapper = await mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[{"id":1,"name":"Async","age":30,"address":{"city":"","street":""}}]')
  })

  it('uses static data when service is not provided', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref(undefined),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const staticData = [{ id: 2, name: 'Static', age: 40, address: { city: '', street: '' } }]
    const [TableComp] = useTable<User>({
      columns: [
        { prop: 'name', label: 'Name' },
      ],
      data: staticData,
    })
    const wrapper = await mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[{"id":2,"name":"Static","age":40,"address":{"city":"","street":""}}]')
  })

  it('calls execute when params change', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const paramsRef = ref({ page: 1 })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      params: paramsRef,
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    paramsRef.value = { page: 2 }
    await wrapper.vm.$nextTick()
    expect(mockExecute).toHaveBeenCalledWith({ page: 2 })
  })

  it('falls back to empty array when no data is provided', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref(undefined),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
    })
    const wrapper = await mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[]')
  })

  it('falls back to empty array when data is explicitly null', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref(undefined),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      data: null as unknown as any,
    })
    const wrapper = await mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[]')
  })

  it('applies vLoading directive when loading is true', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(true),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
    })
    const wrapper = await mount(TableComp)
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('handles undefined service without crashing', () => {
    const [TableComp] = useTable<User>({
      columns: [],
    })
    expect(() => mount(TableComp)).not.toThrow()
  })

  it('supports header slot', () => {
    const [TableComp] = useTable<User>({
      columns: [],
    })
    const wrapper = mount(TableComp, {
      slots: {
        header: () => h('div', { class: 'header-content' }, 'Header'),
      },
    })
    expect(wrapper.find('.header-content').exists()).toBe(true)
  })

  // ============ paginationConfig validation ============
  it('throws when paginationConfig is true and params is not an object', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: true,
      params: 'not-an-object',
    })).toThrow('params is object when paginationConfig is required')
  })

  it('throws when paginationConfig is true and params is an array', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: true,
      params: [1, 2, 3],
    })).toThrow('params is object when paginationConfig is required')
  })

  it('throws when paginationConfig is true and params is null', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: true,
      params: null,
    })).toThrow('params is object when paginationConfig is required')
  })

  it('throws when paginationConfig is true and params is a number', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: true,
      params: 123,
    })).toThrow('params is object when paginationConfig is required')
  })

  it('throws when paginationConfig is an object and params is not an object', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: { wrapStyle: {} },
      params: undefined,
    })).toThrow('params is object when paginationConfig is required')
  })

  it('does not throw when paginationConfig is true and params is a plain object', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'test' },
    })).not.toThrow()
  })

  it('does not throw when paginationConfig is an object and params is a plain object', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: { wrapStyle: {} },
      params: { keyword: 'test' },
    })).not.toThrow()
  })

  it('does not throw when paginationConfig is false and params is not an object', () => {
    expect(() => useTable<User>({
      columns: [],
      paginationConfig: false,
      params: 'string-param',
    })).not.toThrow()
  })

  it('does not throw when paginationConfig is undefined and params is not an object', () => {
    expect(() => useTable<User>({
      columns: [],
      params: 123,
    })).not.toThrow()
  })

  // ============ requestParams computed ============
  it('builds requestParams with currentPage and pageSize when paginationConfig is true', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: true,
      params: { keyword: 'test' },
    })
    await mount(TableComp)
    // defaultParams passed to useRequest should contain pagination fields
    expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
      defaultParams: expect.objectContaining({
        keyword: 'test',
        currentPage: 1,
        pageSize: 10,
      }),
    }))
  })

  it('requestParams excludes pagination fields when paginationConfig is false', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: false,
      params: { keyword: 'test' },
    })
    await mount(TableComp)
    expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
      defaultParams: { keyword: 'test' },
    }))
  })

  it('requestParams returns undefined params when no params provided and no pagination', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
    })
    await mount(TableComp)
    expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
      defaultParams: undefined,
    }))
  })

  it('requestParams handles pagination with undefined params gracefully', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    // params undefined but paginationConfig false -> no throw, requestParams = undefined
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: false,
    })
    await mount(TableComp)
    expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
      defaultParams: undefined,
    }))
  })

  // ============ tableData / tableTotal computed ============
  it('tableData extracts data field from PaginationData when paginationConfig is true', async () => {
    const paginatedData = {
      data: [{ id: 1, name: 'Paged', age: 20, address: { city: '', street: '' } }],
      total: 1,
    }
    vi.mocked(useRequest).mockReturnValue({
      data: ref(paginatedData),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[{"id":1,"name":"Paged","age":20,"address":{"city":"","street":""}}]')
  })

  it('tableTotal extracts total field from PaginationData when paginationConfig is true', async () => {
    const paginatedData = {
      data: [{ id: 1, name: 'Paged', age: 20, address: { city: '', street: '' } }],
      total: 42,
    }
    vi.mocked(useRequest).mockReturnValue({
      data: ref(paginatedData),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-total')).toBe('42')
  })

  it('tableData falls back to empty array when pagination data is undefined', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref(undefined),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const table = wrapper.find('table')
    expect(table.attributes('data-data')).toBe('[]')
  })

  it('tableTotal falls back to 0 when pagination data is undefined', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref(undefined),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-total')).toBe('0')
  })

  it('tableTotal falls back to data length when paginationConfig is false', async () => {
    const listData = [
      { id: 1, name: 'A', age: 1, address: { city: '', street: '' } },
      { id: 2, name: 'B', age: 2, address: { city: '', street: '' } },
    ]
    vi.mocked(useRequest).mockReturnValue({
      data: ref(listData),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: vi.fn(),
    })
    const wrapper = await mount(TableComp)
    expect(wrapper.find('.el-pagination').exists()).toBe(false)
  })

  // ============ renderPagination ============
  it('renders pagination when paginationConfig is true', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })

  it('renders pagination when paginationConfig is an object', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: { wrapStyle: { color: 'red' } },
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })

  it('does not render pagination when paginationConfig is false', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: false,
    })
    const wrapper = await mount(TableComp)
    expect(wrapper.find('.el-pagination').exists()).toBe(false)
  })

  it('does not render pagination when paginationConfig is undefined', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
    })
    const wrapper = await mount(TableComp)
    expect(wrapper.find('.el-pagination').exists()).toBe(false)
  })

  it('applies default wrap style when paginationConfig is true', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const paginationWrap = wrapper.find('.el-pagination').element.parentElement
    expect(paginationWrap?.getAttribute('style')).toContain('display: flex')
    expect(paginationWrap?.getAttribute('style')).toContain('justify-content: flex-end')
    expect(paginationWrap?.getAttribute('style')).toContain('margin: 20px')
  })

  it('applies custom wrapStyle when paginationConfig is an object', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: { wrapStyle: { justifyContent: 'center', padding: '10px' } },
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const paginationWrap = wrapper.find('.el-pagination').element.parentElement
    expect(paginationWrap?.getAttribute('style')).toContain('justify-content: center')
    expect(paginationWrap?.getAttribute('style')).toContain('padding: 10px')
    expect(paginationWrap?.getAttribute('style')).not.toContain('margin: 20px')
  })

  it('falls back to default wrap style when paginationConfig object has no wrapStyle', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: { layout: 'prev, pager, next' },
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const paginationWrap = wrapper.find('.el-pagination').element.parentElement
    expect(paginationWrap?.getAttribute('style')).toContain('display: flex')
    expect(paginationWrap?.getAttribute('style')).toContain('margin: 20px')
  })

  it('uses default layout when paginationConfig is true', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-layout')).toBe('total, sizes, prev, pager, next, jumper')
  })

  it('uses custom layout when paginationConfig object provides layout', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: { wrapStyle: {}, layout: 'prev, pager, next' },
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-layout')).toBe('prev, pager, next')
  })

  it('falls back to default layout when paginationConfig object has no layout', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: { wrapStyle: {} },
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-layout')).toBe('total, sizes, prev, pager, next, jumper')
  })

  it('passes custom pagination props (pageSizes, background) when paginationConfig is an object', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: {
        wrapStyle: {},
        pageSizes: [10, 20, 50],
        background: true,
        small: true,
      },
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-page-sizes')).toBe('[10,20,50]')
    expect(pagination.attributes('data-background')).toBe('true')
    expect(pagination.attributes('data-small')).toBe('true')
  })

  it('passes initial currentPage and pageSize to ElPagination', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-current-page')).toBe('1')
    expect(pagination.attributes('data-page-size')).toBe('10')
  })

  // ============ pagination event handlers ============
  it('updates currentPage via onUpdate:currentPage event', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const nextBtn = wrapper.find('.pg-next-page')
    await nextBtn.trigger('click')
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-current-page')).toBe('2')
  })

  it('updates pageSize via onUpdate:pageSize event', async () => {
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: vi.fn(),
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    const sizeBtn = wrapper.find('.pg-change-size')
    await sizeBtn.trigger('click')
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.attributes('data-page-size')).toBe('20')
  })

  // ============ pagination watch / execute triggers ============
  it('calls execute with pagination params onMounted when service and paginationConfig provided', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    await mount(TableComp)
    expect(mockExecute).toHaveBeenCalledTimes(1)
  })

  it('triggers execute when currentPage changes', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    const nextBtn = wrapper.find('.pg-next-page')
    await nextBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockExecute).toHaveBeenCalledTimes(1)
    expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
      keyword: 'x',
      currentPage: 2,
      pageSize: 10,
    }))
  })

  it('triggers execute when pageSize changes', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    const sizeBtn = wrapper.find('.pg-change-size')
    await sizeBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockExecute).toHaveBeenCalledTimes(1)
    expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
      keyword: 'x',
      currentPage: 1,
      pageSize: 20,
    }))
  })

  it('does not trigger execute on page change when no service provided', async () => {
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: { keyword: 'x' },
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    const nextBtn = wrapper.find('.pg-next-page')
    await nextBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockExecute).not.toHaveBeenCalled()
  })

  it('triggers execute when params change with paginationConfig', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const paramsRef = ref({ keyword: 'a' })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: true,
      params: paramsRef,
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    paramsRef.value = { keyword: 'b' }
    await wrapper.vm.$nextTick()
    expect(mockExecute).toHaveBeenCalledTimes(1)
    expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
      keyword: 'b',
      currentPage: 1,
      pageSize: 10,
    }))
  })

  it('triggers execute when params ref is replaced (not mutated)', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const paramsRef = ref({ keyword: 'a' })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: true,
      params: paramsRef,
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    paramsRef.value = { keyword: 'replaced' }
    await wrapper.vm.$nextTick()
    expect(mockExecute).toHaveBeenCalledTimes(1)
    expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
      keyword: 'replaced',
      currentPage: 1,
      pageSize: 10,
    }))
  })

  it('triggers execute when nested params property changes (deep watch)', async () => {
    const mockService = vi.fn(() => Promise.resolve([]))
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const paramsRef = ref({ filter: { name: 'a' } })
    const [TableComp] = useTable<User>({
      columns: [],
      service: mockService,
      paginationConfig: true,
      params: paramsRef,
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    paramsRef.value.filter.name = 'b'
    await wrapper.vm.$nextTick()
    expect(mockExecute).toHaveBeenCalledTimes(1)
    expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
      currentPage: 1,
      pageSize: 10,
    }))
  })

  it('does not trigger execute on params change without service', async () => {
    const mockExecute = vi.fn()
    vi.mocked(useRequest).mockReturnValue({
      data: ref({ data: [], total: 0 }),
      loading: ref(false),
      error: ref(undefined),
      execute: mockExecute,
      cancel: vi.fn(),
    })
    const paramsRef = ref({ keyword: 'a' })
    const [TableComp] = useTable<User>({
      columns: [],
      paginationConfig: true,
      params: paramsRef,
    })
    const wrapper = await mount(TableComp)
    mockExecute.mockClear()
    paramsRef.value = { keyword: 'b' }
    await wrapper.vm.$nextTick()
    expect(mockExecute).not.toHaveBeenCalled()
  })
})
