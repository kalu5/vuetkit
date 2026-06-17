import { mount } from '@vue/test-utils'

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useAsyncConfirm } from './index'

vi.mock('element-plus', () => {
  const confirmImpl = vi.fn()
  return { ElMessageBox: { confirm: confirmImpl } }
})

vi.mock('@vuetkit/core', () => {
  const useRequestImpl = vi.fn()
  return { useRequest: useRequestImpl }
})

vi.mock('../useMessage', () => {
  return { useMessage: vi.fn(() => ({ success: vi.fn(), error: vi.fn() })) }
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

interface MessageBoxInstance {
  confirmButtonLoading: boolean
}

interface Harness<T> {
  result: T
  unmount: () => void
}

function runInComponent<T>(setup: () => T): Harness<T> {
  let result: T
  const Comp = defineComponent({
    setup() {
      result = setup()
      return () => null
    },
  })
  const wrapper = mount(Comp)
  return {
    result: result!,
    unmount: () => wrapper.unmount(),
  }
}

describe('useAsyncConfirm', () => {
  it('returns loading ref and confirm function', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    expect(res.loading).toBeDefined()
    expect(typeof res.confirm).toBe('function')
  })

  it('calls ElMessageBox.confirm with default options', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })
    elMessageBoxMock.mockImplementation((_m: string, _t: string, _o: any) => ({ catch: () => {} }))

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()
    expect(elMessageBoxMock).toHaveBeenCalledTimes(1)
    const callArgs = elMessageBoxMock.mock.calls[0]
    expect(callArgs[0]).toBe('Sure Confirm?')
    expect(callArgs[1]).toBe('Confirm')
    expect(callArgs[2].confirmButtonText).toBe('Sure')
    expect(callArgs[2].cancelButtonText).toBe('Cancel')
    expect(callArgs[2].type).toBe('error')
  })

  it('calls ElMessageBox.confirm with custom options', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })
    elMessageBoxMock.mockImplementation((_m: string, _t: string, _o: any) => ({ catch: () => {} }))

    const { result: res } = runInComponent(() =>
      useAsyncConfirm(executeMock, {
        title: 'Delete?',
        message: 'Really delete?',
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }),
    )
    res.confirm()
    const callArgs = elMessageBoxMock.mock.calls[0]
    expect(callArgs[0]).toBe('Really delete?')
    expect(callArgs[1]).toBe('Delete?')
    expect(callArgs[2].confirmButtonText).toBe('Yes')
    expect(callArgs[2].cancelButtonText).toBe('No')
    expect(callArgs[2].type).toBe('warning')
  })

  it('executes confirm service with provided params on confirm action', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm({ id: 42 })

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    let doneCalled = false
    await beforeCloseFn('confirm', instance, () => {
      doneCalled = true
    })

    expect(executeMock).toHaveBeenCalledWith({ id: 42 })
    expect(doneCalled).toBe(true)
  })

  it('executes confirm service with undefined params when no params provided', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(executeMock).toHaveBeenCalledWith(undefined)
  })

  it('sets confirmButtonLoading to true during async request and false after', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    let resolveFn: (v: string) => void = () => {}
    const executeMock = vi.fn().mockImplementation(
      () => new Promise<string>((r) => { resolveFn = r }),
    )
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    let doneCalled = false
    const promise = beforeCloseFn('confirm', instance, () => {
      doneCalled = true
    })
    expect(instance.confirmButtonLoading).toBe(true)

    resolveFn('done')
    await promise

    expect(instance.confirmButtonLoading).toBe(false)
    expect(doneCalled).toBe(true)
  })

  it('shows success message and calls confirmSuccess on successful confirm', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmSuccess = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(executeMock, {
        successMessage: 'Deleted successfully',
        confirmSuccess,
      }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(successMock).toHaveBeenCalledWith('Deleted successfully')
    expect(confirmSuccess).toHaveBeenCalledTimes(1)
    expect(errorMsgMock).not.toHaveBeenCalled()
  })

  it('does not show success message when successMessage is not provided', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(successMock).not.toHaveBeenCalled()
    expect(errorMsgMock).not.toHaveBeenCalled()
  })

  it('shows default error message and calls confirmError when confirm service fails', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const err = new Error('service error')
    const executeMock = vi.fn().mockRejectedValue(err)
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmError = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(executeMock, {
        confirmError,
      }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(errorMsgMock).not.toHaveBeenCalled()
    expect(confirmError).toHaveBeenCalledWith(err)
    expect(successMock).not.toHaveBeenCalled()
  })

  it('shows custom error message when errorMessage is provided and service fails', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const executeMock = vi.fn().mockRejectedValue(new Error('fail'))
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() =>
      useAsyncConfirm(executeMock, {
        errorMessage: 'Delete failed, please try again',
      }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(errorMsgMock).toHaveBeenCalledWith('Delete failed, please try again')
    expect(successMock).not.toHaveBeenCalled()
  })

  it('resets confirmButtonLoading to false even when service fails', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockRejectedValue(new Error('fail'))
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    let doneCalled = false
    await beforeCloseFn('confirm', instance, () => {
      doneCalled = true
    })

    expect(instance.confirmButtonLoading).toBe(false)
    expect(doneCalled).toBe(true)
  })

  it('does not call confirmSuccess when service fails', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockRejectedValue(new Error('fail'))
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmSuccess = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(executeMock, { confirmSuccess }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(confirmSuccess).not.toHaveBeenCalled()
  })

  it('does not call confirmError when service succeeds', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmError = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(executeMock, { confirmError }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(confirmError).not.toHaveBeenCalled()
  })

  it('calls done on cancel action without executing service', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    let doneCalled = false
    await beforeCloseFn('cancel', instance, () => {
      doneCalled = true
    })

    expect(doneCalled).toBe(true)
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('does not show success or error messages on cancel', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmSuccess = vi.fn()
    const confirmError = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(executeMock, {
        successMessage: 'ok',
        errorMessage: 'bad',
        confirmSuccess,
        confirmError,
      }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('cancel', instance, () => {})

    expect(successMock).not.toHaveBeenCalled()
    expect(errorMsgMock).not.toHaveBeenCalled()
    expect(confirmSuccess).not.toHaveBeenCalled()
    expect(confirmError).not.toHaveBeenCalled()
  })

  it('exposes loading ref from useRequest', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockResolvedValue('ok')
    const loadingRef = { value: true }
    useRequestMock.mockReturnValue({ loading: loadingRef, execute: executeMock })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    expect(res.loading).toBe(loadingRef)
    expect(res.loading.value).toBe(true)
  })

  it('works with undefined options (uses all defaults)', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, undefined as any))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(executeMock).toHaveBeenCalledTimes(1)
  })

  it('passes manual: true to useRequest', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    runInComponent(() => useAsyncConfirm(executeMock, {}))
    expect(useRequestMock).toHaveBeenCalledWith(executeMock, { manual: true })
  })

  it('can be called multiple times', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))

    res.confirm({ id: 1 })
    const instance1: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance1, () => {})

    res.confirm({ id: 2 })
    const instance2: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance2, () => {})

    expect(executeMock).toHaveBeenCalledTimes(2)
    expect(executeMock).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(executeMock).toHaveBeenNthCalledWith(2, { id: 2 })
  })

  it('does not throw when confirmError callback is not provided and service fails', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockRejectedValue(new Error('fail'))
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await expect(beforeCloseFn('confirm', instance, () => {})).resolves.not.toThrow()
  })

  it('does not throw when confirmSuccess callback is not provided and service succeeds', async () => {
    const { useRequest } = await import('@vuetkit/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, execute: executeMock })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await expect(beforeCloseFn('confirm', instance, () => {})).resolves.not.toThrow()
  })
})
