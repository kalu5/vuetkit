import type { TableColumnCtx, TableProps } from 'element-plus'
import type { Component, VNode } from 'vue'
import { isFunc } from '@vuetkit/shared'
import { ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, h } from 'vue'

type DefaultRow = Record<PropertyKey, any>

export interface TableColumn<T extends DefaultRow> {
  // Custom render
  render?: (row: T) => VNode | string
  // Add children columns
  children?: TableColumn<T>[]
  // From TableColumnCtx
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  showOverflowTooltip?: boolean
  sortable?: boolean | string
  sortMethod?: (a: T, b: T) => number
  sortBy?: string | string[]
  sortOrders?: ('ascending' | 'descending')[]
  resizable?: boolean
  formatter?: (row: T, column: TableColumnCtx<T>, cellValue: any, index: number) => any
  type?: 'selection' | 'index' | 'expand'
  selectable?: (row: T, index: number) => boolean
  reserveSelection?: boolean
  index?: number | ((index: number) => number)
}

export interface TableOptions<T extends DefaultRow> extends TableProps<T> {
  // Columns
  columns: TableColumn<T>[]
  // align
  align?: 'left' | 'center' | 'right'
  // header-align
  headerAlign?: 'left' | 'center' | 'right'
}

export type TableReturn = [
  // Use TableComp in template
  Component,
]

export function useTable<T extends DefaultRow>(options: TableOptions<T>): TableReturn {
  const { columns, align, headerAlign, ...rest } = options

  const TableComp = defineComponent((props, { slots }) => {
    const renderTableItemNodes = (column: TableColumn<T>) => {
      // Custom render
      if (isFunc(column.render)) {
        return {
          default: ({ row }: { row: T }) => column.render!(row as T),
        }
      }
      // Render Multiple TableHeader
      const tableItemNodes: unknown[] = []
      if (column?.children?.length) {
        /* eslint-disable-next-line ts/no-use-before-define */
        tableItemNodes.push(...renderTableItems(column.children))
      }
      return () => tableItemNodes
    }

    const renderTableItem = (column: TableColumn<T>) => {
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

    const renderTableItems = (columns: TableColumn<T>[]) => {
      return columns.filter(Boolean).map((column) => {
        return renderTableItem(column)
      })
    }

    return () => {
      return h(ElTable, {
        ...rest,
        ...props,
      }, {
        default: () => {
          const tableNodes: unknown[] = []
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
      })
    }
  })

  return [TableComp]
}
