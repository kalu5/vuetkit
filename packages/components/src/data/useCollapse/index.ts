import type { RequestService } from '@vuetkit/core'
import type { CollapseItemProps, CollapseModelValue, CollapseProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElCollapse, ElCollapseItem, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

export interface CollapseColumn extends Partial<CollapseItemProps> {
  // @desc Title of the collapse item
  title?: string
  // @desc Unique name of the collapse item
  name?: string | number
  // @desc Render function of the collapse item content
  render?: (val: unknown) => VNode
  // @desc Render function of the collapse item title
  renderTitle?: (val: unknown) => VNode
  // @desc Render function of the collapse item icon
  renderIcon?: (val: unknown) => VNode
}

export interface CollapseOptions<T> extends Partial<CollapseProps> {
  // @desc Columns of the collapse
  columns: CollapseColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format collapse data
  formatData?: (data: T) => CollapseColumn[]
  // @desc Default active collapse item name(s)
  defaultActive?: CollapseModelValue
  // @desc Callback when active collapse changes
  onChange?: (activeNames: CollapseModelValue) => void
}

export type CollapseReturnType = [
  // @desc Collapse component
  Component,
  // @desc Active collapse ref, can be used to control active items externally
  Ref<CollapseModelValue>,
]

export function useCollapse<T>(options: CollapseOptions<T>): CollapseReturnType {
  const { columns = [], service, params, formatData, defaultActive = [], onChange, ...rest } = options

  const { data, loading } = service
    ? useRequest<CollapseColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const activeNames = ref<CollapseModelValue>(defaultActive)
  const collapseColumns = computed(() => data?.value || columns)

  const CollapseComp = defineComponent({
    props: {
      modelValue: {
        type: [String, Number, Array],
        default: undefined,
      },
    },
    setup(props, { slots, emit }) {
      const renderColumns = () => {
        return collapseColumns.value?.map((item, index) => {
          const itemName = item.name ?? index
          return h(ElCollapseItem, {
            ...item,
            name: itemName,
          }, {
            default: () => {
              if (item?.render) {
                return item.render(item)
              }
              return ''
            },
            title: item?.renderTitle ? () => item.renderTitle!(item.title) : undefined,
            icon: item?.renderIcon ? () => item.renderIcon!(item.icon) : undefined,
          })
        })
      }

      const handleChange = (val: CollapseModelValue) => {
        activeNames.value = val
        onChange?.(val)
        emit('change', val)
      }

      return () => {
        const finalActiveNames = props.modelValue ?? rest.modelValue ?? activeNames.value
        return withDirectives(
          h(ElCollapse, {
            ...rest,
            ...props,
            'modelValue': finalActiveNames as CollapseModelValue,
            'onUpdate:modelValue': handleChange,
            'onChange': handleChange,
          }, {
            default: () => {
              if (slots.default) {
                return slots.default()
              }
              if (!collapseColumns.value.length) {
                return ''
              }
              return renderColumns()
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
    CollapseComp,
    activeNames,
  ]
}
