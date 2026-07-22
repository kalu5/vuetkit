import { beforeEach, expect, it, vi } from 'vitest'
import { debounce } from './index'

beforeEach(() => {
  vi.useFakeTimers()
})

it('does not invoke fn immediately', () => {
  const fn = vi.fn()
  const debounced = debounce(fn, 200)
  debounced()
  expect(fn).not.toHaveBeenCalled()
})

it('invokes fn after wait time', () => {
  const fn = vi.fn()
  const debounced = debounce(fn, 200)
  debounced()
  vi.advanceTimersByTime(200)
  expect(fn).toHaveBeenCalledTimes(1)
})

it('only invokes once for multiple rapid calls', () => {
  const fn = vi.fn()
  const debounced = debounce(fn, 200)
  debounced()
  debounced()
  debounced()
  vi.advanceTimersByTime(200)
  expect(fn).toHaveBeenCalledTimes(1)
})

it('resets timer on each call', () => {
  const fn = vi.fn()
  const debounced = debounce(fn, 200)
  debounced()
  vi.advanceTimersByTime(100)
  debounced()
  vi.advanceTimersByTime(100)
  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(100)
  expect(fn).toHaveBeenCalledTimes(1)
})

it('passes arguments to fn', () => {
  const fn = vi.fn()
  const debounced = debounce(fn, 200)
  debounced('a', 'b')
  vi.advanceTimersByTime(200)
  expect(fn).toHaveBeenCalledWith('a', 'b')
})

it('uses default wait of 300', () => {
  const fn = vi.fn()
  const debounced = debounce(fn)
  debounced()
  vi.advanceTimersByTime(299)
  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(fn).toHaveBeenCalledTimes(1)
})

it('cancel clears pending invocation', () => {
  const fn = vi.fn()
  const debounced = debounce(fn, 200)
  debounced()
  debounced.cancel()
  vi.advanceTimersByTime(200)
  expect(fn).not.toHaveBeenCalled()
})

it('can be called again after cancel', () => {
  const fn = vi.fn()
  const debounced = debounce(fn, 200)
  debounced()
  debounced.cancel()
  debounced()
  vi.advanceTimersByTime(200)
  expect(fn).toHaveBeenCalledTimes(1)
})

it('preserves this context', () => {
  const obj = {
    val: 42,
    method: vi.fn(function (this: { val: number }) {
      return this.val
    }),
  }
  const debounced = debounce(obj.method, 200)
  debounced.call(obj)
  vi.advanceTimersByTime(200)
  expect(obj.method).toHaveBeenCalledTimes(1)
})
