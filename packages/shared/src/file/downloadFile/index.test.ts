/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { downloadFile } from './index'

function createBlob(size: number, type = '') {
  const content = new Uint8Array(size).fill(65)
  return new Blob([content], { type })
}

let originalCreateElement: typeof document.createElement
let createAnchorSpy: ReturnType<typeof vi.fn>
let anchorMock: {
  href: string
  download: string
  click: ReturnType<typeof vi.fn>
  tagName: string
}
let appendChildSpy: ReturnType<typeof vi.fn>
let removeChildSpy: ReturnType<typeof vi.fn>
let originalAppendChild: typeof document.body.appendChild
let originalRemoveChild: typeof document.body.removeChild

beforeEach(() => {
  originalCreateElement = document.createElement
  createAnchorSpy = vi.fn()
  anchorMock = { href: '', download: '', click: vi.fn(), tagName: 'A' }
  createAnchorSpy.mockReturnValue(anchorMock)
  document.createElement = vi.fn((tag: string) => {
    if (tag === 'a')
      return anchorMock as unknown as HTMLAnchorElement
    return originalCreateElement.call(document, tag)
  }) as typeof document.createElement

  originalAppendChild = document.body.appendChild
  originalRemoveChild = document.body.removeChild
  appendChildSpy = vi.fn().mockImplementation((node: Node) => node)
  removeChildSpy = vi.fn()
  Object.defineProperty(document.body, 'appendChild', {
    configurable: true,
    writable: true,
    value: appendChildSpy,
  })
  Object.defineProperty(document.body, 'removeChild', {
    configurable: true,
    writable: true,
    value: removeChildSpy,
  })
})

afterEach(() => {
  document.createElement = originalCreateElement
  Object.defineProperty(document.body, 'appendChild', {
    configurable: true,
    writable: true,
    value: originalAppendChild,
  })
  Object.defineProperty(document.body, 'removeChild', {
    configurable: true,
    writable: true,
    value: originalRemoveChild,
  })
  vi.restoreAllMocks()
})

it('returns early when blob is null', () => {
  const result = downloadFile(null as unknown as Blob, 'file.pdf')
  expect(result).toBeUndefined()
  expect(anchorMock.click).not.toHaveBeenCalled()
})

it('returns early when blob is undefined', () => {
  const result = downloadFile(undefined as unknown as Blob, 'file.pdf')
  expect(result).toBeUndefined()
  expect(anchorMock.click).not.toHaveBeenCalled()
})

it('returns early when fileName is empty', () => {
  const blob = createBlob(100, 'application/pdf')
  const result = downloadFile(blob, '')
  expect(result).toBeUndefined()
  expect(anchorMock.click).not.toHaveBeenCalled()
})

it('returns early when blob size is 0', () => {
  const blob = createBlob(0, 'application/pdf')
  const result = downloadFile(blob, 'file.pdf')
  expect(result).toBeUndefined()
  expect(anchorMock.click).not.toHaveBeenCalled()
})

it('downloads blob with existing mime type', () => {
  const blob = createBlob(100, 'application/pdf')
  downloadFile(blob, 'document.pdf')
  expect(anchorMock.download).toBe('document.pdf')
  expect(anchorMock.click).toHaveBeenCalled()
})

it('infers mime type from fileName when blob.type is empty', () => {
  const blob = createBlob(100, '')
  downloadFile(blob, 'image.png')
  expect(anchorMock.download).toBe('image.png')
  expect(anchorMock.click).toHaveBeenCalled()
})

it('infers mime type from fileName when blob.type is missing', () => {
  const blob = createBlob(100)
  downloadFile(blob, 'report.docx')
  expect(anchorMock.download).toBe('report.docx')
  expect(anchorMock.click).toHaveBeenCalled()
})

it('handles unknown file extension gracefully', () => {
  const blob = createBlob(100, '')
  downloadFile(blob, 'unknown.xyz123')
  expect(anchorMock.click).toHaveBeenCalled()
})

it('handles fileName without extension', () => {
  const blob = createBlob(100, '')
  downloadFile(blob, 'readme')
  expect(anchorMock.click).toHaveBeenCalled()
})

it('removes the anchor element from DOM after download', () => {
  const blob = createBlob(100, 'application/pdf')
  downloadFile(blob, 'file.pdf')
  expect(removeChildSpy).toHaveBeenCalled()
})

it('catches and logs errors during anchor click', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  anchorMock.click.mockImplementation(() => {
    throw new Error('click failed')
  })
  const blob = createBlob(100, 'application/pdf')
  expect(() => downloadFile(blob, 'file.pdf')).not.toThrow()
  expect(errorSpy).toHaveBeenCalled()
  expect(removeChildSpy).toHaveBeenCalled()
  errorSpy.mockRestore()
})

it('creates URL from blob and revokes it', () => {
  const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url')
  const revokeUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  const blob = createBlob(100, 'application/pdf')
  downloadFile(blob, 'file.pdf')
  expect(createUrlSpy).toHaveBeenCalled()
  expect(revokeUrlSpy).toHaveBeenCalledWith('blob:test-url')
  createUrlSpy.mockRestore()
  revokeUrlSpy.mockRestore()
})

it('reuses original blob when mime type matches', () => {
  const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:reuse-url')
  const blob = createBlob(100, 'application/pdf')
  downloadFile(blob, 'document.pdf')
  const passedBlob = createUrlSpy.mock.calls[0][0] as Blob
  expect(passedBlob).toBe(blob)
  createUrlSpy.mockRestore()
})

it('reuses original blob when mime type cannot be inferred', () => {
  const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:inferred-url')
  const blob = createBlob(100, '')
  downloadFile(blob, 'image.png')
  const passedBlob = createUrlSpy.mock.calls[0][0] as Blob
  expect(passedBlob).toBe(blob)
  createUrlSpy.mockRestore()
})

it('creates a new blob with inferred mime type when it differs from original', () => {
  const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:typed-url')
  const blob = createBlob(100, '')
  downloadFile(blob, 'apdf')
  const passedBlob = createUrlSpy.mock.calls[0][0] as Blob
  expect(passedBlob.type).toBe('application/pdf')
  expect(passedBlob).not.toBe(blob)
  createUrlSpy.mockRestore()
})
