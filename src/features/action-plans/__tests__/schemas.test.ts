import { describe, it, expect } from 'vitest'
import { actionPlanSchema, actionPlanBasicSchema, pdcaEntrySchema, milestoneSchema, taskSchema } from '../schemas'

const validPlan = {
  title: 'Plano de melhoria contínua',
  description: 'Descrição do plano',
  area_id: 'area-1',
  parent_plan_id: '',
  linked_kpis: [],
  linked_goals: [],
  status: 'draft' as const,
  priority: 'medium' as const,
  health: 'on_track' as const,
  pdca_phase: 'plan' as const,
  what: 'O que fazer',
  why: 'Por que fazer',
  where: 'Onde',
  when_start: '2026-01-01',
  when_end: '2026-06-30',
  who_responsible: 'João',
  who_team: [],
  how: 'Como fazer',
  how_much: 5000,
  risk_level: 'low' as const,
  risk_description: '',
  mitigation_plan: '',
  responsible: 'João',
  due_date: '2026-06-30',
}

describe('actionPlanSchema', () => {
  it('validates a complete plan', () => {
    const result = actionPlanSchema.safeParse(validPlan)
    expect(result.success).toBe(true)
  })

  it('rejects title shorter than 3 chars', () => {
    const result = actionPlanSchema.safeParse({ ...validPlan, title: 'ab' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = actionPlanSchema.safeParse({ ...validPlan, status: 'unknown' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid statuses', () => {
    for (const status of ['draft', 'planned', 'in_progress', 'blocked', 'completed', 'cancelled']) {
      expect(actionPlanSchema.safeParse({ ...validPlan, status }).success).toBe(true)
    }
  })

  it('accepts all valid priorities', () => {
    for (const priority of ['low', 'medium', 'high', 'critical']) {
      expect(actionPlanSchema.safeParse({ ...validPlan, priority }).success).toBe(true)
    }
  })

  it('accepts all valid health values', () => {
    for (const health of ['on_track', 'at_risk', 'off_track']) {
      expect(actionPlanSchema.safeParse({ ...validPlan, health }).success).toBe(true)
    }
  })

  it('accepts all PDCA phases', () => {
    for (const pdca_phase of ['plan', 'do', 'check', 'act']) {
      expect(actionPlanSchema.safeParse({ ...validPlan, pdca_phase }).success).toBe(true)
    }
  })

  it('defaults health to on_track', () => {
    const { health: _, ...noHealth } = validPlan
    const result = actionPlanSchema.safeParse(noHealth)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.health).toBe('on_track')
    }
  })

  it('defaults linked arrays to empty', () => {
    const { linked_kpis: _a, linked_goals: _b, ...noArrays } = validPlan
    const result = actionPlanSchema.safeParse(noArrays)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.linked_kpis).toEqual([])
      expect(result.data.linked_goals).toEqual([])
    }
  })
})

describe('actionPlanBasicSchema', () => {
  const validBasic = {
    title: 'Plano básico',
    status: 'draft' as const,
    priority: 'low' as const,
  }

  it('validates a basic plan', () => {
    expect(actionPlanBasicSchema.safeParse(validBasic).success).toBe(true)
  })

  it('rejects short title', () => {
    expect(actionPlanBasicSchema.safeParse({ ...validBasic, title: 'ab' }).success).toBe(false)
  })
})

describe('pdcaEntrySchema', () => {
  it('validates a valid entry', () => {
    const result = pdcaEntrySchema.safeParse({
      phase: 'do',
      description: 'Implementação da primeira etapa do projeto',
    })
    expect(result.success).toBe(true)
  })

  it('rejects description shorter than 10 chars', () => {
    const result = pdcaEntrySchema.safeParse({ phase: 'plan', description: 'curta' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid phase', () => {
    const result = pdcaEntrySchema.safeParse({ phase: 'review', description: 'long enough desc' })
    expect(result.success).toBe(false)
  })
})

describe('milestoneSchema', () => {
  it('validates a valid milestone', () => {
    const result = milestoneSchema.safeParse({ title: 'Marco Q1', due_date: '2026-03-31' })
    expect(result.success).toBe(true)
  })

  it('rejects short title', () => {
    expect(milestoneSchema.safeParse({ title: 'ab', due_date: '2026-03-31' }).success).toBe(false)
  })

  it('rejects empty due_date', () => {
    expect(milestoneSchema.safeParse({ title: 'Marco Q1', due_date: '' }).success).toBe(false)
  })
})

describe('taskSchema', () => {
  it('validates a valid task', () => {
    const result = taskSchema.safeParse({ title: 'Tarefa 1', status: 'todo' })
    expect(result.success).toBe(true)
  })

  it('accepts all task statuses', () => {
    for (const status of ['todo', 'doing', 'done']) {
      expect(taskSchema.safeParse({ title: 'Tarefa', status }).success).toBe(true)
    }
  })

  it('rejects short title', () => {
    expect(taskSchema.safeParse({ title: 'ab', status: 'todo' }).success).toBe(false)
  })
})
