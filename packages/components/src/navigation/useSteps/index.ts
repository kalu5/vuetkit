import type { RequestService } from '@vuetkit/core'
import type { StepProps, StepsProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElStep, ElSteps, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

export interface StepsColumn extends Partial<StepProps> {
  // @desc Title of the step
  title?: string
  // @desc Description of the step
  description?: string
  // @desc Render function of the step description
  render?: (val: unknown) => VNode
  // @desc Render function of the step title
  renderTitle?: (val: unknown) => VNode
  // @desc Render function of the step icon
  renderIcon?: (val: unknown) => VNode
}

export interface StepsOptions<T> extends StepsProps {
  // @desc Steps of the component
  steps: StepsColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format steps data
  formatData?: (data: T) => StepsColumn[]
  // @desc Default active step index
  defaultActive?: number
}

export type StepsReturnType = [
  // @desc Steps component
  Component,
  // @desc Active step ref, can be used to control step externally
  Ref<number>,
]

export function useSteps<T>(options: StepsOptions<T>) {
  const { steps = [], service, params, formatData, defaultActive = 0, ...rest } = options

  const { data, loading } = service
    ? useRequest<StepsColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const active = ref(defaultActive)
  const stepsColumns = computed(() => data?.value || steps)

  const StepsComp = defineComponent({
    props: {
      modelValue: {
        type: Number,
        default: undefined,
      },
    },
    setup(props, { slots }) {
      const renderSteps = () => {
        return stepsColumns.value?.map((item) => {
          return h(ElStep, {
            ...item,
          }, {
            description: () => {
              if (item?.render) {
                return item.render(item?.description)
              }
              return item?.description || ''
            },
            title: item?.renderTitle ? () => item.renderTitle!(item.title) : undefined,
            icon: item?.renderIcon ? () => item.renderIcon!(item.icon) : undefined,
          })
        })
      }

      return () => {
        const finalActive = props.modelValue ?? rest.active ?? active.value
        return withDirectives(
          h(ElSteps, {
            ...rest,
            ...props,
            'active': finalActive,
            'onUpdate:active': (val: number) => { active.value = val },
          }, {
            default: () => {
              if (slots.default) {
                return slots.default()
              }
              if (!stepsColumns.value.length) {
                return ''
              }
              return renderSteps()
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
    StepsComp,
    active,
  ]
}
