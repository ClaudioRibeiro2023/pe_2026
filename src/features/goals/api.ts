import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { Goal, GoalFormData } from './types'

const mockGoals: Goal[] = [
  {
    id: 'goal-receita-base-2026',
    title: 'Receita cenário base 2026',
    description: 'Atingir a receita anual do cenário base aprovado no PE2026',
    target_value: 11440000,
    current_value: 4052693,
    unit: 'R$',
    category: 'financeiro',
    period: 'yearly',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'goal-q1-hectares-fixos',
    title: 'Entregar Q1 fixo de 50.438 ha',
    description: 'Garantir a execução do volume mínimo já contratado no primeiro trimestre',
    target_value: 50438,
    current_value: 28800,
    unit: 'ha',
    category: 'monetizacao',
    period: 'quarterly',
    start_date: '2026-01-01',
    end_date: '2026-03-31',
    status: 'active',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'goal-margem-operacional',
    title: 'Sustentar margem operacional ≥ 30%',
    description: 'Manter a margem anual dentro do guardrail principal do placar institucional',
    target_value: 30,
    current_value: 30.4,
    unit: '%',
    category: 'guardrail',
    period: 'yearly',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'goal-turnover-2026',
    title: 'Manter turnover anual ≤ 35%',
    description: 'Meta de saúde organizacional ligada ao OKR de pessoas e liderança',
    target_value: 35,
    current_value: 28,
    unit: '%',
    category: 'pessoas',
    period: 'yearly',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
]

function resolveGoalsSource(action: string): 'supabase' | 'mock' {
  if (isSupabaseConfigured()) {
    return 'supabase'
  }

  console.warn(`[goals] Supabase unavailable — using mock fallback for ${action}.`)
  return 'mock'
}

export async function fetchGoals(): Promise<Goal[]> {
  if (resolveGoalsSource('fetchGoals') === 'mock') {
    return mockGoals
  }

  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[goals] Supabase request failed, falling back to DEV mock data.')
      return mockGoals
    }

    throw error
  }
}

export async function createGoal(goal: GoalFormData): Promise<Goal> {
  const createMockGoal = (): Goal => {
    const newGoal: Goal = {
      id: String(Date.now()),
      ...goal,
      description: goal.description || null,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockGoals.unshift(newGoal)
    return newGoal
  }

  if (resolveGoalsSource('createGoal') === 'mock') {
    return createMockGoal()
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('goals')
      .insert([
        {
          ...goal,
          description: goal.description || null,
          user_id: userData.user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[goals] Supabase request failed, using DEV mock create.')
      return createMockGoal()
    }

    throw error
  }
}

export async function updateGoal(id: string, goal: Partial<GoalFormData>): Promise<Goal> {
  const updateMockGoal = (): Goal => {
    const index = mockGoals.findIndex((g) => g.id === id)
    if (index === -1) throw new Error('Meta não encontrada')

    mockGoals[index] = {
      ...mockGoals[index],
      ...goal,
      updated_at: new Date().toISOString(),
    }
    return mockGoals[index]
  }

  if (resolveGoalsSource('updateGoal') === 'mock') {
    return updateMockGoal()
  }

  try {
    const { data, error } = await supabase
      .from('goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[goals] Supabase request failed, using DEV mock update.')
      return updateMockGoal()
    }

    throw error
  }
}

export async function deleteGoal(id: string): Promise<void> {
  const deleteMockGoal = () => {
    const index = mockGoals.findIndex((g) => g.id === id)
    if (index !== -1) {
      mockGoals.splice(index, 1)
    }
    return
  }

  if (resolveGoalsSource('deleteGoal') === 'mock') {
    deleteMockGoal()
    return
  }

  try {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[goals] Supabase request failed, using DEV mock delete.')
      deleteMockGoal()
      return
    }

    throw error
  }
}
