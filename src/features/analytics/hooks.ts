import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { ModuleStatus } from './types'

const MODULE_LABELS: Record<string, string> = {
  'strategy':     'Estratégia',
  'okrs':         'OKRs',
  'initiatives':  'Iniciativas',
  'scoreboard':   'Placar',
  'finance':      'Financeiro',
  'area-plans':   'Planos de Área',
  'action-plans': 'Planos de Ação',
  'goals':        'Metas',
  'indicators':   'Indicadores',
  'governance':   'Governança',
}

async function fetchCutoverStatus(): Promise<ModuleStatus[]> {
  if (!isSupabaseConfigured()) {
    return Object.keys(MODULE_LABELS).map((module) => ({
      module,
      enabled: true,
      source: 'demo',
      updated_at: null,
      label: MODULE_LABELS[module] ?? module,
    }))
  }

  const { data, error } = await supabase
    .from('feature_flags')
    .select('module, enabled, source, updated_at')
    .order('module')

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    module: row.module as string,
    enabled: Boolean(row.enabled),
    source: (row.source as string) ?? 'supabase',
    updated_at: row.updated_at as string | null,
    label: MODULE_LABELS[row.module as string] ?? (row.module as string),
  }))
}

export function useCutoverStatus() {
  return useQuery<ModuleStatus[]>({
    queryKey: ['analytics', 'cutover-status'],
    queryFn: fetchCutoverStatus,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  })
}
