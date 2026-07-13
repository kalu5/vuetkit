import { ElNotification } from 'element-plus'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useNotification } from './index'

vi.mock('element-plus', () => {
  const ElNotificationImpl = vi.fn((...args: any[]) => ({ args })) as ReturnType<typeof vi.fn> & {
    closeAll: ReturnType<typeof vi.fn>
  }
  ElNotificationImpl.closeAll = vi.fn()
  return { ElNotification: ElNotificationImpl }
})

const ElNotificationMock = ElNotification as unknown as ReturnType<typeof vi.fn> & {
  closeAll: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  ElNotificationMock.mockClear()
  ElNotificationMock.closeAll.mockClear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('returns an object with primary/success/error/warning/info/closeAll methods', () => {
  const notify = useNotification()
  expect(typeof notify.primary).toBe('function')
  expect(typeof notify.success).toBe('function')
  expect(typeof notify.error).toBe('function')
  expect(typeof notify.warning).toBe('function')
  expect(typeof notify.info).toBe('function')
  expect(typeof notify.closeAll).toBe('function')
})

it('uses default options when no options are provided', () => {
  const notify = useNotification()
  notify.success('hello')
  expect(ElNotificationMock).toHaveBeenCalledTimes(1)
  const opts = ElNotificationMock.mock.calls[0][0]
  expect(opts.duration).toBe(4500)
  expect(opts.showClose).toBe(true)
  expect(opts.position).toBe('top-right')
  expect(opts.message).toBe('hello')
  expect(opts.type).toBe('success')
})

it('primary delegates to ElNotification with type "primary"', () => {
  const notify = useNotification()
  notify.primary('primary msg')
  expect(ElNotificationMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'primary msg', type: 'primary' }),
  )
})

it('success delegates to ElNotification with type "success"', () => {
  const notify = useNotification()
  notify.success('ok')
  expect(ElNotificationMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'ok', type: 'success' }),
  )
})

it('error delegates to ElNotification with type "error"', () => {
  const notify = useNotification()
  notify.error('bad')
  expect(ElNotificationMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'bad', type: 'error' }),
  )
})

it('warning delegates to ElNotification with type "warning"', () => {
  const notify = useNotification()
  notify.warning('careful')
  expect(ElNotificationMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'careful', type: 'warning' }),
  )
})

it('info delegates to ElNotification with type "info"', () => {
  const notify = useNotification()
  notify.info('note')
  expect(ElNotificationMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'note', type: 'info' }),
  )
})

it('closeAll calls ElNotification.closeAll', () => {
  const notify = useNotification()
  notify.closeAll()
  expect(ElNotificationMock.closeAll).toHaveBeenCalledTimes(1)
})

it('respects custom duration option', () => {
  const notify = useNotification({ duration: 5000 })
  notify.success('custom')
  expect(ElNotificationMock.mock.calls[0][0].duration).toBe(5000)
})

it('respects custom showClose option', () => {
  const notify = useNotification({ showClose: false })
  notify.success('x')
  expect(ElNotificationMock.mock.calls[0][0].showClose).toBe(false)
})

it('respects custom position option', () => {
  const notify = useNotification({ position: 'bottom-right' })
  notify.success('x')
  expect(ElNotificationMock.mock.calls[0][0].position).toBe('bottom-right')
})

it('passes arbitrary options through to ElNotification', () => {
  const notify = useNotification({ dangerouslyUseHTMLString: true, offset: 50 })
  notify.error('html')
  const opts = ElNotificationMock.mock.calls[0][0]
  expect(opts.dangerouslyUseHTMLString).toBe(true)
  expect(opts.offset).toBe(50)
  expect(opts.message).toBe('html')
  expect(opts.type).toBe('error')
})

it('respects duration=0 (meaning never auto-close)', () => {
  const notify = useNotification({ duration: 0 })
  notify.success('zero')
  const opts = ElNotificationMock.mock.calls[0][0]
  expect(opts.duration).toBe(0)
})

it('respects showClose=false', () => {
  const notify = useNotification({ showClose: false })
  notify.success('no-close')
  const opts = ElNotificationMock.mock.calls[0][0]
  expect(opts.showClose).toBe(false)
})

it('passes per-call title to ElNotification', () => {
  const notify = useNotification()
  notify.success('msg', 'Title')
  expect(ElNotificationMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'msg', title: 'Title', type: 'success' }),
  )
})

it('uses default title from options when no per-call title is provided', () => {
  const notify = useNotification({ title: 'Default Title' })
  notify.success('msg')
  expect(ElNotificationMock.mock.calls[0][0].title).toBe('Default Title')
})

it('per-call title overrides default title from options', () => {
  const notify = useNotification({ title: 'Default Title' })
  notify.success('msg', 'Override Title')
  expect(ElNotificationMock.mock.calls[0][0].title).toBe('Override Title')
})

it('passes onClick/onClose callbacks through to ElNotification', () => {
  const onClick = vi.fn()
  const onClose = vi.fn()
  const notify = useNotification({ onClick, onClose })
  notify.success('msg')
  const opts = ElNotificationMock.mock.calls[0][0]
  expect(opts.onClick).toBe(onClick)
  expect(opts.onClose).toBe(onClose)
})

it('primary/success/error/warning/info return the ElNotification instance', () => {
  const notify = useNotification()
  const r1 = notify.primary('a')
  const r2 = notify.success('b')
  const r3 = notify.error('c')
  const r4 = notify.warning('d')
  const r5 = notify.info('e')
  expect(r1).toBeDefined()
  expect(r2).toBeDefined()
  expect(r3).toBeDefined()
  expect(r4).toBeDefined()
  expect(r5).toBeDefined()
})

it('multiple calls reuse the merged options for all notification types', () => {
  const notify = useNotification({ duration: 1000 })
  notify.primary('a')
  notify.success('b')
  notify.warning('c')
  notify.info('d')
  notify.error('e')
  expect(ElNotificationMock).toHaveBeenCalledTimes(5)
  for (const call of ElNotificationMock.mock.calls) {
    expect(call[0].duration).toBe(1000)
  }
})
