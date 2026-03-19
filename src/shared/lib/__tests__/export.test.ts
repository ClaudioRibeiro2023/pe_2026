import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportToExcel } from '../export'

describe('exportToExcel', () => {
  let anchorMock: { href: string; download: string; click: ReturnType<typeof vi.fn> }
  let capturedCsv: string

  const OrigBlob = globalThis.Blob

  beforeEach(() => {
    capturedCsv = ''
    anchorMock = { href: '', download: '', click: vi.fn() }

    vi.spyOn(document, 'createElement').mockReturnValue(anchorMock as any)

    // Subclass Blob to capture CSV content (jsdom Blob lacks .text())
    globalThis.Blob = class CaptureBlob extends OrigBlob {
      constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options)
        if (parts && parts.length > 0) {
          capturedCsv = String(parts[0])
        }
      }
    } as any

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
      revokeObjectURL: vi.fn(),
    })
  })

  afterEach(() => {
    globalThis.Blob = OrigBlob
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('creates a CSV blob and triggers download', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    const columns = [
      { header: 'Nome', dataKey: 'name' as const },
      { header: 'Idade', dataKey: 'age' as const },
    ]

    exportToExcel(data, columns, 'test-export')

    expect(anchorMock.click).toHaveBeenCalledOnce()
    expect(capturedCsv).toContain('Nome')
    expect(capturedCsv).toContain('Alice')
    expect(anchorMock.download).toContain('test-export')
  })

  it('uses semicolon as separator and includes BOM (pt-BR Excel)', () => {
    const data = [{ x: 'val1', y: 'val2' }]
    const columns = [
      { header: 'ColA', dataKey: 'x' as const },
      { header: 'ColB', dataKey: 'y' as const },
    ]

    exportToExcel(data, columns, 'test')

    expect(capturedCsv).toContain('\ufeff')
    expect(capturedCsv).toContain('ColA;ColB')
    expect(capturedCsv).toContain('val1;val2')
  })

  it('escapes cells with quotes and newlines', () => {
    const data = [{ desc: 'Line1\nLine2' }, { desc: 'Has "quotes"' }]
    const columns = [{ header: 'Desc', dataKey: 'desc' as const }]

    exportToExcel(data, columns, 'test')

    expect(capturedCsv).toContain('"Line1\nLine2"')
    expect(capturedCsv).toContain('"Has ""quotes"""')
  })

  it('handles null/undefined cell values', () => {
    const data = [{ a: null }, { a: undefined }]
    const columns = [{ header: 'A', dataKey: 'a' as const }]

    exportToExcel(data, columns, 'test')

    expect(capturedCsv).not.toContain('null')
    expect(capturedCsv).not.toContain('undefined')
  })
})
