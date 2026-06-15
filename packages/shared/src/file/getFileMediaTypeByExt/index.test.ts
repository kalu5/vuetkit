import { expect, it } from 'vitest'
import { getFileMediaTypeByExt } from './index'

it('returns document mime types', () => {
  expect(getFileMediaTypeByExt('doc')).toBe('application/msword')
  expect(getFileMediaTypeByExt('docx')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  expect(getFileMediaTypeByExt('pdf')).toBe('application/pdf')
})

it('returns presentation mime types', () => {
  expect(getFileMediaTypeByExt('ppt')).toBe('application/vnd.ms-powerpoint')
  expect(getFileMediaTypeByExt('pptx')).toBe('application/vnd.openxmlformats-officedocument.presentationml.presentation')
})

it('returns spreadsheet mime types', () => {
  expect(getFileMediaTypeByExt('xls')).toBe('application/vnd.ms-excel')
  expect(getFileMediaTypeByExt('xlsx')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
})

it('returns image mime types', () => {
  expect(getFileMediaTypeByExt('png')).toBe('image/png')
  expect(getFileMediaTypeByExt('jpg')).toBe('image/jpeg')
  expect(getFileMediaTypeByExt('jpeg')).toBe('image/jpeg')
  expect(getFileMediaTypeByExt('gif')).toBe('image/gif')
  expect(getFileMediaTypeByExt('webp')).toBe('image/webp')
})

it('jpg and jpeg both return image/jpeg', () => {
  expect(getFileMediaTypeByExt('jpg')).toBe('image/jpeg')
  expect(getFileMediaTypeByExt('jpeg')).toBe('image/jpeg')
})

it('returns empty string for unknown extension', () => {
  expect(getFileMediaTypeByExt('unknown')).toBe('')
  expect(getFileMediaTypeByExt('xyz')).toBe('')
})

it('returns empty string for empty string', () => {
  expect(getFileMediaTypeByExt('')).toBe('')
})

it('is case sensitive - uppercase extension returns empty string', () => {
  expect(getFileMediaTypeByExt('DOC')).toBe('')
  expect(getFileMediaTypeByExt('JPG')).toBe('')
})

it('returned value is always a string', () => {
  expect(typeof getFileMediaTypeByExt('pdf')).toBe('string')
  expect(typeof getFileMediaTypeByExt('unknown')).toBe('string')
  expect(typeof getFileMediaTypeByExt('')).toBe('string')
})
