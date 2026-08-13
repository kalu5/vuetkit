import type { RequestService } from '@vuecraft/core'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuecraft/core'

import { ElDropdown, ElDropdownItem, ElDropdownMenu, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

// DropdownProps is not exported as a type from element-plus, extract from the component
type ElDropdownProps = InstanceType<typeof ElDropdown>['$props']

export interface DropdownItem {
  // @desc Label of the dropdown item
  label?: string
  // @desc Command of the dropdown item, passed to the command event
  command?: string | number | object
  // @desc Whether the item is disabled
  disabled?: boolean
  // @desc Whether to show a divider before the item
  divided?: boolean
  // @desc Icon of the item
  icon?: string | Component
  // @desc Render function of the item content
  render?: (val: unknown) => VNode
}

export interface DropdownOptions<T> extends Partial<ElDropdownProps> {
  // @desc Items of the dropdown
  items?: DropdownItem[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format items data
  formatData?: (data: T) => DropdownItem[]
  // @desc Default command
  defaultCommand?: string | number | object
  // @desc Callback when an item is clicked
  onCommand?: (command: string | number | object) => void
  // @desc Callback when dropdown visibility changes
  onVisibleChange?: (visible: boolean) => void
  // @desc Callback when the triggering element is clicked (split button)
  onClick?: () => void
}

export type DropdownReturnType = [
  // @desc Dropdown component
  Component,
  // @desc Command ref, tracks the last selected item's command
  Ref<string | number | object | undefined>,
]

export function useDropdown<T>(options: DropdownOptions<T>): DropdownReturnType {
  const { items = [], service, params, formatData, defaultCommand, onCommand, onVisibleChange, onClick, ...rest } = options

  const { data, loading } = service
    ? useRequest<DropdownItem[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const command = ref<string | number | object | undefined>(defaultCommand)
  const dropdownColumns = computed(() => data?.value || items)

  const DropdownComp = defineComponent({
    setup(_, { slots, emit }) {
      const renderItems = () => {
        return dropdownColumns.value?.map((item) => {
          return h(ElDropdownItem, {
            command: item.command,
            disabled: item.disabled,
            divided: item.divided,
            icon: item.icon,
          }, {
            default: () => {
              if (item?.render) {
                return item.render(item)
              }
              return item.label || ''
            },
          })
        })
      }

      const handleCommand = (cmd: string | number | object) => {
        command.value = cmd
        onCommand?.(cmd)
        emit('command', cmd)
      }

      const handleVisibleChange = (visible: boolean) => {
        onVisibleChange?.(visible)
        emit('visible-change', visible)
      }

      const handleClick = () => {
        onClick?.()
        emit('click')
      }

      return () => {
        return withDirectives(
          h(ElDropdown, {
            ...rest,
            'onCommand': handleCommand,
            'onVisible-change': handleVisibleChange,
            'onClick': handleClick,
          }, {
            default: () => {
              if (slots.default) {
                return slots.default()
              }
              return ''
            },
            dropdown: () => {
              if (slots.dropdown) {
                return slots.dropdown()
              }
              return h(ElDropdownMenu, {}, {
                default: () => {
                  if (!dropdownColumns.value.length) {
                    return ''
                  }
                  return renderItems()
                },
              })
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
    DropdownComp,
    command,
  ]
}
