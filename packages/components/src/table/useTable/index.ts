import type { RequestService } from '@vuetkit/core'
import type { PaginationProps, TableProps } from 'element-plus'
import type { TableColumnProps } from 'element-plus/es/components/table/src/table-column/defaults.mjs'
import type { Component, CSSProperties, MaybeRef, VNode, VNodeArrayChildren } from 'vue'
import { useRequest } from '@vuetkit/core'
import { isFunc, realObj } from '@vuetkit/shared'
import { ElPagination, ElTable, ElTableColumn, vLoading } from 'element-plus'
import { computed, defineComponent, h, onMounted, reactive, toValue, watch, withDirectives } from 'vue'

type DefaultRow = Record<PropertyKey, any>

interface PaginationData<T> {
  data: T[]
  total: number
}

export interface TableColumnOptions<T extends DefaultRow> extends TableColumnProps<T> {
  // Custom render
  render?: (row: T) => VNode | string
  // Add children columns
  children?: TableColumnOptions<T>[]
  // From TableColumnProps
  prop?: string
}

export interface PaginationOptions extends Partial<PaginationProps> {
  // Pagination wrap Style
  wrapStyle?: CSSProperties
}

export interface TableOptions<T extends DefaultRow> extends TableProps<T> {
  // Columns
  columns: TableColumnOptions<T>[]
  // Service
  service?: RequestService
  // Service Params
  params?: MaybeRef<unknown> | unknown
  // Format Request Data
  formatData?: (res: unknown) => T[]
  // Align
  align?: 'left' | 'center' | 'right'
  // Header-Align
  headerAlign?: 'left' | 'center' | 'right'
  // Pagination Config
  paginationConfig?: boolean | PaginationOptions
  // Table Wrap Style
  tableWrapStyle?: CSSProperties
}

export type TableReturn = [
  // Use TableComp in template
  Component,
]

export function useTable<T extends DefaultRow>(options: TableOptions<T>): TableReturn {
  const { columns = [], service, params, formatData, align, headerAlign, paginationConfig, tableWrapStyle = {}, data = [] as T[], ...rest } = options

  if (paginationConfig && !realObj(toValue(params))) {
    throw new Error('params is object when paginationConfig is required')
  }

  const TableComp = defineComponent((props, { slots }) => {
    const pageInfo = reactive({
      pageSize: 10,
      currentPage: 1,
    })

    const requestParams = computed(() => {
      if (paginationConfig) {
        return {
          ...(toValue(params) || {}),
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize,
        }
      }
      return toValue(params)
    })

    const { data: asyncRequestData, loading, execute } = useRequest<T[] | PaginationData<T>>(service!, {
      manual: false,
      defaultParams: requestParams.value,
      formatData,
    })
    const renderTableItemNodes = (column: TableColumnOptions<T>) => {
      if (isFunc(column.render)) {
        return {
          default: ({ row }: { row: T }) => column.render!(row as T),
        }
      }
      const tableItemNodes: VNodeArrayChildren = []
      if (column?.children?.length) {
        /* eslint-disable-next-line ts/no-use-before-define */
        tableItemNodes.push(...renderTableItems(column.children))
      }
      return tableItemNodes.length ? () => tableItemNodes : undefined
    }

    const renderTableItem = (column: TableColumnOptions<T>) => {
      const { align: columnAlign, headerAlign: columnHeaderAlign } = column
      // Extend table align and headerAlign
      const tableItemAlign = columnAlign || align || 'left'
      const tableItemHeaderAlign = columnHeaderAlign || headerAlign || 'left'
      return h(ElTableColumn, {
        ...column,
        align: tableItemAlign,
        headerAlign: tableItemHeaderAlign,
      }, renderTableItemNodes(column))
    }

    const renderTableItems = (columns: TableColumnOptions<T>[]) => {
      return columns.filter(Boolean).map((column) => {
        return renderTableItem(column)
      })
    }

    onMounted(() => {
      if (service) {
        execute()
      }
    })

    const defaultPaginationLayout = 'total, sizes, prev, pager, next, jumper'
    const defaultPaginationWrapStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      margin: '20px',
    }

    watch(() => toValue(params), () => {
      if (service) {
        execute(requestParams.value)
      }
    }, {
      deep: true,
    })

    watch(() => [pageInfo.currentPage, pageInfo.pageSize], () => {
      if (service) {
        execute(requestParams.value)
      }
    })

    const tableData = computed(() => {
      if (paginationConfig) {
        return (asyncRequestData.value as PaginationData<T>)?.data || []
      }
      return asyncRequestData.value || data || []
    })

    const tableTotal = computed(() => {
      return (asyncRequestData.value as PaginationData<T>)?.total || 0
    })

    const renderTable = () => {
      return withDirectives(h(ElTable, {
        ...rest,
        ...props,
        data: tableData.value as T[],
      }, {
        default: () => {
          const tableNodes: VNodeArrayChildren = []
          if (columns.length) {
            tableNodes.push(...renderTableItems(columns))
          }
          // Slot actions column
          if (slots.actions) {
            tableNodes.push(slots.actions())
          }
          return tableNodes
        },
        append: slots?.append,
        empty: slots?.empty,
      }), [
        [vLoading, loading.value],
      ])
    }

    const renderPagination = () => {
      return h('div', {
        style: paginationConfig === true ? defaultPaginationWrapStyle : (paginationConfig as PaginationOptions)?.wrapStyle || defaultPaginationWrapStyle,
      }, [
        h(ElPagination, {
          'currentPage': pageInfo.currentPage,
          'pageSize': pageInfo.pageSize,
          'total': tableTotal.value,
          ...paginationConfig === true ? {} : paginationConfig,
          'layout': paginationConfig === true ? defaultPaginationLayout : (paginationConfig as PaginationProps)?.layout || defaultPaginationLayout,
          'onUpdate:currentPage': (val: number) => {
            pageInfo.currentPage = val
          },
          'onUpdate:pageSize': (val: number) => {
            pageInfo.pageSize = val
          },
        }),
      ])
    }

    function renderTableWrapChildNodes() {
      const childNodes: VNodeArrayChildren = []
      if (slots?.header) {
        childNodes.push(slots.header())
      }
      childNodes.push(renderTable())
      if (paginationConfig) {
        childNodes.push(renderPagination())
      }
      return childNodes
    }

    return () => {
      return h('div', {
        style: tableWrapStyle,
      }, renderTableWrapChildNodes())
    }
  })

  return [TableComp]
}
