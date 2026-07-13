import type { RequestService } from '@vuetkit/core'
import type { Component, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElBreadcrumb, ElBreadcrumbItem, vLoading } from 'element-plus'
import { computed, defineComponent, h, withDirectives } from 'vue'

// BreadcrumbProps is not exported as a type from element-plus, extract from the component
type ElBreadcrumbProps = InstanceType<typeof ElBreadcrumb>['$props']

export interface BreadcrumbColumn {
  // @desc Label of the breadcrumb item
  label?: string
  // @desc Target route of the link, same as `to` of vue-router
  to?: unknown
  // @desc If `true`, the navigation will not leave a history record
  replace?: boolean
  // @desc Render function of the item content
  render?: (val: unknown) => VNode
}

export interface BreadcrumbOptions<T> extends Partial<ElBreadcrumbProps> {
  // @desc Items of the breadcrumb
  items?: BreadcrumbColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format items data
  formatData?: (data: T) => BreadcrumbColumn[]
}

export type BreadcrumbReturnType = [
  // @desc Breadcrumb component
  Component,
]

export function useBreadcrumb<T>(options: BreadcrumbOptions<T>): BreadcrumbReturnType {
  const { items = [], service, params, formatData, ...rest } = options

  const { data, loading } = service
    ? useRequest<BreadcrumbColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const breadcrumbColumns = computed(() => data?.value || items)

  const renderBreadcrumbItem = (item: BreadcrumbColumn) => {
    return h(ElBreadcrumbItem, {
      to: item.to,
      replace: item.replace,
    }, {
      default: () => {
        if (item?.render) {
          return item.render(item)
        }
        return item.label || ''
      },
    })
  }

  const BreadcrumbComp = defineComponent({
    setup(_, { slots }) {
      return () => {
        return withDirectives(
          h(ElBreadcrumb, {
            ...rest,
          }, {
            default: () => {
              if (slots.default) {
                return slots.default()
              }
              if (!breadcrumbColumns.value.length) {
                return ''
              }
              return breadcrumbColumns.value.map(item => renderBreadcrumbItem(item))
            },
          }),
          [
            [vLoading, loading?.value ?? false],
          ],
        )
      }
    },
  })

  return [
    BreadcrumbComp,
  ]
}
