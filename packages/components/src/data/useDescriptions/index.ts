import type { RequestService } from '@vuetkit/core'
import type { DescriptionItemProps, DescriptionProps } from 'element-plus'
import type { Component, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElDescriptions, ElDescriptionsItem, vLoading } from 'element-plus'
import { computed, defineComponent, h, withDirectives } from 'vue'

export interface DescriptionsColumn extends Partial<DescriptionItemProps> {
  // @desc Value of the column
  value?: string
  // @desc Render function of the column
  render?: (val: unknown) => VNode
  // @desc Render label of the column
  renderLabel?: (val: unknown) => VNode
}

export interface DescriptionsOptions<T> extends DescriptionProps {
  // @desc Columns of the descriptions
  columns: DescriptionsColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format descriptions data
  formatData?: (data: T) => DescriptionsColumn[]
}

export type DescriptionsReturnType = [
  Component,
]

export function useDescriptions<T>(options: DescriptionsOptions<T>) {
  const { columns = [], service, params, formatData, ...rest } = options

  const { data, loading } = service
    ? useRequest<DescriptionsColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const descriptionsColumns = computed(() => data?.value || columns)

  const DescriptionsComp = defineComponent((props, { slots }) => {
    const renderColumns = () => {
      return descriptionsColumns.value?.map((item) => {
        return h(ElDescriptionsItem, {
          ...item,
        }, {
          default: () => {
            // Custom render item content
            if (item?.render) {
              return item.render(item?.value)
            }
            return item?.value || ''
          },
          label: () => item?.renderLabel?.(item.label),
        })
      })
    }

    return () => {
      return withDirectives(
        h(ElDescriptions, {
          ...rest,
          ...props,
        }, {
          default: () => {
            if (slots.default) {
              return slots.default()
            }
            if (!descriptionsColumns.value.length) {
              return ''
            }
            return renderColumns()
          },
          title: () => slots.title?.(),
          extra: () => slots.extra?.(),
        }),
        [
          [vLoading, loading?.value ?? false],
        ],
      )
    }
  })

  return [
    DescriptionsComp,
  ]
}
