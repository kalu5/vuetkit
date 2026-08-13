import type { RequestService } from '@vuecraft/core'
import type { MessageType } from 'element-plus'
import { useRequest } from '@vuecraft/core'
import { ElMessageBox } from 'element-plus'
import { useMessage } from '../useMessage'

export interface AsyncConfirmOptions {
  title?: string
  message?: string
  type?: MessageType
  confirmButtonText?: string
  cancelButtonText?: string
  // Success message to show after async confirm success.
  successMessage?: string
  // Error message to show when async confirm fails.
  errorMessage?: string
  confirmSuccess?: () => void
  confirmError?: (error: unknown) => void

}

export function useAsyncConfirm<T>(
  confirmService: RequestService<T>,
  options: AsyncConfirmOptions,
) {
  const {
    title = 'Confirm',
    message = 'Sure Confirm?',
    type = 'error',
    confirmButtonText = 'Sure',
    cancelButtonText = 'Cancel',
    confirmSuccess,
    confirmError,
    successMessage,
    errorMessage,
  } = options || {}

  const { loading, execute: executeConfirm, error } = useRequest(confirmService, {
    manual: true,
  })

  const { success, error: showError } = useMessage()

  function confirm(params?: unknown) {
    ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type: type as MessageType,
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          await executeConfirm(params)
          instance.confirmButtonLoading = false
          if (error.value) {
            if (errorMessage) {
              showError(errorMessage)
            }
            confirmError?.(error.value)
          }
          else {
            if (successMessage) {
              success(successMessage)
            }
            confirmSuccess?.()
          }
          done()
        }
        else {
          done()
        }
      },
    }).catch(() => {})
  }

  return {
    loading,
    confirm,
  }
}
