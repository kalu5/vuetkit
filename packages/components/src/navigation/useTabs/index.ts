import type { RequestService } from '@vuecraft/core'
import type { TabPaneName, TabsPaneContext, TabsProps } from 'element-plus'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuecraft/core'

import { ElTabPane, ElTabs, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

export interface TabsColumn {
  // @desc Label of the tab
  label?: string
  // @desc Name of the tab
  name?: string | number
  // @desc Whether the tab is disabled
  disabled?: boolean
  // @desc Whether the tab is closable
  closable?: boolean
  // @desc Whether the tab is lazy loaded
  lazy?: boolean
  // @desc Render function of the tab content
  render?: (val: unknown) => VNode
  // @desc Render function of the tab label
  renderLabel?: (val: unknown) => VNode
}

export interface TabsOptions<T> extends Partial<TabsProps> {
  // @desc Tabs of the component
  tabs: TabsColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format tabs data
  formatData?: (data: T) => TabsColumn[]
  // @desc Default active tab name
  defaultActive?: string | number
  // @desc Callback when tab is clicked
  onTabClick?: (tab: TabsPaneContext, event: Event) => void
  // @desc Callback when tab is changed
  onTabChange?: (name: TabPaneName) => void
  // @desc Callback when tab is removed
  onTabRemove?: (name: TabPaneName) => void
  // @desc Callback when tab is added
  onTabAdd?: () => void
  // @desc Callback when tab is edited (add or remove)
  onEdit?: (targetName: TabPaneName | undefined, action: 'remove' | 'add') => void
}

export type TabsReturnType = [
  // @desc Tabs component
  Component,
  // @desc Active tab ref, can be used to control tab externally
  Ref<string | number>,
]

export function useTabs<T>(options: TabsOptions<T>) {
  const { tabs = [], service, params, formatData, defaultActive = 0, onTabClick, onTabChange, onTabRemove, onTabAdd, onEdit, ...rest } = options

  const { data, loading } = service
    ? useRequest<TabsColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const activeName = ref<string | number>(defaultActive)
  const tabsColumns = computed(() => data?.value || tabs)

  const TabsComp = defineComponent({
    props: {
      modelValue: {
        type: [String, Number],
        default: undefined,
      },
    },
    setup(props, { slots, emit }) {
      const renderTabs = () => {
        return tabsColumns.value?.map((item, index) => {
          const tabName = item.name ?? index
          return h(ElTabPane, {
            ...item,
            name: tabName,
          }, {
            label: item?.renderLabel ? () => item.renderLabel!(item.label) : undefined,
            default: () => {
              if (item?.render) {
                return item.render(item)
              }
              return ''
            },
          })
        })
      }

      const handleTabClick = (tab: TabsPaneContext, event: Event) => {
        onTabClick?.(tab, event)
        emit('tab-click', tab, event)
      }

      const handleTabChange = (name: TabPaneName) => {
        onTabChange?.(name)
        emit('tab-change', name)
      }

      const handleTabRemove = (name: TabPaneName) => {
        onTabRemove?.(name)
        emit('tab-remove', name)
      }

      const handleTabAdd = () => {
        onTabAdd?.()
        emit('tab-add')
      }

      const handleEdit = (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
        onEdit?.(targetName, action)
        emit('edit', targetName, action)
      }

      return () => {
        const finalActiveName = props.modelValue ?? rest.modelValue ?? activeName.value
        return withDirectives(
          h(ElTabs, {
            ...rest,
            ...props,
            'modelValue': finalActiveName,
            'onUpdate:modelValue': (val: string | number) => { activeName.value = val },
            'onTabClick': handleTabClick,
            'onTabChange': handleTabChange,
            'onTabRemove': handleTabRemove,
            'onTabAdd': handleTabAdd,
            'onEdit': handleEdit,
          }, {
            default: () => {
              if (slots.default) {
                return slots.default()
              }
              if (!tabsColumns.value.length) {
                return ''
              }
              return renderTabs()
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
    TabsComp,
    activeName,
  ]
}
