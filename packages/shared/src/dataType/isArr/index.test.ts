import { expect, it } from 'vitest'
import { isArr } from './index'

it('empty array', () => {
  expect(isArr([])).toBe(true)
})

it('array with elements', () => {
  expect(isArr([1, 2, 3])).toBe(true)
  expect(isArr(['a', 'b', 'c'])).toBe(true)
  expect(isArr([1, 'a', null, undefined])).toBe(true)
  expect(isArr([{}, []])).toBe(true)
})

it('nested array', () => {
  expect(isArr([[1, 2], [3, 4]])).toBe(true)
  expect(isArr([[[[]]]])).toBe(true)
})

it('array created by Array constructor', () => {
  expect(isArr([])).toBe(true)
  expect(isArr(Array.from({ length: 3 }))).toBe(true)
  expect(isArr([1, 2, 3])).toBe(true)
})

it('array created by Array.of', () => {
  expect(isArr(Array.of(1, 2, 3))).toBe(true)
})

it('array created by Array.from', () => {
  expect(isArr(Array.from([1, 2, 3]))).toBe(true)
  expect(isArr(Array.from('hello'))).toBe(true)
  expect(isArr(Array.from(new Set([1, 2, 3])))).toBe(true)
})

it('rest args are arrays', () => {
  function foo(...args: any[]) {
    expect(isArr(args)).toBe(true)
  }
  foo()
})

it('null', () => {
  expect(isArr(null)).toBe(false)
})

it('undefined', () => {
  expect(isArr(undefined)).toBe(false)
})

it('number', () => {
  expect(isArr(123)).toBe(false)
  expect(isArr(0)).toBe(false)
  expect(isArr(Number.NaN)).toBe(false)
  expect(isArr(Infinity)).toBe(false)
})

it('string', () => {
  expect(isArr('hello')).toBe(false)
  expect(isArr('')).toBe(false)
})

it('boolean', () => {
  expect(isArr(true)).toBe(false)
  expect(isArr(false)).toBe(false)
})

it('bigint', () => {
  expect(isArr(BigInt(123))).toBe(false)
})

it('symbol', () => {
  expect(isArr(Symbol('test'))).toBe(false)
})

it('object', () => {
  expect(isArr({})).toBe(false)
  expect(isArr({ length: 3, 0: 1, 1: 2, 2: 3 })).toBe(false)
  expect(isArr({ a: 1 })).toBe(false)
})

it('function', () => {
  expect(isArr(() => {})).toBe(false)
  expect(isArr(() => {})).toBe(false)
  expect(isArr(class Foo {})).toBe(false)
})

it('class instance', () => {
  class Foo {}
  expect(isArr(new Foo())).toBe(false)
})

it('date', () => {
  expect(isArr(new Date())).toBe(false)
})

it('regexp', () => {
  expect(isArr(/test/)).toBe(false)
})

it('map', () => {
  expect(isArr(new Map())).toBe(false)
  expect(isArr(new Map([['a', 1]]))).toBe(false)
})

it('set', () => {
  expect(isArr(new Set())).toBe(false)
  expect(isArr(new Set([1, 2, 3]))).toBe(false)
})

it('weakmap', () => {
  expect(isArr(new WeakMap())).toBe(false)
})

it('weakset', () => {
  expect(isArr(new WeakSet())).toBe(false)
})

it('promise', () => {
  expect(isArr(Promise.resolve())).toBe(false)
})

it('error', () => {
  expect(isArr(new Error('test'))).toBe(false)
})

it('array-like object is not an array', () => {
  const arrayLike = { length: 3, 0: 1, 1: 2, 2: 3 }
  expect(isArr(arrayLike)).toBe(false)
})

it('object with custom Symbol.toStringTag as Array is not an array', () => {
  const fakeArr = {
    get [Symbol.toStringTag]() {
      return 'Array'
    },
    length: 0,
  }
  expect(isArr(fakeArr)).toBe(false)
})
