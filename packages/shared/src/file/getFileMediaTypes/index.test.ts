import { expect, it } from 'vitest'
import { getFileMediaTypes } from './index'

it('returns the media types object', () => {
  const result = getFileMediaTypes()
  expect(result).toBeDefined()
})

it('returns the same object reference on multiple calls', () => {
  const result1 = getFileMediaTypes()
  const result2 = getFileMediaTypes()
  expect(result1).toBe(result2)
})

it('returned value is an object', () => {
  const result = getFileMediaTypes()
  expect(typeof result).toBe('object')
  expect(result).not.toBeNull()
  expect(Array.isArray(result)).toBe(false)
})

it('contains expected document media types', () => {
  const result = getFileMediaTypes()
  expect(result.doc).toBe('application/msword')
  expect(result.docx).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  expect(result.pdf).toBe('application/pdf')
})

it('contains expected presentation media types', () => {
  const result = getFileMediaTypes()
  expect(result.ppt).toBe('application/vnd.ms-powerpoint')
  expect(result.pptx).toBe('application/vnd.openxmlformats-officedocument.presentationml.presentation')
})

it('contains expected spreadsheet media types', () => {
  const result = getFileMediaTypes()
  expect(result.xls).toBe('application/vnd.ms-excel')
  expect(result.xlsx).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
})

it('contains expected image media types', () => {
  const result = getFileMediaTypes()
  expect(result.png).toBe('image/png')
  expect(result.jpg).toBe('image/jpeg')
  expect(result.jpeg).toBe('image/jpeg')
  expect(result.gif).toBe('image/gif')
  expect(result.webp).toBe('image/webp')
})

it('jpg and jpeg share the same image/jpeg mime type', () => {
  const result = getFileMediaTypes()
  expect(result.jpg).toBe(result.jpeg)
  expect(result.jpg).toBe('image/jpeg')
})

it('has the expected number of media type entries', () => {
  const result = getFileMediaTypes()
  expect(Object.keys(result).length).toBe(12)
})

it('all media type values are non-empty strings', () => {
  const result = getFileMediaTypes()
  for (const [key, value] of Object.entries(result)) {
    expect(key).toBeTypeOf('string')
    expect(value).toBeTypeOf('string')
    expect(value.length).toBeGreaterThan(0)
  }
})

it('keys are lowercase file extensions', () => {
  const result = getFileMediaTypes()
  const keys = Object.keys(result)
  for (const key of keys) {
    expect(key).toBe(key.toLowerCase())
  }
})
