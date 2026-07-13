import type { NotificationOptions, NotificationType } from 'element-plus'
import { ElNotification } from 'element-plus'

const DEFAULT_DURATION = 4500
const DEFAULT_SHOW_CLOSE = true
const DEFAULT_POSITION = 'top-right' as const

export function useNotification(options: NotificationOptions = {}) {
  const mergedOptions = {
    ...options,
    duration: options.duration ?? DEFAULT_DURATION,
    showClose: options.showClose ?? DEFAULT_SHOW_CLOSE,
    position: options.position ?? DEFAULT_POSITION,
  }

  function createNotification(message: string, type: NotificationType, title?: string) {
    return ElNotification({
      ...mergedOptions,
      message,
      type,
      title: title ?? mergedOptions.title,
    })
  }

  function closeAll() {
    ElNotification.closeAll()
  }

  function primary(message: string, title?: string) {
    return createNotification(message, 'primary', title)
  }

  function success(message: string, title?: string) {
    return createNotification(message, 'success', title)
  }

  function error(message: string, title?: string) {
    return createNotification(message, 'error', title)
  }

  function warning(message: string, title?: string) {
    return createNotification(message, 'warning', title)
  }

  function info(message: string, title?: string) {
    return createNotification(message, 'info', title)
  }

  return {
    primary,
    success,
    error,
    warning,
    info,
    closeAll,
  }
}
