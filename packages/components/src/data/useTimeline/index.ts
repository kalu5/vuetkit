import type { RequestService } from '@vuecraft/core'
import type { TimelineItemProps, TimelineProps } from 'element-plus'
import type { Component, VNode } from 'vue'
import { useRequest } from '@vuecraft/core'

import { ElTimeline, ElTimelineItem, vLoading } from 'element-plus'
import { computed, defineComponent, h, withDirectives } from 'vue'

export interface TimelineColumn extends Partial<TimelineItemProps> {
  // @desc Content of the timeline item
  content?: string
  // @desc Render function of the timeline item content
  render?: (val: unknown) => VNode
  // @desc Render function of the timeline item dot
  renderDot?: (val: unknown) => VNode
}

export interface TimelineOptions<T> extends Partial<TimelineProps> {
  // @desc Columns of the timeline
  columns: TimelineColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format timeline data
  formatData?: (data: T) => TimelineColumn[]
}

export type TimelineReturnType = [
  Component,
]

export function useTimeline<T>(options: TimelineOptions<T>) {
  const { columns = [], service, params, formatData, ...rest } = options

  const { data, loading } = service
    ? useRequest<TimelineColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const timelineColumns = computed(() => data?.value || columns)

  const TimelineComp = defineComponent((props, { slots }) => {
    const renderColumns = () => {
      return timelineColumns.value?.map((item) => {
        return h(ElTimelineItem, {
          ...item,
        }, {
          default: () => {
            // Custom render item content
            if (item?.render) {
              return item.render(item?.content)
            }
            return item?.content || ''
          },
          dot: item?.renderDot ? () => item.renderDot!(item) : undefined,
        })
      })
    }

    return () => {
      return withDirectives(
        h(ElTimeline, {
          ...rest,
          ...props,
        }, {
          default: () => {
            if (slots.default) {
              return slots.default()
            }
            if (!timelineColumns.value.length) {
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
  })

  return [
    TimelineComp,
  ]
}
