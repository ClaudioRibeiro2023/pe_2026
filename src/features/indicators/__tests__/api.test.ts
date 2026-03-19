import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabaseClient to disable Supabase — forces mock data path
vi.mock('@/shared/lib/supabaseClient', () => ({
  supabase: {},
  isSupabaseConfigured: vi.fn(() => false),
}))

import { fetchIndicators, createIndicator, updateIndicator, deleteIndicator } from '../api'

describe('indicators API (mock mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchIndicators returns mock indicators array', async () => {
    const indicators = await fetchIndicators()
    expect(Array.isArray(indicators)).toBe(true)
    expect(indicators.length).toBeGreaterThanOrEqual(1)
    expect(indicators[0]).toHaveProperty('id')
    expect(indicators[0]).toHaveProperty('name')
    expect(indicators[0]).toHaveProperty('value')
  })

  it('createIndicator adds a new indicator and returns it', async () => {
    const before = await fetchIndicators()
    const countBefore = before.length

    const newIndicator = await createIndicator({
      name: 'Test Indicator',
      description: 'Unit test',
      value: 42,
      previous_value: 40,
      unit: '%',
      category: 'teste',
      trend: 'up',
      date: '2026-03-01',
    })

    expect(newIndicator.name).toBe('Test Indicator')
    expect(newIndicator.id).toBeTruthy()
    expect(newIndicator.user_id).toBe('demo-user')

    const after = await fetchIndicators()
    expect(after.length).toBe(countBefore + 1)
  })

  it('updateIndicator modifies an existing indicator', async () => {
    const indicators = await fetchIndicators()
    const target = indicators[0]

    const updated = await updateIndicator(target.id, { name: 'Updated Name' })
    expect(updated.name).toBe('Updated Name')
    expect(updated.id).toBe(target.id)
  })

  it('updateIndicator throws for non-existent id', async () => {
    await expect(updateIndicator('non-existent-id', { name: 'x' })).rejects.toThrow('não encontrado')
  })

  it('deleteIndicator removes an indicator without error', async () => {
    const indicators = await fetchIndicators()
    const countBefore = indicators.length
    const targetId = indicators[indicators.length - 1].id

    await deleteIndicator(targetId)

    const after = await fetchIndicators()
    expect(after.length).toBe(countBefore - 1)
  })

  it('deleteIndicator does not throw for non-existent id', async () => {
    await expect(deleteIndicator('non-existent')).resolves.toBeUndefined()
  })
})
