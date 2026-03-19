import { describe, it, expect } from 'vitest'
import { PDF_COLORS, PDF_LAYOUT } from '../types'

describe('PDF_COLORS', () => {
  it('has all required color keys', () => {
    const expected = [
      'primary', 'primaryLight', 'text', 'textMuted', 'textLight',
      'white', 'bgLight', 'border', 'success', 'danger', 'warning', 'info',
    ]
    for (const key of expected) {
      expect(PDF_COLORS).toHaveProperty(key)
    }
  })

  it('each color is an RGB tuple of 3 numbers', () => {
    for (const [, value] of Object.entries(PDF_COLORS)) {
      expect(Array.isArray(value)).toBe(true)
      expect(value).toHaveLength(3)
      for (const channel of value) {
        expect(typeof channel).toBe('number')
        expect(channel).toBeGreaterThanOrEqual(0)
        expect(channel).toBeLessThanOrEqual(255)
      }
    }
  })

  it('primary is blue-ish (high blue channel)', () => {
    expect(PDF_COLORS.primary[2]).toBeGreaterThan(100)
  })

  it('white is [255, 255, 255]', () => {
    expect(PDF_COLORS.white).toEqual([255, 255, 255])
  })
})

describe('PDF_LAYOUT', () => {
  it('has all required layout keys', () => {
    const expected = [
      'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
      'pageWidth', 'pageHeight', 'contentWidth',
      'headerHeight', 'footerHeight',
    ]
    for (const key of expected) {
      expect(PDF_LAYOUT).toHaveProperty(key)
    }
  })

  it('contentWidth equals pageWidth minus margins', () => {
    expect(PDF_LAYOUT.contentWidth).toBe(
      PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginLeft - PDF_LAYOUT.marginRight
    )
  })

  it('page dimensions are A4 (210x297mm)', () => {
    expect(PDF_LAYOUT.pageWidth).toBe(210)
    expect(PDF_LAYOUT.pageHeight).toBe(297)
  })

  it('all values are positive numbers', () => {
    for (const [, value] of Object.entries(PDF_LAYOUT)) {
      expect(typeof value).toBe('number')
      expect(value).toBeGreaterThan(0)
    }
  })
})
