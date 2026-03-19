import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { Indicator, IndicatorFormData } from './types'

const mockIndicators: Indicator[] = [
  {
    id: '1',
    name: 'NPS',
    description: 'Net Promoter Score',
    value: 85,
    previous_value: 78,
    unit: '%',
    category: 'satisfacao',
    trend: 'up',
    date: '2026-01-15',
    user_id: 'demo-user',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Ticket Médio',
    description: 'Valor médio por venda',
    value: 1250,
    previous_value: 1180,
    unit: 'R$',
    category: 'vendas',
    trend: 'up',
    date: '2026-01-15',
    user_id: 'demo-user',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Taxa de Conversão',
    description: 'Conversão de leads em clientes',
    value: 12.5,
    previous_value: 15.2,
    unit: '%',
    category: 'vendas',
    trend: 'down',
    date: '2026-01-15',
    user_id: 'demo-user',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
]

export async function fetchIndicators(): Promise<Indicator[]> {
  if (!isSupabaseConfigured()) {
    return mockIndicators
  }

  const { data, error } = await supabase
    .from('indicators')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createIndicator(indicator: IndicatorFormData): Promise<Indicator> {
  if (!isSupabaseConfigured()) {
    const newIndicator: Indicator = {
      id: String(Date.now()),
      ...indicator,
      description: indicator.description || null,
      previous_value: indicator.previous_value || null,
      trend: indicator.trend || null,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockIndicators.unshift(newIndicator)
    return newIndicator
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!userData.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('indicators')
    .insert([
      {
        ...indicator,
        description: indicator.description || null,
        previous_value: indicator.previous_value ?? null,
        trend: indicator.trend || null,
        user_id: userData.user.id,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateIndicator(id: string, indicator: Partial<IndicatorFormData>): Promise<Indicator> {
  if (!isSupabaseConfigured()) {
    const index = mockIndicators.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Indicador não encontrado')
    
    mockIndicators[index] = {
      ...mockIndicators[index],
      ...indicator,
      updated_at: new Date().toISOString(),
    }
    return mockIndicators[index]
  }

  const { data, error } = await supabase
    .from('indicators')
    .update(indicator)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteIndicator(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const index = mockIndicators.findIndex((i) => i.id === id)
    if (index !== -1) {
      mockIndicators.splice(index, 1)
    }
    return
  }

  const { error } = await supabase
    .from('indicators')
    .delete()
    .eq('id', id)

  if (error) throw error
}
