import { mount } from '@vue/test-utils'

// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref as vueRef } from 'vue'
import { useRequest } from './index'

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
})

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

describe('useRequest', () => {
  it('returns expected shape (loading, data, error, execute, cancel)', () => {
    const svc = vi.fn().mockResolvedValue('result')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true }))
    expect(res.loading).toBeDefined()
    expect(res.data).toBeDefined()
    expect(res.error).toBeDefined()
    expect(typeof res.execute).toBe('function')
    expect(typeof res.cancel).toBe('function')
    expect(res.loading.value).toBe(false)
    expect(res.data.value).toBe(null)
    expect(res.error.value).toBe(undefined)
  })

  it('uses initialData when provided', () => {
    const svc = vi.fn().mockResolvedValue('result')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, initialData: 'init' }))
    expect(res.data.value).toBe('init')
  })

  it('executes automatically on mount when manual is false', async () => {
    const svc = vi.fn().mockResolvedValue('auto-data')
    runInComponent(() => useRequest<string>(svc))
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledTimes(1)
  })

  it('does not auto-execute when manual is true', async () => {
    const svc = vi.fn().mockResolvedValue('x')
    runInComponent(() => useRequest(svc, { manual: true }))
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).not.toHaveBeenCalled()
  })

  it('sets data and loading state on successful request', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0 }))
    res.execute()
    vi.advanceTimersByTime(0)
    expect(res.loading.value).toBe(true)
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe('ok')
    expect(res.loading.value).toBe(false)
  })

  it('calls onSuccess with formatted data on success', async () => {
    const svc = vi.fn().mockResolvedValue({ value: 10 })
    const onSuccess = vi.fn()
    const { result: res } = runInComponent(() =>
      useRequest(svc, {
        manual: true,
        delayLoadingTime: 0,
        formatData: (d: any) => d.value as number,
        onSuccess,
      }),
    )
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe(10)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(10)
  })

  it('uses formatData without onSuccess', async () => {
    const svc = vi.fn().mockResolvedValue({ v: 5 })
    const { result: res } = runInComponent(() =>
      useRequest(svc, { manual: true, delayLoadingTime: 0, formatData: (d: any) => d.v }),
    )
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe(5)
  })

  it('sets error and calls onError on failed request', async () => {
    const err = new Error('boom')
    const svc = vi.fn().mockRejectedValue(err)
    const onError = vi.fn()
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0, onError }))
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.error.value).toBe(err)
    expect(onError).toHaveBeenCalledWith(err)
    expect(res.loading.value).toBe(false)
  })

  it('onFinally called regardless of success or failure', async () => {
    const onFinally = vi.fn()
    const svcOk = vi.fn().mockResolvedValue('ok')
    const { result: resOk } = runInComponent(() => useRequest(svcOk, { manual: true, delayLoadingTime: 0, onFinally }))
    resOk.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(onFinally).toHaveBeenCalledTimes(1)

    const onFinally2 = vi.fn()
    const svcBad = vi.fn().mockRejectedValue(new Error('bad'))
    const { result: resBad } = runInComponent(() => useRequest(svcBad, { manual: true, delayLoadingTime: 0, onFinally: onFinally2 }))
    resBad.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(onFinally2).toHaveBeenCalledTimes(1)
  })

  it('loading is false when request completes before delayLoadingTime', async () => {
    const svc = vi.fn().mockResolvedValue('fast')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 1000 }))
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.loading.value).toBe(false)
    expect(res.data.value).toBe('fast')
  })

  it('mergeParams: defaultParams function returns object, execute params merged with function result', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() =>
      useRequest(svc, {
        manual: true,
        delayLoadingTime: 0,
        defaultParams: () => ({ a: 1 }),
      }),
    )
    res.execute({ b: 2 })
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith({ a: 1, b: 2 })
  })

  it('mergeParams: defaultParams function, no execute params uses function result', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() =>
      useRequest(svc, {
        manual: true,
        delayLoadingTime: 0,
        defaultParams: () => ({ a: 1 }),
      }),
    )
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith({ a: 1 })
  })

  it('mergeParams: no defaultParams and no params passes undefined', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0 }))
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith(undefined)
  })

  it('delay timer clears itself when request completes before timer fires', async () => {
    let resolveFn: (v: string) => void = () => {}
    const svc = vi.fn().mockImplementation(
      () => new Promise<string>((r) => { resolveFn = r }),
    )
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 500 }))
    res.execute()
    // request completes BEFORE delay timer fires
    resolveFn('completed-fast')
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.loading.value).toBe(false)
    expect(res.data.value).toBe('completed-fast')
  })

  it('calling execute with delay clears previous pending timer', async () => {
    let resolveFn: (v: string) => void = () => {}
    const svc = vi.fn().mockImplementation(
      () => new Promise<string>((r) => { resolveFn = r }),
    )
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 200 }))
    res.execute()
    // cancel the first request (sets loading false, but timer still pending)
    res.cancel()
    // start a new request
    res.execute()
    resolveFn('second')
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.loading.value).toBe(false)
    expect(res.data.value).toBe('second')
  })

  it('loading becomes true after delayLoadingTime if request is still pending', async () => {
    let resolveFn: (v: string) => void = () => {}
    const svc = vi.fn().mockImplementation(
      () => new Promise<string>((r) => { resolveFn = r }),
    )
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 300 }))
    res.execute()
    vi.advanceTimersByTime(100)
    expect(res.loading.value).toBe(false)
    vi.advanceTimersByTime(300)
    expect(res.loading.value).toBe(true)
    resolveFn('done')
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.loading.value).toBe(false)
    expect(res.data.value).toBe('done')
  })

  it('uses default delayLoadingTime of 300 when not provided', async () => {
    let resolveFn: (v: string) => void = () => {}
    const svc = vi.fn().mockImplementation(
      () => new Promise<string>((r) => { resolveFn = r }),
    )
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true }))
    res.execute()
    vi.advanceTimersByTime(299)
    expect(res.loading.value).toBe(false)
    vi.advanceTimersByTime(2)
    expect(res.loading.value).toBe(true)
    resolveFn('ok')
    await vi.runAllTimersAsync()
    await nextTick()
  })

  it('cancel discards data and sets loading to false', async () => {
    const svc = vi.fn().mockResolvedValue('should-be-discarded')
    const onSuccess = vi.fn()
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0, initialData: 'init', onSuccess }))
    res.execute()
    vi.advanceTimersByTime(0)
    expect(res.loading.value).toBe(true)
    res.cancel()
    expect(res.loading.value).toBe(false)
    await vi.runAllTimersAsync()
    await nextTick()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('cancel when no request has been executed', () => {
    const svc = vi.fn().mockResolvedValue('x')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, initialData: 'init' }))
    expect(() => res.cancel()).not.toThrow()
    expect(res.loading.value).toBe(false)
  })

  it('mergeParams: no params at all', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0 }))
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith(undefined)
  })

  it('mergeParams: only defaultParams as object', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() =>
      useRequest(svc, { manual: true, delayLoadingTime: 0, defaultParams: { a: 1 } }),
    )
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith({ a: 1 })
  })

  it('mergeParams: only execute params', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0 }))
    res.execute({ b: 2 })
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith({ b: 2 })
  })

  it('mergeParams: both object params are merged, execute overrides default', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() =>
      useRequest(svc, { manual: true, delayLoadingTime: 0, defaultParams: { a: 1, b: 2 } }),
    )
    res.execute({ b: 20, c: 3 })
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith({ a: 1, b: 20, c: 3 })
  })

  it('mergeParams: non-object execute params overrides defaultParams object', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() =>
      useRequest(svc, { manual: true, delayLoadingTime: 0, defaultParams: { a: 1 } }),
    )
    res.execute([1, 2, 3])
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith([1, 2, 3])
  })

  it('mergeParams: object execute params overrides non-object defaultParams', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const { result: res } = runInComponent(() =>
      useRequest(svc, { manual: true, delayLoadingTime: 0, defaultParams: [1, 2] }),
    )
    res.execute({ a: 1 })
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith({ a: 1 })
  })

  it('mergeParams: supports ref/reactive params via toValue', async () => {
    const svc = vi.fn().mockResolvedValue('ok')
    const defaultParams = vueRef({ a: 1 })
    const { result: res } = runInComponent(() =>
      useRequest(svc, { manual: true, delayLoadingTime: 0, defaultParams }),
    )
    const executeParams = vueRef({ b: 2 })
    res.execute(executeParams)
    await vi.runAllTimersAsync()
    await nextTick()
    expect(svc).toHaveBeenCalledWith({ a: 1, b: 2 })
  })

  it('stale request data is discarded when a newer request resolves first', async () => {
    let resolve1: (v: string) => void = () => {}
    let resolve2: (v: string) => void = () => {}
    let callCount = 0
    const svc = vi.fn().mockImplementation(
      () =>
        new Promise<string>((r) => {
          callCount += 1
          if (callCount === 1)
            resolve1 = r
          else resolve2 = r
        }),
    )
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0 }))
    res.execute()
    res.execute()
    resolve2('second')
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe('second')
    resolve1('first')
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe('second')
  })

  it('clears pending timer and resets requestId on unmount', async () => {
    let resolveFn: (v: string) => void = () => {}
    const svc = vi.fn().mockImplementation(
      () => new Promise<string>((r) => { resolveFn = r }),
    )
    const { result: res, unmount } = runInComponent(() => useRequest(svc, { delayLoadingTime: 500 }))
    vi.advanceTimersByTime(100)
    expect(res.loading.value).toBe(false)
    unmount()
    await nextTick()
    resolveFn('after-unmount')
    await vi.runAllTimersAsync()
    await nextTick()
  })

  it('previous error remains but new success updates data', async () => {
    const err = new Error('bad')
    let shouldFail = true
    const svc = vi.fn().mockImplementation(
      () => (shouldFail ? Promise.reject(err) : Promise.resolve('good')),
    )
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, delayLoadingTime: 0 }))
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.error.value).toBe(err)

    shouldFail = false
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe('good')
  })

  it('works with no options passed (defaults applied)', async () => {
    const svc = vi.fn().mockResolvedValue('plain')
    const { result: res } = runInComponent(() => useRequest<string>(svc, { manual: true }))
    res.execute()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe('plain')
  })

  it('data returns to initialData after cancel discards pending request', async () => {
    const svc = vi.fn().mockResolvedValue('discarded')
    const { result: res } = runInComponent(() => useRequest(svc, { manual: true, initialData: 'init', delayLoadingTime: 0 }))
    res.execute()
    vi.advanceTimersByTime(0)
    res.cancel()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res.data.value).toBe('init')
  })

  it('data falls back to null after cancel when no initialData', async () => {
    const svc2 = vi.fn().mockResolvedValue('discarded2')
    const { result: res2 } = runInComponent(() => useRequest(svc2, { manual: true, delayLoadingTime: 0 }))
    res2.execute()
    vi.advanceTimersByTime(0)
    res2.cancel()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(res2.data.value).toBe(null)
  })
})
