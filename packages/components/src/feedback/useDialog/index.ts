import type { DialogProps } from 'element-plus'

import type { Component } from 'vue'
import { ElDialog, ElScrollbar } from 'element-plus'
import { defineComponent, h, ref } from 'vue'

interface DialogOptions extends DialogProps {
  // Dialog Title
  title?: string
}

type DialogReturn = [
  // Use DialogComp in template
  Component,
  // Dialog Methods
  {
    open: () => void
    close: () => void
  },
]

export function useDialog(options: DialogOptions): DialogReturn {
  const { title = 'Dialog Title' } = options

  const showDialog = ref(false)

  const DialogComp = defineComponent((props, { slots }) => {
    return () => {
      return h(ElDialog, {
        title,
        'modelValue': showDialog.value,
        'update:modelValue': (val: boolean) => showDialog.value = val,
        ...props,
        'before-close': () => {
          showDialog.value = false
        },
      }, {
        default: () => {
          return h(ElScrollbar, {
            maxHeight: '60vh',
          }, () => {
            return h('div', {
              style: {
                marginRight: '15px',
              },
            }, slots.default?.())
          })
        },
        footer: () => slots.footer?.(),
        header: () => slots.header?.(),
      })
    }
  })

  const open = () => {
    showDialog.value = true
  }
  const close = () => {
    showDialog.value = false
  }
  return [DialogComp, { open, close }]
}
