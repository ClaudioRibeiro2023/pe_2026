import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabaseClient to disable Supabase — forces mock data path
vi.mock('@/shared/lib/supabaseClient', () => ({
  supabase: {},
  isSupabaseConfigured: vi.fn(() => false),
}))

import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../api'

describe('goals API (mock mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchGoals returns mock goals array', async () => {
    const goals = await fetchGoals()
    expect(Array.isArray(goals)).toBe(true)
    expect(goals.length).toBeGreaterThanOrEqual(1)
    expect(goals[0]).toHaveProperty('id')
    expect(goals[0]).toHaveProperty('title')
    expect(goals[0]).toHaveProperty('status')
  })

  it('createGoal adds a new goal and returns it', async () => {
    const before = await fetchGoals()
    const countBefore = before.length

    const newGoal = await createGoal({
      title: 'Test Goal',
      description: 'Teste unitário',
      target_value: 100,
      current_value: 0,
      unit: '%',
      category: 'teste',
      period: 'monthly',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      status: 'active',
    })

    expect(newGoal.title).toBe('Test Goal')
    expect(newGoal.id).toBeTruthy()
    expect(newGoal.user_id).toBe('demo-user')

    const after = await fetchGoals()
    expect(after.length).toBe(countBefore + 1)
  })

  it('updateGoal modifies an existing goal', async () => {
    const goals = await fetchGoals()
    const target = goals[0]

    const updated = await updateGoal(target.id, { title: 'Updated Title' })
    expect(updated.title).toBe('Updated Title')
    expect(updated.id).toBe(target.id)
  })

  it('updateGoal throws for non-existent id', async () => {
    await expect(updateGoal('non-existent-id', { title: 'x' })).rejects.toThrow('não encontrada')
  })

  it('deleteGoal removes a goal without error', async () => {
    const goals = await fetchGoals()
    const countBefore = goals.length
    const targetId = goals[goals.length - 1].id

    await deleteGoal(targetId)

    const after = await fetchGoals()
    expect(after.length).toBe(countBefore - 1)
  })

  it('deleteGoal does not throw for non-existent id', async () => {
    await expect(deleteGoal('non-existent')).resolves.toBeUndefined()
  })
})
