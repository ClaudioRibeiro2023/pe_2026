import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabaseClient to disable Supabase — forces mock data path
vi.mock('@/shared/lib/supabaseClient', () => ({
  supabase: {},
  isSupabaseConfigured: vi.fn(() => false),
}))

import { fetchActionPlans, createActionPlan, updateActionPlan, deleteActionPlan, calculatePortfolioStats, fetchAreas } from '../api'
import type { ActionPlan } from '../types'

describe('action-plans API (mock mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchActionPlans returns mock plans array', async () => {
    const plans = await fetchActionPlans()
    expect(Array.isArray(plans)).toBe(true)
    expect(plans.length).toBeGreaterThanOrEqual(1)
    expect(plans[0]).toHaveProperty('id')
    expect(plans[0]).toHaveProperty('title')
    expect(plans[0]).toHaveProperty('status')
    expect(plans[0]).toHaveProperty('priority')
  })

  it('createActionPlan adds a new plan and returns it', async () => {
    const before = await fetchActionPlans()
    const countBefore = before.length

    const newPlan = await createActionPlan({
      title: 'Test Plan',
      description: 'Unit test plan',
      status: 'draft',
      priority: 'low',
    })

    expect(newPlan.title).toBe('Test Plan')
    expect(newPlan.id).toBeTruthy()
    expect(newPlan.status).toBe('draft')

    const after = await fetchActionPlans()
    expect(after.length).toBe(countBefore + 1)
  })

  it('createActionPlan uses defaults for missing fields', async () => {
    const plan = await createActionPlan({ title: 'Minimal Plan' })
    expect(plan.status).toBe('draft')
    expect(plan.priority).toBe('medium')
    expect(plan.health).toBe('on_track')
    expect(plan.progress).toBe(0)
  })

  it('updateActionPlan modifies an existing plan', async () => {
    const plans = await fetchActionPlans()
    const target = plans[0]

    const updated = await updateActionPlan(target.id, { title: 'Updated Title' })
    expect(updated.title).toBe('Updated Title')
    expect(updated.id).toBe(target.id)
  })

  it('updateActionPlan throws for non-existent id', async () => {
    await expect(updateActionPlan('non-existent-id', { title: 'x' })).rejects.toThrow('não encontrado')
  })

  it('deleteActionPlan removes a plan', async () => {
    const plans = await fetchActionPlans()
    const countBefore = plans.length
    const targetId = plans[plans.length - 1].id

    await deleteActionPlan(targetId)

    const after = await fetchActionPlans()
    expect(after.length).toBe(countBefore - 1)
  })

  it('deleteActionPlan does not throw for non-existent id', async () => {
    await expect(deleteActionPlan('non-existent')).resolves.toBeUndefined()
  })

  it('fetchAreas returns areas array', async () => {
    const areas = await fetchAreas()
    expect(Array.isArray(areas)).toBe(true)
    expect(areas.length).toBeGreaterThanOrEqual(1)
    expect(areas[0]).toHaveProperty('id')
    expect(areas[0]).toHaveProperty('name')
  })
})

describe('calculatePortfolioStats', () => {
  const mockPlans: ActionPlan[] = [
    {
      id: '1', title: 'Plan A', description: null,
      area_id: 'ti', area_name: 'TI', parent_plan_id: null,
      linked_kpis: [], linked_goals: [],
      status: 'in_progress', priority: 'high', health: 'on_track',
      pdca_phase: 'do', pdca_history: [],
      what: null, why: null, where: null,
      when_start: null, when_end: null,
      who_responsible: null, who_team: [], how: null, how_much: null,
      progress: 50, milestones: [], tasks: [],
      risk_level: 'medium', risk_description: null, mitigation_plan: null,
      owner_id: null, sponsor_id: null, responsible: null,
      due_date: '2026-12-31', completed_at: null,
      user_id: 'u1', created_at: '2026-01-01', updated_at: '2026-01-01',
    },
    {
      id: '2', title: 'Plan B', description: null,
      area_id: 'ti', area_name: 'TI', parent_plan_id: null,
      linked_kpis: [], linked_goals: [],
      status: 'completed', priority: 'low', health: 'on_track',
      pdca_phase: 'act', pdca_history: [],
      what: null, why: null, where: null,
      when_start: null, when_end: null,
      who_responsible: null, who_team: [], how: null, how_much: null,
      progress: 100, milestones: [], tasks: [],
      risk_level: 'low', risk_description: null, mitigation_plan: null,
      owner_id: null, sponsor_id: null, responsible: null,
      due_date: '2026-01-15', completed_at: '2026-01-15',
      user_id: 'u1', created_at: '2026-01-01', updated_at: '2026-01-15',
    },
    {
      id: '3', title: 'Plan C', description: null,
      area_id: 'rh', area_name: 'RH', parent_plan_id: null,
      linked_kpis: [], linked_goals: [],
      status: 'blocked', priority: 'critical', health: 'off_track',
      pdca_phase: 'check', pdca_history: [],
      what: null, why: null, where: null,
      when_start: null, when_end: null,
      who_responsible: null, who_team: [], how: null, how_much: null,
      progress: 20, milestones: [], tasks: [],
      risk_level: 'high', risk_description: null, mitigation_plan: null,
      owner_id: null, sponsor_id: null, responsible: null,
      due_date: '2020-01-01', completed_at: null,
      user_id: 'u1', created_at: '2026-01-01', updated_at: '2026-01-01',
    },
  ]

  it('returns correct total', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.total).toBe(3)
  })

  it('counts by status correctly', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.byStatus.in_progress).toBe(1)
    expect(stats.byStatus.completed).toBe(1)
    expect(stats.byStatus.blocked).toBe(1)
    expect(stats.byStatus.draft).toBe(0)
  })

  it('counts by health correctly', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.byHealth.on_track).toBe(2)
    expect(stats.byHealth.off_track).toBe(1)
  })

  it('counts by priority correctly', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.byPriority.high).toBe(1)
    expect(stats.byPriority.low).toBe(1)
    expect(stats.byPriority.critical).toBe(1)
  })

  it('groups by area correctly', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.byArea.length).toBe(2)
    const tiArea = stats.byArea.find(a => a.area_id === 'ti')
    expect(tiArea?.count).toBe(2)
  })

  it('calculates completion rate', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.completionRate).toBe(33) // 1 out of 3
  })

  it('calculates average progress', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.avgProgress).toBe(57) // (50+100+20)/3 = 56.67 → 57
  })

  it('detects overdue plans', () => {
    const stats = calculatePortfolioStats(mockPlans)
    expect(stats.overdue).toBeGreaterThanOrEqual(1) // Plan C due 2020
  })

  it('returns zeros for empty array', () => {
    const stats = calculatePortfolioStats([])
    expect(stats.total).toBe(0)
    expect(stats.completionRate).toBe(0)
    expect(stats.avgProgress).toBe(0)
    expect(stats.overdue).toBe(0)
  })
})
