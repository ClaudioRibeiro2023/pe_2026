import { describe, it, expect } from 'vitest'
import { indicatorSchema } from '../schemas'

const validIndicator = {
  name: 'Taxa de conversão',
  description: 'Percentual de leads convertidos',
  value: 42.5,
  unit: '%',
  category: 'Marketing',
  trend: 'up' as const,
  date: '2026-03-01',
}

describe('indicatorSchema', () => {
  it('validates a complete valid indicator', () => {
    const result = indicatorSchema.safeParse(validIndicator)
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 3 chars', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, name: 'ab' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('3 caracteres')
    }
  })

  it('rejects name longer than 100 chars', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, name: 'x'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('coerces string value to number', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, value: '99.5' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.value).toBe(99.5)
    }
  })

  it('rejects empty unit', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, unit: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty category', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, category: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty date', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, date: '' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid trends', () => {
    for (const trend of ['up', 'down', 'stable']) {
      const result = indicatorSchema.safeParse({ ...validIndicator, trend })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid trend', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, trend: 'sideways' })
    expect(result.success).toBe(false)
  })

  it('allows optional trend', () => {
    const { trend: _, ...noTrend } = validIndicator
    const result = indicatorSchema.safeParse(noTrend)
    expect(result.success).toBe(true)
  })

  it('allows optional description', () => {
    const { description: _, ...noDesc } = validIndicator
    const result = indicatorSchema.safeParse(noDesc)
    expect(result.success).toBe(true)
  })

  it('allows empty description', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, description: '' })
    expect(result.success).toBe(true)
  })

  it('allows optional previous_value', () => {
    const result = indicatorSchema.safeParse({ ...validIndicator, previous_value: 30 })
    expect(result.success).toBe(true)
  })
})
