import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
  formatRelativeTime,
} from '../format'

describe('formatCurrency', () => {
  it('formats positive BRL value', () => {
    const result = formatCurrency(1234.56)
    expect(result).toContain('1.234,56')
    expect(result).toContain('R$')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0,00')
  })

  it('formats negative values', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('500,00')
  })
})

describe('formatNumber', () => {
  it('formats integer with thousands separator', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('formats with specified decimals', () => {
    expect(formatNumber(1234.5, 2)).toBe('1.234,50')
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatPercent', () => {
  it('formats percentage from 0-100 scale', () => {
    const result = formatPercent(75)
    expect(result).toContain('75')
    expect(result).toContain('%')
  })

  it('formats zero percent', () => {
    const result = formatPercent(0)
    expect(result).toContain('0')
    expect(result).toContain('%')
  })

  it('formats 100 percent', () => {
    const result = formatPercent(100)
    expect(result).toContain('100')
    expect(result).toContain('%')
  })

  it('respects custom decimals', () => {
    const result = formatPercent(33.333, 2)
    expect(result).toContain('33,33')
  })
})

describe('formatDate', () => {
  it('formats Date object to Brazilian format', () => {
    const result = formatDate(new Date(2026, 0, 15)) // Jan 15, 2026
    expect(result).toBe('15/01/2026')
  })

  it('formats ISO string to Brazilian format', () => {
    const result = formatDate('2026-06-01T12:00:00Z')
    expect(result).toMatch(/01\/06\/2026/)
  })
})

describe('formatDateTime', () => {
  it('formats date with time', () => {
    const result = formatDateTime(new Date(2026, 0, 15, 14, 30))
    expect(result).toContain('15/01/2026')
    expect(result).toContain('14:30')
  })
})

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "agora" for recent timestamps', () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe('agora')
  })

  it('returns minutes ago', () => {
    vi.useFakeTimers()
    const base = new Date(2026, 0, 15, 12, 0, 0)
    vi.setSystemTime(base)

    const fiveMinAgo = new Date(2026, 0, 15, 11, 55, 0)
    expect(formatRelativeTime(fiveMinAgo)).toBe('5 minutos atrás')
  })

  it('returns hours ago', () => {
    vi.useFakeTimers()
    const base = new Date(2026, 0, 15, 15, 0, 0)
    vi.setSystemTime(base)

    const threeHoursAgo = new Date(2026, 0, 15, 12, 0, 0)
    expect(formatRelativeTime(threeHoursAgo)).toBe('3 horas atrás')
  })

  it('returns days ago', () => {
    vi.useFakeTimers()
    const base = new Date(2026, 0, 15, 12, 0, 0)
    vi.setSystemTime(base)

    const twoDaysAgo = new Date(2026, 0, 13, 12, 0, 0)
    expect(formatRelativeTime(twoDaysAgo)).toBe('2 dias atrás')
  })

  it('returns singular form for 1 unit', () => {
    vi.useFakeTimers()
    const base = new Date(2026, 0, 15, 12, 0, 0)
    vi.setSystemTime(base)

    const oneHourAgo = new Date(2026, 0, 15, 11, 0, 0)
    expect(formatRelativeTime(oneHourAgo)).toBe('1 hora atrás')
  })

  it('falls back to formatted date for > 7 days', () => {
    vi.useFakeTimers()
    const base = new Date(2026, 0, 20, 12, 0, 0)
    vi.setSystemTime(base)

    const tenDaysAgo = new Date(2026, 0, 10, 12, 0, 0)
    expect(formatRelativeTime(tenDaysAgo)).toBe('10/01/2026')
  })
})
