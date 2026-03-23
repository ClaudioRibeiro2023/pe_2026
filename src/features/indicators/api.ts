import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { Indicator, IndicatorFormData } from './types'

const mockIndicators: Indicator[] = [
  {
    id: 'ind-guardrail-margem',
    name: 'Margem operacional ≥ 30%',
    description: 'Guardrail financeiro consolidado do PE2026',
    value: 30.4,
    previous_value: 29.8,
    unit: '%',
    category: 'Guardrails',
    trend: 'up',
    date: '2026-03-01',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ind-monetizacao-saldo',
    name: 'Saldo contratual remanescente',
    description: 'Saldo monetizável remanescente monitorado na Sala de Situação',
    value: 37911,
    previous_value: 42150,
    unit: 'ha',
    category: 'Monetização',
    trend: 'down',
    date: '2026-03-01',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ind-operacoes-sla',
    name: 'Qualidade e SLA',
    description: 'Aderência ao padrão mínimo de qualidade e SLA operacional',
    value: 91,
    previous_value: 89,
    unit: '%',
    category: 'Operação',
    trend: 'up',
    date: '2026-03-01',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ind-governanca-cadencias',
    name: 'Cadências WBR/MBR/QBR executadas',
    description: 'Aderência à rotina de governança e disciplina de gestão',
    value: 83,
    previous_value: 77,
    unit: '%',
    category: 'Governança',
    trend: 'up',
    date: '2026-03-01',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ind-produto-lastro',
    name: 'Painel de monetização com lastro',
    description: 'Conciliação dos dados críticos no painel executivo',
    value: 66,
    previous_value: 58,
    unit: '%',
    category: 'P&D / Produto / Dados',
    trend: 'up',
    date: '2026-03-01',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ind-pessoas-engajamento',
    name: 'Engajamento',
    description: 'Pulso de engajamento e saúde organizacional',
    value: 82,
    previous_value: 84,
    unit: '%',
    category: 'Pessoas',
    trend: 'down',
    date: '2026-03-01',
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
]

function resolveIndicatorsSource(action: string): 'supabase' | 'mock' {
  if (isSupabaseConfigured()) {
    return 'supabase'
  }

  console.warn(`[indicators] Supabase unavailable — using mock fallback for ${action}.`)
  return 'mock'
}

export async function fetchIndicators(): Promise<Indicator[]> {
  if (resolveIndicatorsSource('fetchIndicators') === 'mock') {
    return mockIndicators
  }

  try {
    const { data, error } = await supabase
      .from('indicators')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[indicators] Supabase request failed, falling back to DEV mock data.')
      return mockIndicators
    }

    throw error
  }
}

export async function createIndicator(indicator: IndicatorFormData): Promise<Indicator> {
  const createMockIndicator = (): Indicator => {
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

  if (resolveIndicatorsSource('createIndicator') === 'mock') {
    return createMockIndicator()
  }

  try {
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
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[indicators] Supabase request failed, using DEV mock create.')
      return createMockIndicator()
    }

    throw error
  }
}

export async function updateIndicator(id: string, indicator: Partial<IndicatorFormData>): Promise<Indicator> {
  const updateMockIndicator = (): Indicator => {
    const index = mockIndicators.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Indicador não encontrado')

    mockIndicators[index] = {
      ...mockIndicators[index],
      ...indicator,
      updated_at: new Date().toISOString(),
    }
    return mockIndicators[index]
  }

  if (resolveIndicatorsSource('updateIndicator') === 'mock') {
    return updateMockIndicator()
  }

  try {
    const { data, error } = await supabase
      .from('indicators')
      .update(indicator)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[indicators] Supabase request failed, using DEV mock update.')
      return updateMockIndicator()
    }

    throw error
  }
}

export async function deleteIndicator(id: string): Promise<void> {
  const deleteMockIndicator = () => {
    const index = mockIndicators.findIndex((i) => i.id === id)
    if (index !== -1) {
      mockIndicators.splice(index, 1)
    }
    return
  }

  if (resolveIndicatorsSource('deleteIndicator') === 'mock') {
    deleteMockIndicator()
    return
  }

  try {
    const { error } = await supabase
      .from('indicators')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[indicators] Supabase request failed, using DEV mock delete.')
      deleteMockIndicator()
      return
    }

    throw error
  }
}
