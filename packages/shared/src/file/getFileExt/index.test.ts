import { expect, it } from 'vitest'
import { getFileExt } from './index'

it('returns simple file extension', () => {
  expect(getFileExt('document.pdf')).toBe('pdf')
  expect(getFileExt('image.png')).toBe('png')
})

it('returns last segment when filename contains multiple dots', () => {
  expect(getFileExt('archive.tar.gz')).toBe('gz')
  expect(getFileExt('my.file.name.docx')).toBe('docx')
  expect(getFileExt('a.b.c.d.e')).toBe('e')
})

it('lowercases the extension', () => {
  expect(getFileExt('file.PDF')).toBe('pdf')
  expect(getFileExt('file.Jpg')).toBe('jpg')
  expect(getFileExt('file.JPEG')).toBe('jpeg')
  expect(getFileExt('File.Png')).toBe('png')
})

it('handles filenames with no extension (no dot)', () => {
  expect(getFileExt('readme')).toBe('readme')
  expect(getFileExt('README')).toBe('readme')
})

it('handles hidden files starting with a dot', () => {
  expect(getFileExt('.gitignore')).toBe('gitignore')
  expect(getFileExt('.env')).toBe('env')
})

it('handles hidden file with extension', () => {
  expect(getFileExt('.eslintrc.js')).toBe('js')
})

it('handles filename ending with a dot', () => {
  expect(getFileExt('test.')).toBe('')
})

it('handles single dot filename', () => {
  expect(getFileExt('.')).toBe('')
})

it('handles double dot path segment', () => {
  expect(getFileExt('..')).toBe('')
})

it('handles empty string', () => {
  expect(getFileExt('')).toBe('')
})

it('handles Chinese characters in filename', () => {
  expect(getFileExt('我的文档.docx')).toBe('docx')
  expect(getFileExt('图片.PNG')).toBe('png')
})

it('handles numbers and special characters in extension', () => {
  expect(getFileExt('backup.2024')).toBe('2024')
  expect(getFileExt('file.tar-bz2')).toBe('tar-bz2')
})

it('handles single-char extension', () => {
  expect(getFileExt('script.c')).toBe('c')
  expect(getFileExt('data.x')).toBe('x')
})

it('returned value is always a string', () => {
  expect(typeof getFileExt('file.pdf')).toBe('string')
  expect(typeof getFileExt('')).toBe('string')
})
