import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { Goal, GoalFormData } from './types'

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Receita Mensal',
    description: 'Meta de receita para o mês',
    target_value: 100000,
    current_value: 75000,
    unit: 'R$',
    category: 'vendas',
    period: 'monthly',
    start_date: '2026-01-01',
    end_date: '2026-01-31',
    status: 'active',
    user_id: 'demo-user',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Novos Clientes',
    description: 'Captação de novos clientes no trimestre',
    target_value: 50,
    current_value: 32,
    unit: 'clientes',
    category: 'vendas',
    period: 'quarterly',
    start_date: '2026-01-01',
    end_date: '2026-03-31',
    status: 'active',
    user_id: 'demo-user',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '3',
    title: 'Satisfação do Cliente',
    description: 'NPS acima de 80%',
    target_value: 80,
    current_value: 85,
    unit: '%',
    category: 'qualidade',
    period: 'monthly',
    start_date: '2026-01-01',
    end_date: '2026-01-31',
    status: 'completed',
    user_id: 'demo-user',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
]

export async function fetchGoals(): Promise<Goal[]> {
  if (!isSupabaseConfigured()) {
    return mockGoals
  }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createGoal(goal: GoalFormData): Promise<Goal> {
  if (!isSupabaseConfigured()) {
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
}

export async function updateGoal(id: string, goal: Partial<GoalFormData>): Promise<Goal> {
  if (!isSupabaseConfigured()) {
    const index = mockGoals.findIndex((g) => g.id === id)
    if (index === -1) throw new Error('Meta não encontrada')
    
    mockGoals[index] = {
      ...mockGoals[index],
      ...goal,
      updated_at: new Date().toISOString(),
    }
    return mockGoals[index]
  }

  const { data, error } = await supabase
    .from('goals')
    .update(goal)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGoal(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const index = mockGoals.findIndex((g) => g.id === id)
    if (index !== -1) {
      mockGoals.splice(index, 1)
    }
    return
  }

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)

  if (error) throw error
}
