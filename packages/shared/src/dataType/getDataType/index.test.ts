import { expect, it } from 'vitest'
import { getDataType } from './index'

it('null', () => {
  expect(getDataType(null)).toBe('null')
})

it('undefined', () => {
  expect(getDataType(undefined)).toBe('undefined')
})

it('number', () => {
  expect(getDataType(123)).toBe('number')
  expect(getDataType(0)).toBe('number')
  expect(getDataType(Number.NaN)).toBe('number')
  expect(getDataType(Infinity)).toBe('number')
})

it('string', () => {
  expect(getDataType('hello')).toBe('string')
  expect(getDataType('')).toBe('string')
})

it('boolean', () => {
  expect(getDataType(true)).toBe('boolean')
  expect(getDataType(false)).toBe('boolean')
})

it('bigint', () => {
  expect(getDataType(BigInt(123))).toBe('bigint')
})

it('symbol', () => {
  expect(getDataType(Symbol('test'))).toBe('symbol')
})

it('object', () => {
  expect(getDataType({})).toBe('[object Object]')
  expect(getDataType({ a: 1 })).toBe('[object Object]')
})

it('array', () => {
  expect(getDataType([])).toBe('[object Array]')
  expect(getDataType([1, 2, 3])).toBe('[object Array]')
})

it('function', () => {
  expect(getDataType(() => {})).toBe('function')
  expect(getDataType(() => {})).toBe('function')
  expect(getDataType(class Foo {})).toBe('function')
})

it('date', () => {
  expect(getDataType(new Date())).toBe('[object Date]')
})

it('regexp', () => {
  expect(getDataType(/test/)).toBe('[object RegExp]')
})

it('map', () => {
  expect(getDataType(new Map())).toBe('[object Map]')
})

it('set', () => {
  expect(getDataType(new Set())).toBe('[object Set]')
})

it('weakmap', () => {
  expect(getDataType(new WeakMap())).toBe('[object WeakMap]')
})

it('weakset', () => {
  expect(getDataType(new WeakSet())).toBe('[object WeakSet]')
})

it('promise', () => {
  expect(getDataType(Promise.resolve())).toBe('[object Promise]')
})

it('error', () => {
  expect(getDataType(new Error('test'))).toBe('[object Error]')
})

it('class instance', () => {
  class Foo {}
  expect(getDataType(new Foo())).toBe('[object Object]')
})
