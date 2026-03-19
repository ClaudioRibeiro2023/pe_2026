import { describe, it, expect, vi } from 'vitest'
import { captureChartCanvas } from '../chartCapture'

describe('captureChartCanvas', () => {
  it('returns error when canvas is null', () => {
    const result = captureChartCanvas(null)
    expect(result.imageDataUrl).toBeNull()
    expect(result.error).toContain('not found')
  })

  it('returns imageDataUrl for a valid canvas', () => {
    const canvas = document.createElement('canvas')
    vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,abc123')

    const result = captureChartCanvas(canvas)
    expect(result.error).toBeNull()
    expect(result.imageDataUrl).toBe('data:image/png;base64,abc123')
  })

  it('returns error when toDataURL throws (e.g. tainted canvas)', () => {
    const canvas = document.createElement('canvas')
    vi.spyOn(canvas, 'toDataURL').mockImplementation(() => {
      throw new Error('Tainted canvas')
    })

    const result = captureChartCanvas(canvas)
    expect(result.imageDataUrl).toBeNull()
    expect(result.error).toContain('Tainted canvas')
  })

  it('returns error when toDataURL returns empty data', () => {
    const canvas = document.createElement('canvas')
    vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:,')

    const result = captureChartCanvas(canvas)
    expect(result.imageDataUrl).toBeNull()
    expect(result.error).toContain('empty image')
  })
})
