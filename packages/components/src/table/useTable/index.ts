import type { TableProps } from 'element-plus'
import type { TableColumnProps } from 'element-plus/es/components/table/src/table-column/defaults.mjs'
import type { Component, VNode } from 'vue'
import { isFunc } from '@vuetkit/shared'
import { ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, h } from 'vue'

type DefaultRow = Record<PropertyKey, any>

export interface TableColumnOptions<T extends DefaultRow> extends TableColumnProps<T> {
  // Custom render
  render?: (row: T) => VNode | string
  // Add children columns
  children?: TableColumnOptions<T>[]
  // From TableColumnProps
  prop?: string
}

export interface TableOptions<T extends DefaultRow> extends TableProps<T> {
  // Columns
  columns: TableColumnOptions<T>[]
  // Align
  align?: 'left' | 'center' | 'right'
  // Header-Align
  headerAlign?: 'left' | 'center' | 'right'
}

export type TableReturn = [
  // Use TableComp in template
  Component,
]

export function useTable<T extends DefaultRow>(options: TableOptions<T>): TableReturn {
  const { columns, align, headerAlign, ...rest } = options

  const TableComp = defineComponent((props, { slots }) => {
    const renderTableItemNodes = (column: TableColumnOptions<T>) => {
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
