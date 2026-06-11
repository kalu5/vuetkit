import { expect, it } from 'vitest'
import { isFunc } from './index'

it('null', () => {
  expect(isFunc(null)).toBe(false)
})

it('undefined', () => {
  expect(isFunc(undefined)).toBe(false)
})

it('number', () => {
  expect(isFunc(123)).toBe(false)
  expect(isFunc(0)).toBe(false)
  expect(isFunc(Number.NaN)).toBe(false)
  expect(isFunc(Infinity)).toBe(false)
})

it('string', () => {
  expect(isFunc('hello')).toBe(false)
  expect(isFunc('')).toBe(false)
})

it('boolean', () => {
  expect(isFunc(true)).toBe(false)
  expect(isFunc(false)).toBe(false)
})

it('bigint', () => {
  expect(isFunc(BigInt(123))).toBe(false)
})

it('symbol', () => {
  expect(isFunc(Symbol('test'))).toBe(false)
})

it('object', () => {
  expect(isFunc({})).toBe(false)
  expect(isFunc({ a: 1 })).toBe(false)
})

it('array', () => {
  expect(isFunc([])).toBe(false)
  expect(isFunc([1, 2, 3])).toBe(false)
})

it('arrow function', () => {
  expect(isFunc(() => {})).toBe(true)
})

it('named function', () => {
  function foo() {}
  expect(isFunc(foo)).toBe(true)
})

it('anonymous function', () => {
  expect(isFunc(() => {})).toBe(true)
})

it('generator function', () => {
  expect(isFunc(function* () {})).toBe(true)
})

it('async function', () => {
  expect(isFunc(async () => {})).toBe(true)
  expect(isFunc(async () => {})).toBe(true)
})

it('class', () => {
  class Foo {}
  expect(isFunc(Foo)).toBe(true)
})

it('class instance', () => {
  class Foo {}
  expect(isFunc(new Foo())).toBe(false)
})

it('date', () => {
  expect(isFunc(new Date())).toBe(false)
})

it('regexp', () => {
  expect(isFunc(/test/)).toBe(false)
})

it('map', () => {
  expect(isFunc(new Map())).toBe(false)
})

it('set', () => {
  expect(isFunc(new Set())).toBe(false)
})

it('weakmap', () => {
  expect(isFunc(new WeakMap())).toBe(false)
})

it('weakset', () => {
  expect(isFunc(new WeakSet())).toBe(false)
})

it('promise', () => {
  expect(isFunc(Promise.resolve())).toBe(false)
})

it('error', () => {
  expect(isFunc(new Error('test'))).toBe(false)
})

it('arguments', () => {
  function foo(...args: any[]) {
    expect(isFunc(args)).toBe(false)
  }
  foo()
})

it('object with Function type tag is not a function', () => {
  const fakeFunc = {
    get [Symbol.toStringTag]() {
      return 'Function'
    },
  }
  expect(isFunc(fakeFunc)).toBe(false)
})
