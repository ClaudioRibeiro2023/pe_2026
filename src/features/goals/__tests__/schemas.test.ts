import { describe, it, expect } from 'vitest'
import { goalSchema } from '../schemas'

const validGoal = {
  title: 'Meta de vendas Q1',
  description: 'Aumentar vendas em 20%',
  target_value: 100,
  current_value: 50,
  unit: '%',
  category: 'Vendas',
  period: 'quarterly' as const,
  start_date: '2026-01-01',
  end_date: '2026-03-31',
  status: 'active' as const,
}

describe('goalSchema', () => {
  it('validates a complete valid goal', () => {
    const result = goalSchema.safeParse(validGoal)
    expect(result.success).toBe(true)
  })

  it('rejects title shorter than 3 chars', () => {
    const result = goalSchema.safeParse({ ...validGoal, title: 'ab' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('3 caracteres')
    }
  })

  it('rejects title longer than 100 chars', () => {
    const result = goalSchema.safeParse({ ...validGoal, title: 'x'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects negative target_value', () => {
    const result = goalSchema.safeParse({ ...validGoal, target_value: -1 })
    expect(result.success).toBe(false)
  })

  it('rejects negative current_value', () => {
    const result = goalSchema.safeParse({ ...validGoal, current_value: -5 })
    expect(result.success).toBe(false)
  })

  it('coerces string numbers to number', () => {
    const result = goalSchema.safeParse({ ...validGoal, target_value: '42', current_value: '10' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.target_value).toBe(42)
      expect(result.data.current_value).toBe(10)
    }
  })

  it('rejects empty unit', () => {
    const result = goalSchema.safeParse({ ...validGoal, unit: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty category', () => {
    const result = goalSchema.safeParse({ ...validGoal, category: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid period', () => {
    const result = goalSchema.safeParse({ ...validGoal, period: 'biweekly' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid periods', () => {
    for (const period of ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']) {
      const result = goalSchema.safeParse({ ...validGoal, period })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid status', () => {
    const result = goalSchema.safeParse({ ...validGoal, status: 'archived' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid statuses', () => {
    for (const status of ['active', 'paused', 'completed', 'cancelled']) {
      const result = goalSchema.safeParse({ ...validGoal, status })
      expect(result.success).toBe(true)
    }
  })

  it('allows empty description', () => {
    const result = goalSchema.safeParse({ ...validGoal, description: '' })
    expect(result.success).toBe(true)
  })

  it('allows undefined description', () => {
    const { description: _, ...noDesc } = validGoal
    const result = goalSchema.safeParse(noDesc)
    expect(result.success).toBe(true)
  })

  it('rejects empty start_date', () => {
    const result = goalSchema.safeParse({ ...validGoal, start_date: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty end_date', () => {
    const result = goalSchema.safeParse({ ...validGoal, end_date: '' })
    expect(result.success).toBe(false)
  })
})
