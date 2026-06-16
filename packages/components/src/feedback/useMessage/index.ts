import type { MessageProps, MessageType } from 'element-plus'
import { ElMessage } from 'element-plus'

const DEFAULT_DURATION = 3000
const DEFAULT_SHOW_CLOSE = true
const DEFAULT_PLAIN = true
const DEFAULT_GROUPING = true

export function useMessage(options: MessageProps = {}) {
  const mergedOptions = {
    ...options,
    duration: options.duration ?? DEFAULT_DURATION,
    showClose: options.showClose ?? DEFAULT_SHOW_CLOSE,
    plain: options.plain ?? DEFAULT_PLAIN,
    grouping: options.grouping ?? DEFAULT_GROUPING,
  }

  function createMessage(message: string, type: MessageType) {
    return ElMessage({
      ...mergedOptions,
      message,
      type,
    })
  }

  function closeAll() {
    ElMessage.closeAll()
  }

  function success(message: string) {
    return createMessage(message, 'success')
  }

  function error(message: string) {
    return createMessage(message, 'error')
  }

  function warning(message: string) {
    return createMessage(message, 'warning')
  }

  function info(message: string) {
    return createMessage(message, 'info')
  }

  return {
    success,
    error,
    warning,
    info,
    closeAll,
  }
}
