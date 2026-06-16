import { ElMessage } from 'element-plus'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useMessage } from './index'

vi.mock('element-plus', () => {
  const ElMessageImpl = vi.fn((...args: any[]) => ({ args })) as ReturnType<typeof vi.fn> & {
    closeAll: ReturnType<typeof vi.fn>
  }
  ElMessageImpl.closeAll = vi.fn()
  return { ElMessage: ElMessageImpl }
})

const ElMessageMock = ElMessage as unknown as ReturnType<typeof vi.fn> & {
  closeAll: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  ElMessageMock.mockClear()
  ElMessageMock.closeAll.mockClear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('returns an object with success/error/warning/info/closeAll methods', () => {
  const msg = useMessage()
  expect(typeof msg.success).toBe('function')
  expect(typeof msg.error).toBe('function')
  expect(typeof msg.warning).toBe('function')
  expect(typeof msg.info).toBe('function')
  expect(typeof msg.closeAll).toBe('function')
})

it('uses default options when no options are provided', () => {
  const msg = useMessage()
  msg.success('hello')
  expect(ElMessageMock).toHaveBeenCalledTimes(1)
  const opts = ElMessageMock.mock.calls[0][0]
  expect(opts.duration).toBe(3000)
  expect(opts.showClose).toBe(true)
  expect(opts.plain).toBe(true)
  expect(opts.grouping).toBe(true)
  expect(opts.message).toBe('hello')
  expect(opts.type).toBe('success')
})

it('success delegates to ElMessage with type "success"', () => {
  const msg = useMessage()
  msg.success('ok')
  expect(ElMessageMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'ok', type: 'success' }),
  )
})

it('error delegates to ElMessage with type "error"', () => {
  const msg = useMessage()
  msg.error('bad')
  expect(ElMessageMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'bad', type: 'error' }),
  )
})

it('warning delegates to ElMessage with type "warning"', () => {
  const msg = useMessage()
  msg.warning('careful')
  expect(ElMessageMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'careful', type: 'warning' }),
  )
})

it('info delegates to ElMessage with type "info"', () => {
  const msg = useMessage()
  msg.info('note')
  expect(ElMessageMock).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'note', type: 'info' }),
  )
})

it('closeAll calls ElMessage.closeAll', () => {
  const msg = useMessage()
  msg.closeAll()
  expect(ElMessageMock.closeAll).toHaveBeenCalledTimes(1)
})

it('respects custom duration option', () => {
  const msg = useMessage({ duration: 5000 })
  msg.success('custom')
  expect(ElMessageMock.mock.calls[0][0].duration).toBe(5000)
})

it('respects custom showClose option', () => {
  const msg = useMessage({ showClose: true })
  msg.success('x')
  expect(ElMessageMock.mock.calls[0][0].showClose).toBe(true)
})

it('respects custom plain option', () => {
  const msg = useMessage({ plain: true })
  msg.info('x')
  expect(ElMessageMock.mock.calls[0][0].plain).toBe(true)
})

it('respects custom grouping option', () => {
  const msg = useMessage({ grouping: true })
  msg.warning('x')
  expect(ElMessageMock.mock.calls[0][0].grouping).toBe(true)
})

it('passes arbitrary options through to ElMessage', () => {
  const msg = useMessage({ dangerouslyUseHTMLString: true, offset: 50 })
  msg.error('html')
  const opts = ElMessageMock.mock.calls[0][0]
  expect(opts.dangerouslyUseHTMLString).toBe(true)
  expect(opts.offset).toBe(50)
  expect(opts.message).toBe('html')
  expect(opts.type).toBe('error')
})

it('respects duration=0 (meaning never auto-close)', () => {
  const msg = useMessage({ duration: 0 })
  msg.success('zero')
  const opts = ElMessageMock.mock.calls[0][0]
  expect(opts.duration).toBe(0)
})

it('respects showClose=false', () => {
  const msg = useMessage({ showClose: false })
  msg.success('no-close')
  const opts = ElMessageMock.mock.calls[0][0]
  expect(opts.showClose).toBe(false)
})

it('respects plain=false', () => {
  const msg = useMessage({ plain: false })
  msg.success('not-plain')
  const opts = ElMessageMock.mock.calls[0][0]
  expect(opts.plain).toBe(false)
})

it('respects grouping=false', () => {
  const msg = useMessage({ grouping: false })
  msg.success('no-group')
  const opts = ElMessageMock.mock.calls[0][0]
  expect(opts.grouping).toBe(false)
})

it('success/error/warning/info return the ElMessage instance', () => {
  const msg = useMessage()
  const r1 = msg.success('a')
  const r2 = msg.error('b')
  const r3 = msg.warning('c')
  const r4 = msg.info('d')
  expect(r1).toBeDefined()
  expect(r2).toBeDefined()
  expect(r3).toBeDefined()
  expect(r4).toBeDefined()
})

it('multiple calls reuse the merged options for all message types', () => {
  const msg = useMessage({ duration: 1000 })
  msg.success('a')
  msg.error('b')
  msg.warning('c')
  msg.info('d')
  expect(ElMessageMock).toHaveBeenCalledTimes(4)
  for (const call of ElMessageMock.mock.calls) {
    expect(call[0].duration).toBe(1000)
  }
})
