import { getSupabaseRuntimeState, supabase } from '@/shared/lib/supabaseClient'
import type { Area, CreateAreaData, UpdateAreaData } from './types'

const mockAreas: Area[] = [
  {
    id: 'area-rh',
    slug: 'rh',
    name: 'RH / Pessoas',
    owner: null,
    focus: 'Liderança, retenção, people analytics e capacidade intelectual',
    color: '#3B82F6',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-marketing',
    slug: 'marketing',
    name: 'Marketing',
    owner: null,
    focus: 'Marca, narrativa de evidência e suporte à expansão e renovação',
    color: '#10B981',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-pd',
    slug: 'pd',
    name: 'P&D / Produto / Dados',
    owner: 'Direção Executiva',
    focus: 'Evidência, produto e inteligência via Direção e consultorias',
    color: '#8B5CF6',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-operacoes',
    slug: 'operacoes',
    name: 'Operação',
    owner: null,
    focus: 'Capacidade, produtividade, qualidade e prontidão para execução',
    color: '#F59E0B',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-cs',
    slug: 'cs',
    name: 'CS / Relacionamento',
    owner: null,
    focus: 'Ativação de demanda e previsibilidade 30/60/90',
    color: '#06B6D4',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-com',
    slug: 'comercial',
    name: 'Comercial',
    owner: null,
    focus: 'Expansão e diversificação com tese',
    color: '#EC4899',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-fin',
    slug: 'financeiro',
    name: 'Financeiro',
    owner: null,
    focus: 'Previsibilidade, DRE gerencial por unidade, controles e guardrails',
    color: '#EF4444',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

function normalizeAreaSlug(value: string): string {
  const normalizedValue = value.trim().toLowerCase()

  const canonicalSlugMap: Record<string, string> = {
    rh: 'rh',
    'rh / pessoas': 'rh',
    marketing: 'marketing',
    mkt: 'marketing',
    pd: 'pd',
    'p&d': 'pd',
    'p&d / produto / dados': 'pd',
    operacao: 'operacoes',
    'operação': 'operacoes',
    operacoes: 'operacoes',
    'operações': 'operacoes',
    cs: 'cs',
    'cs / relacionamento': 'cs',
    comercial: 'comercial',
    financeiro: 'financeiro',
  }

  return canonicalSlugMap[normalizedValue] || normalizedValue.replace(/\s+/g, '-')
}

function resolveAreasSource(operation: string): 'mock' | 'supabase' {
  const state = getSupabaseRuntimeState()

  if (state.shouldUseSupabase) {
    return 'supabase'
  }

  if (state.canUseMockFallback) {
    console.info(`[Areas API] ${operation}: usando mock em ${state.environment}`)
    return 'mock'
  }

  const reason = state.isConfigured ? 'serviço inacessível' : 'variáveis de ambiente ausentes'
  throw new Error(`[Areas API] ${operation}: Supabase indisponível (${reason})`)
}

export async function fetchAreas(): Promise<Area[]> {
  if (resolveAreasSource('fetchAreas') === 'mock') {
    return mockAreas
  }

  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('name')

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return []
    }

    return data
  } catch (err) {
    if (getSupabaseRuntimeState().canUseMockFallback) {
      console.warn('[Areas API] Erro ao buscar áreas do Supabase, usando fallback de DEV:', err)
      return mockAreas
    }

    throw err
  }
}

export async function fetchAreaById(id: string): Promise<Area | null> {
  if (resolveAreasSource('fetchAreaById') === 'mock') {
    return mockAreas.find((a) => a.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data || null
  } catch (err) {
    if (getSupabaseRuntimeState().canUseMockFallback) {
      console.warn('[Areas API] Erro ao buscar área por ID, usando fallback de DEV:', err)
      return mockAreas.find((a) => a.id === id) || null
    }

    throw err
  }
}

export async function fetchAreaBySlug(slug: string): Promise<Area | null> {
  if (resolveAreasSource('fetchAreaBySlug') === 'mock') {
    return mockAreas.find((a) => a.slug === slug) || null
  }

  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data || null
  } catch (err) {
    if (getSupabaseRuntimeState().canUseMockFallback) {
      console.warn('[Areas API] Erro ao buscar área por slug, usando fallback de DEV:', err)
      return mockAreas.find((a) => a.slug === slug) || null
    }

    throw err
  }
}

export async function createArea(areaData: CreateAreaData): Promise<Area> {
  if (resolveAreasSource('createArea') === 'mock') {
    const newArea: Area = {
      id: `area-${Date.now()}`,
      slug: normalizeAreaSlug(areaData.slug || areaData.name),
      name: areaData.name,
      owner: areaData.owner || null,
      focus: areaData.focus || null,
      color: areaData.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockAreas.push(newArea)
    return newArea
  }

  const slug = normalizeAreaSlug(areaData.slug || areaData.name)

  const { data, error } = await supabase
    .from('areas')
    .insert({ ...areaData, slug })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateArea(id: string, areaData: UpdateAreaData): Promise<Area> {
  if (resolveAreasSource('updateArea') === 'mock') {
    const index = mockAreas.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Área não encontrada')
    mockAreas[index] = {
      ...mockAreas[index],
      ...areaData,
      updated_at: new Date().toISOString(),
    }
    return mockAreas[index]
  }

  const { data, error } = await supabase
    .from('areas')
    .update({ ...areaData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteArea(id: string): Promise<void> {
  if (resolveAreasSource('deleteArea') === 'mock') {
    const index = mockAreas.findIndex((a) => a.id === id)
    if (index !== -1) mockAreas.splice(index, 1)
    return
  }

  const { error } = await supabase
    .from('areas')
    .delete()
    .eq('id', id)

  if (error) throw error
}
