import type { RequestService } from '@vuetkit/core'
import type { Component, CSSProperties, Ref, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElMenu, ElMenuItem, ElMenuItemGroup, ElSubMenu, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

// MenuProps is not exported as a type from element-plus, extract from the component
type ElMenuProps = InstanceType<typeof ElMenu>['$props']

export interface MenuColumn {
  // @desc Index of the menu item, unique identification
  index: string
  // @desc Label of the menu item
  label?: string
  // @desc Whether the item is disabled
  disabled?: boolean
  // @desc Vue Router object
  route?: unknown
  // @desc Children of the sub-menu
  children?: MenuColumn[]
  // @desc Render function of the item content
  render?: (val: unknown) => VNode
  // @desc Render function of the title (for sub-menu)
  renderTitle?: (val: unknown) => VNode
  // @desc Group title - if set with children, renders as MenuItemGroup
  groupTitle?: string
  // @desc Sub-menu popper class
  popperClass?: string
  // @desc Sub-menu popper style
  popperStyle?: string | CSSProperties
  // @desc Sub-menu show timeout
  showTimeout?: number
  // @desc Sub-menu hide timeout
  hideTimeout?: number
  // @desc Whether the sub-menu is teleported
  teleported?: boolean
  // @desc Sub-menu popper offset
  popperOffset?: number
  // @desc Icon when menu expanded and submenu closed
  expandCloseIcon?: string | Component
  // @desc Icon when menu expanded and submenu opened
  expandOpenIcon?: string | Component
  // @desc Icon when menu collapsed and submenu closed
  collapseCloseIcon?: string | Component
  // @desc Icon when menu collapsed and submenu opened
  collapseOpenIcon?: string | Component
}

export interface MenuOptions<T> extends Partial<ElMenuProps> {
  // @desc Items of the menu
  items?: MenuColumn[]
  // @desc Service
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format items data
  formatData?: (data: T) => MenuColumn[]
  // @desc Default active index
  defaultActive?: string
  // @desc Callback when a menu item is selected
  onSelect?: (index: string, indexPath: string[], item: unknown, routerResult?: Promise<unknown>) => void
  // @desc Callback when a sub-menu opens
  onOpen?: (index: string, indexPath: string[]) => void
  // @desc Callback when a sub-menu closes
  onClose?: (index: string, indexPath: string[]) => void
}

export type MenuReturnType = [
  // @desc Menu component
  Component,
  // @desc Active index ref, tracks the selected menu item
  Ref<string>,
]

export function useMenu<T>(options: MenuOptions<T>): MenuReturnType {
  const { items = [], service, params, formatData, defaultActive = '', onSelect, onOpen, onClose, ...rest } = options

  const { data, loading } = service
    ? useRequest<MenuColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const activeIndex = ref<string>(defaultActive)
  const menuColumns = computed(() => data?.value || items)

  const renderMenuItem = (item: MenuColumn) => {
    // If has children and groupTitle, render as MenuItemGroup
    if (item.children?.length && item.groupTitle) {
      return h(ElMenuItemGroup, {
        title: item.groupTitle,
      }, {
        default: () => item.children!.map(child => renderMenuItem(child)),
      })
    }

    // If has children, render as SubMenu
    if (item.children?.length) {
      return h(ElSubMenu, {
        index: item.index,
        disabled: item.disabled,
        popperClass: item.popperClass,
        popperStyle: item.popperStyle,
        showTimeout: item.showTimeout,
        hideTimeout: item.hideTimeout,
        teleported: item.teleported,
        popperOffset: item.popperOffset,
        expandCloseIcon: item.expandCloseIcon,
        expandOpenIcon: item.expandOpenIcon,
        collapseCloseIcon: item.collapseCloseIcon,
        collapseOpenIcon: item.collapseOpenIcon,
      }, {
        title: () => {
          if (item?.renderTitle) {
            return item.renderTitle(item)
          }
          return item.label || ''
        },
        default: () => item.children!.map(child => renderMenuItem(child)),
      })
    }

    // Otherwise render as MenuItem
    return h(ElMenuItem, {
      index: item.index,
      disabled: item.disabled,
      route: item.route,
    }, {
      default: () => {
        if (item?.render) {
          return item.render(item)
        }
        return item.label || ''
      },
    })
  }

  const MenuComp = defineComponent({
    setup(_, { slots, emit }) {
      const handleSelect = (index: string, indexPath: string[], item: unknown, routerResult?: Promise<unknown>) => {
        activeIndex.value = index
        onSelect?.(index, indexPath, item, routerResult)
        emit('select', index, indexPath, item, routerResult)
      }

      const handleOpen = (index: string, indexPath: string[]) => {
        onOpen?.(index, indexPath)
        emit('open', index, indexPath)
      }

      const handleClose = (index: string, indexPath: string[]) => {
        onClose?.(index, indexPath)
        emit('close', index, indexPath)
      }

      return () => {
        return withDirectives(
          h(ElMenu, {
            ...rest,
            defaultActive: activeIndex.value,
            onSelect: handleSelect,
            onOpen: handleOpen,
            onClose: handleClose,
          }, {
            default: () => {
              if (slots.default) {
                return slots.default()
              }
              if (!menuColumns.value.length) {
                return ''
              }
              return menuColumns.value.map(item => renderMenuItem(item))
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
    MenuComp,
    activeIndex,
  ]
}
