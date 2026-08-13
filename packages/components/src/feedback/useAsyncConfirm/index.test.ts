import { mount } from '@vue/test-utils'

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useAsyncConfirm } from './index'

vi.mock('element-plus', () => {
  const confirmImpl = vi.fn()
  return { ElMessageBox: { confirm: confirmImpl } }
})

vi.mock('@vuecraft/core', () => {
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
    const { useRequest } = await import('@vuecraft/core')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const errorRef = { value: undefined as unknown }
    const loadingRef = { value: false }
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: loadingRef, error: errorRef, execute: executeMock })

    const { result: res } = runInComponent(() => useAsyncConfirm(executeMock, {}))
    expect(res.loading).toBeDefined()
    expect(typeof res.confirm).toBe('function')
  })

  it('calls ElMessageBox.confirm with default options', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, error: { value: undefined }, execute: executeMock })
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
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const executeMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, error: { value: undefined }, execute: executeMock })
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
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (err) {
        errorRef.value = err
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
    res.confirm({ id: 42 })

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    let doneCalled = false
    await beforeCloseFn('confirm', instance, () => {
      doneCalled = true
    })

    expect(wrappedExecute).toHaveBeenCalledWith({ id: 42 })
    expect(doneCalled).toBe(true)
  })

  it('executes confirm service with undefined params when no params provided', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (err) {
        errorRef.value = err
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(wrappedExecute).toHaveBeenCalledWith(undefined)
  })

  it('sets confirmButtonLoading to true during async request and false after', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    let resolveFn: (v: string) => void = () => {}
    const serviceMock = vi.fn().mockImplementation(
      () => new Promise<string>((r) => { resolveFn = r }),
    )
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (err) {
        errorRef.value = err
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
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
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (err) {
        errorRef.value = err
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmSuccess = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(serviceMock, {
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
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (err) {
        errorRef.value = err
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(successMock).not.toHaveBeenCalled()
    expect(errorMsgMock).not.toHaveBeenCalled()
  })

  it('calls confirmError callback with error object when service fails', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const err = new Error('service error')
    const serviceMock = vi.fn().mockRejectedValue(err)
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmError = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(serviceMock, {
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
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const serviceMock = vi.fn().mockRejectedValue(new Error('fail'))
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() =>
      useAsyncConfirm(serviceMock, {
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
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockRejectedValue(new Error('fail'))
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
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
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockRejectedValue(new Error('fail'))
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmSuccess = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(serviceMock, { confirmSuccess }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(confirmSuccess).not.toHaveBeenCalled()
  })

  it('does not call confirmError when service succeeds', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmError = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(serviceMock, { confirmError }),
    )
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(confirmError).not.toHaveBeenCalled()
  })

  it('calls done on cancel action without executing service', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    let doneCalled = false
    await beforeCloseFn('cancel', instance, () => {
      doneCalled = true
    })

    expect(doneCalled).toBe(true)
    expect(wrappedExecute).not.toHaveBeenCalled()
  })

  it('does not show success or error messages on cancel', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const { useMessage } = await import('../useMessage')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>
    const useMessageMock = useMessage as unknown as ReturnType<typeof vi.fn>

    const successMock = vi.fn()
    const errorMsgMock = vi.fn()
    useMessageMock.mockReturnValue({ success: successMock, error: errorMsgMock })

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const confirmSuccess = vi.fn()
    const confirmError = vi.fn()
    const { result: res } = runInComponent(() =>
      useAsyncConfirm(serviceMock, {
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
    const { useRequest } = await import('@vuecraft/core')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const loadingRef = { value: true }
    useRequestMock.mockReturnValue({ loading: loadingRef, error: { value: undefined }, execute: serviceMock })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
    expect(res.loading).toBe(loadingRef)
    expect(res.loading.value).toBe(true)
  })

  it('works with undefined options (uses all defaults)', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, undefined as any))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance, () => {})

    expect(wrappedExecute).toHaveBeenCalledTimes(1)
  })

  it('passes manual: true to useRequest', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockResolvedValue('ok')
    useRequestMock.mockReturnValue({ loading: { value: false }, error: { value: undefined }, execute: serviceMock })

    runInComponent(() => useAsyncConfirm(serviceMock, {}))
    expect(useRequestMock).toHaveBeenCalledWith(serviceMock, { manual: true })
  })

  it('can be called multiple times', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))

    res.confirm({ id: 1 })
    const instance1: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance1, () => {})

    res.confirm({ id: 2 })
    const instance2: MessageBoxInstance = { confirmButtonLoading: false }
    await beforeCloseFn('confirm', instance2, () => {})

    expect(wrappedExecute).toHaveBeenCalledTimes(2)
    expect(wrappedExecute).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(wrappedExecute).toHaveBeenNthCalledWith(2, { id: 2 })
  })

  it('does not throw when confirmError callback is not provided and service fails', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockRejectedValue(new Error('fail'))
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await expect(beforeCloseFn('confirm', instance, () => {})).resolves.not.toThrow()
  })

  it('does not throw when confirmSuccess callback is not provided and service succeeds', async () => {
    const { useRequest } = await import('@vuecraft/core')
    const { ElMessageBox } = await import('element-plus')
    const useRequestMock = useRequest as unknown as ReturnType<typeof vi.fn>
    const elMessageBoxMock = ElMessageBox.confirm as unknown as ReturnType<typeof vi.fn>

    const serviceMock = vi.fn().mockResolvedValue('ok')
    const errorRef = { value: undefined as unknown }
    const wrappedExecute = vi.fn(async (params?: unknown) => {
      try {
        const res = await serviceMock(params)
        errorRef.value = null
        return res
      }
      catch (e) {
        errorRef.value = e
        return undefined
      }
    })
    useRequestMock.mockReturnValue({ loading: { value: false }, error: errorRef, execute: wrappedExecute })

    let beforeCloseFn: any = null
    elMessageBoxMock.mockImplementation((_m: string, _t: string, opts: any) => {
      beforeCloseFn = opts.beforeClose
      return { catch: () => {} }
    })

    const { result: res } = runInComponent(() => useAsyncConfirm(serviceMock, {}))
    res.confirm()

    const instance: MessageBoxInstance = { confirmButtonLoading: false }
    await expect(beforeCloseFn('confirm', instance, () => {})).resolves.not.toThrow()
  })
})
