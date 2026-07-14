import type { RequestService } from '@vuetkit/core'
import type { SegmentedProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElSegmented, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

export type SegmentedOptionValue = string | number | boolean

export interface SegmentedColumn {
  // @desc Value of the option
  value?: SegmentedOptionValue
  // @desc Label of the option
  label?: string
  // @desc Whether the option is disabled
  disabled?: boolean
  // @desc Render function of the option content
  render?: (item: SegmentedColumn) => VNode
}

export interface SegmentedOptions<T> extends Partial<SegmentedProps> {
  // @desc Columns of the segmented
  columns?: SegmentedColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format segmented data
  formatData?: (data: T) => SegmentedColumn[]
  // @desc Default value of the segmented
  defaultValue?: SegmentedOptionValue
  // @desc Callback when value changes
  onChange?: (val: SegmentedOptionValue) => void
}

export type SegmentedReturnType = [
  // @desc Segmented component
  Component,
  // @desc Value ref, can be used to control value externally
  Ref<SegmentedOptionValue | undefined>,
]

export function useSegmented<T>(options: SegmentedOptions<T>): SegmentedReturnType {
  const { columns = [], service, params, formatData, defaultValue, onChange, ...rest } = options

  const { data, loading } = service
    ? useRequest<SegmentedColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const modelValue = ref<SegmentedOptionValue | undefined>(defaultValue)
  const segmentedColumns = computed(() => data?.value || columns)

  const SegmentedComp = defineComponent({
    props: {
      modelValue: {
        type: [String, Number, Boolean],
        default: undefined,
      },
    },
    setup(props, { slots, emit }) {
      const hasCustomRender = computed(() =>
        segmentedColumns.value.some(
          col =>
            col && typeof col === 'object' && typeof (col as SegmentedColumn).render === 'function',
        ),
      )

      const renderDefault = (scope: { item: unknown }) => {
        const item = scope?.item
        if (item && typeof item === 'object' && typeof (item as SegmentedColumn).render === 'function') {
          return (item as SegmentedColumn).render!(item as SegmentedColumn)
        }
        return slots.default?.(scope as any)
      }

      const handleChange = (val: SegmentedOptionValue) => {
        modelValue.value = val
        onChange?.(val)
        emit('change', val)
        emit('update:modelValue', val)
      }

      return () => {
        const finalModelValue = props.modelValue ?? rest.modelValue ?? modelValue.value
        const slotsObj: Record<string, ((scope: { item: unknown }) => unknown) | undefined> = {}
        if (hasCustomRender.value || slots.default) {
          slotsObj.default = renderDefault
        }
        return withDirectives(
          h(ElSegmented, {
            ...rest,
            ...props,
            'options': segmentedColumns.value,
            'modelValue': finalModelValue,
            'onUpdate:modelValue': handleChange,
            'onChange': handleChange,
          }, slotsObj),
          [
            [vLoading, loading?.value ?? false],
          ],
        )
      }
    },
  })

  return [SegmentedComp, modelValue]
}
