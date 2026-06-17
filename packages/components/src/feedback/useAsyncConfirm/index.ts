import type { RequestService } from '@vuetkit/core'
import type { MessageType } from 'element-plus'
import { useRequest } from '@vuetkit/core'
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

export function useAsyncConfirm(
  confirmService: RequestService,
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

  const { loading, execute: executeConfirm } = useRequest(confirmService, {
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
          try {
            instance.confirmButtonLoading = true
            await executeConfirm(params)
            done()
            if (successMessage) {
              success(successMessage)
            }
            confirmSuccess?.()
          }
          catch (err) {
            if (errorMessage) {
              showError(errorMessage)
            }
            confirmError?.(err)
            done()
          }
          finally {
            instance.confirmButtonLoading = false
          }
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
