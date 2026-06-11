import { expect, it } from 'vitest'
import { realObj } from './index'

it('realObj returns true for plain objects', () => {
  expect(realObj({})).toBe(true)
  expect(realObj({ a: 1, b: 'hello' })).toBe(true)
})

it('realObj returns true for class instances', () => {
  class Foo {}
  expect(realObj(new Foo())).toBe(true)
})

it('realObj returns false for arrays', () => {
  expect(realObj([])).toBe(false)
  expect(realObj([1, 2, 3])).toBe(false)
})

it('realObj returns false for built-in object instances', () => {
  expect(realObj(new Date())).toBe(false)
  expect(realObj(/test/)).toBe(false)
  expect(realObj(new Map())).toBe(false)
  expect(realObj(new Set())).toBe(false)
  expect(realObj(new WeakMap())).toBe(false)
  expect(realObj(new WeakSet())).toBe(false)
  expect(realObj(Promise.resolve())).toBe(false)
  expect(realObj(new Error('test'))).toBe(false)
})

it('realObj returns false for null and undefined', () => {
  expect(realObj(null)).toBe(false)
  expect(realObj(undefined)).toBe(false)
})

it('realObj returns false for primitives', () => {
  expect(realObj(123)).toBe(false)
  expect(realObj(0)).toBe(false)
  expect(realObj('hello')).toBe(false)
  expect(realObj('')).toBe(false)
  expect(realObj(true)).toBe(false)
  expect(realObj(false)).toBe(false)
  expect(realObj(BigInt(123))).toBe(false)
  expect(realObj(Symbol('test'))).toBe(false)
})

it('realObj returns false for functions', () => {
  expect(realObj(() => {})).toBe(false)
  expect(realObj(() => {})).toBe(false)
  expect(realObj(class Foo {})).toBe(false)
})
