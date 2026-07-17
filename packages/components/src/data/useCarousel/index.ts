import type { RequestService } from '@vuetkit/core'
import type { CarouselItemProps, CarouselProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElCarousel, ElCarouselItem, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, watch, withDirectives } from 'vue'

export interface CarouselColumn extends Partial<CarouselItemProps> {
  // @desc Content of the carousel item
  content?: string
  // @desc Render function of the carousel item content
  render?: (val: unknown) => VNode
}

export interface CarouselOptions<T> extends Partial<CarouselProps> {
  // @desc Columns of the carousel
  columns: CarouselColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format carousel data
  formatData?: (data: T) => CarouselColumn[]
  // @desc Initial active slide index
  initialIndex?: number
}

export type CarouselReturnType = [
  // @desc Carousel component
  Component,
  // @desc Active index ref, can be used to control active slide externally
  Ref<number>,
]

export function useCarousel<T>(options: CarouselOptions<T>) {
  const { columns = [], service, params, formatData, initialIndex = 0, ...rest } = options

  const { data, loading } = service
    ? useRequest<CarouselColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const active = ref(initialIndex)
  const carouselColumns = computed(() => data?.value || columns)

  const CarouselComp = defineComponent({
    emits: ['change'],
    setup(_props, { slots, emit, expose }) {
      const carouselRef = ref<{
        setActiveItem: (index: number | string) => void
        prev: () => void
        next: () => void
      } | null>(null)
      // Guard to prevent setActiveItem feedback loop when active is updated
      // by the internal change event.
      let internalUpdate = false

      watch(active, (val) => {
        if (!internalUpdate && carouselRef.value) {
          carouselRef.value.setActiveItem(val)
        }
      }, { flush: 'sync' })

      expose({
        setActiveItem: (index: number | string) => carouselRef.value?.setActiveItem(index),
        prev: () => carouselRef.value?.prev(),
        next: () => carouselRef.value?.next(),
      })

      const renderColumns = () => {
        return carouselColumns.value?.map((item) => {
          return h(ElCarouselItem, {
            ...item,
          }, {
            default: () => {
              // Custom render item content
              if (item?.render) {
                return item.render(item?.content)
              }
              return item?.content || ''
            },
          })
        })
      }

      return () => {
        return withDirectives(
          h(ElCarousel, {
            ...rest,
            'ref': (el: unknown) => {
              carouselRef.value = el as {
                setActiveItem: (index: number | string) => void
                prev: () => void
                next: () => void
              } | null
            },
            'initial-index': active.value,
            'onChange': (newIndex: number, oldIndex: number) => {
              internalUpdate = true
              active.value = newIndex
              internalUpdate = false
              emit('change', newIndex, oldIndex)
            },
          }, {
            default: () => {
              if (slots.default) {
                return slots.default()
              }
              if (!carouselColumns.value.length) {
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
    CarouselComp,
    active,
  ]
}
