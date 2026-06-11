import { expect, it } from 'vitest'
import { isObj } from './index'

it('isObj returns true for plain objects', () => {
  expect(isObj({})).toBe(true)
  expect(isObj({ a: 1 })).toBe(true)
})

it('isObj returns true for arrays', () => {
  expect(isObj([])).toBe(true)
  expect(isObj([1, 2, 3])).toBe(true)
})

it('isObj returns true for built-in object instances', () => {
  expect(isObj(new Date())).toBe(true)
  expect(isObj(/test/)).toBe(true)
  expect(isObj(new Map())).toBe(true)
  expect(isObj(new Set())).toBe(true)
  expect(isObj(new WeakMap())).toBe(true)
  expect(isObj(new WeakSet())).toBe(true)
  expect(isObj(Promise.resolve())).toBe(true)
  expect(isObj(new Error('test'))).toBe(true)
})

it('isObj returns true for class instances', () => {
  class Foo {}
  expect(isObj(new Foo())).toBe(true)
})

it('isObj returns false for null', () => {
  expect(isObj(null)).toBe(false)
})

it('isObj returns false for undefined', () => {
  expect(isObj(undefined)).toBe(false)
})

it('isObj returns false for primitives', () => {
  expect(isObj(123)).toBe(false)
  expect(isObj(0)).toBe(false)
  expect(isObj(Number.NaN)).toBe(false)
  expect(isObj(Infinity)).toBe(false)
  expect(isObj('hello')).toBe(false)
  expect(isObj('')).toBe(false)
  expect(isObj(true)).toBe(false)
  expect(isObj(false)).toBe(false)
  expect(isObj(BigInt(123))).toBe(false)
  expect(isObj(Symbol('test'))).toBe(false)
})

it('isObj returns false for functions', () => {
  expect(isObj(() => {})).toBe(false)
  expect(isObj(() => {})).toBe(false)
  expect(isObj(class Foo {})).toBe(false)
})
