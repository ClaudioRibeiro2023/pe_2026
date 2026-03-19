import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { Area, CreateAreaData, UpdateAreaData } from './types'

const mockAreas: Area[] = [
  {
    id: 'area-rh',
    slug: 'rh',
    name: 'RH',
    owner: 'Ana Paula',
    focus: 'Liderança, retenção e people analytics',
    color: '#3B82F6',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-mkt',
    slug: 'marketing',
    name: 'Marketing',
    owner: 'Carlos Silva',
    focus: 'Demanda qualificada e provas',
    color: '#10B981',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-ops',
    slug: 'operacoes',
    name: 'Operações',
    owner: 'Roberto Lima',
    focus: 'Eficiência operacional e automação',
    color: '#F59E0B',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-ti',
    slug: 'ti',
    name: 'Tecnologia da Informação',
    owner: 'Carlos Mendes',
    focus: 'Infraestrutura, segurança e inovação',
    color: '#8B5CF6',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area-fin',
    slug: 'financeiro',
    name: 'Financeiro',
    owner: 'Maria Santos',
    focus: 'Gestão financeira e compliance',
    color: '#EF4444',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

export async function fetchAreas(): Promise<Area[]> {
  if (!isSupabaseConfigured()) {
    console.info('[Areas API] Supabase não configurado, usando dados mock')
    return mockAreas
  }

  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('name')

    if (error) {
      console.warn('[Areas API] Erro ao buscar áreas do Supabase, usando fallback:', error.message)
      return mockAreas
    }

    // Se a tabela está vazia, retorna mock data para desenvolvimento
    if (!data || data.length === 0) {
      console.info('[Areas API] Tabela areas vazia, usando dados mock')
      return mockAreas
    }

    return data
  } catch (err) {
    console.error('[Areas API] Erro inesperado, usando fallback:', err)
    return mockAreas
  }
}

export async function fetchAreaById(id: string): Promise<Area | null> {
  if (!isSupabaseConfigured()) {
    return mockAreas.find((a) => a.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.warn('[Areas API] Erro ao buscar área por ID, usando fallback:', error.message)
      return mockAreas.find((a) => a.id === id) || null
    }
    
    return data || mockAreas.find((a) => a.id === id) || null
  } catch (err) {
    console.error('[Areas API] Erro inesperado em fetchAreaById:', err)
    return mockAreas.find((a) => a.id === id) || null
  }
}

export async function fetchAreaBySlug(slug: string): Promise<Area | null> {
  if (!isSupabaseConfigured()) {
    return mockAreas.find((a) => a.slug === slug) || null
  }

  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.warn('[Areas API] Erro ao buscar área por slug, usando fallback:', error.message)
      return mockAreas.find((a) => a.slug === slug) || null
    }
    
    return data || mockAreas.find((a) => a.slug === slug) || null
  } catch (err) {
    console.error('[Areas API] Erro inesperado em fetchAreaBySlug:', err)
    return mockAreas.find((a) => a.slug === slug) || null
  }
}

export async function createArea(areaData: CreateAreaData): Promise<Area> {
  if (!isSupabaseConfigured()) {
    const newArea: Area = {
      id: `area-${Date.now()}`,
      slug: areaData.slug || areaData.name.toLowerCase().replace(/\s+/g, '-'),
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

  const slug = areaData.slug || areaData.name.toLowerCase().replace(/\s+/g, '-')

  const { data, error } = await supabase
    .from('areas')
    .insert({ ...areaData, slug })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateArea(id: string, areaData: UpdateAreaData): Promise<Area> {
  if (!isSupabaseConfigured()) {
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
  if (!isSupabaseConfigured()) {
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
