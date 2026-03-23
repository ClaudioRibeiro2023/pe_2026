import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { StrategicContext, StrategicPillar, StrategicTheme } from './types'

const STRATEGIC_CONTEXT_URL = '/data/strategic_context.json'

export async function fetchStrategicContext(): Promise<StrategicContext> {
  if (!isSupabaseConfigured()) {
    return fetchContextFromStore<StrategicContext>({
      slug: 'strategic',
      fallbackUrl: STRATEGIC_CONTEXT_URL,
      errorLabel: 'contexto estratégico',
    })
  }

  const [pillarsRes, subpillarsRes, themesRes, scenariosRes, legacyCtx] = await Promise.all([
    supabase.from('pillars').select('*').order('code'),
    supabase.from('subpillars').select('*').order('code'),
    supabase.from('strategic_themes').select('*').order('priority'),
    supabase.from('financial_scenarios').select('*').order('probability_pct'),
    fetchContextFromStore<StrategicContext>({
      slug: 'strategic',
      fallbackUrl: STRATEGIC_CONTEXT_URL,
      errorLabel: 'contexto estratégico',
    }),
  ])

  const pillarsData = pillarsRes.data ?? []
  const subpillarsData = subpillarsRes.data ?? []
  const themesData = themesRes.data ?? []
  const scenariosData = scenariosRes.data ?? []

  const pillars: StrategicPillar[] = pillarsData.map((p) => ({
    id: p.code,
    title: p.title,
    frontier: p.frontier ?? '',
    subpillars: subpillarsData
      .filter((sp) => sp.pillar_id === p.id)
      .map((sp) => ({ id: sp.code, title: sp.title, frontier: sp.frontier ?? '' })),
  }))

  const themes: StrategicTheme[] = themesData.map((t) => ({
    id: t.code,
    title: t.title,
    description: t.description ?? '',
    pillar: (t.pillar_codes ?? [])[0] ?? '',
  }))

  const base = scenariosData.find((s) => s.is_reference) ?? scenariosData.find((s) => s.code === 'BASE')
  const pessimista = scenariosData.find((s) => s.code === 'PESSIMISTA')
  const otimista = scenariosData.find((s) => s.code === 'OTIMISTA')

  return {
    ...legacyCtx,
    pillars,
    themes,
    metas2026: {
      ...legacyCtx.metas2026,
      cenarios: {
        pessimista: {
          probabilidade: pessimista?.probability_pct ?? 15,
          receita: pessimista?.revenue_target ?? 8310000,
          hectares: 0,
          variacao: 0,
          gatilho: '',
          techdengue: 0,
          aeroeng: 0,
        },
        base: {
          probabilidade: base?.probability_pct ?? 60,
          receita: base?.revenue_target ?? 11440000,
          hectares: 0,
          variacao: 0,
          gatilho: '',
          techdengue: 0,
          aeroeng: 0,
          oficial: true,
        },
        otimista: {
          probabilidade: otimista?.probability_pct ?? 25,
          receita: otimista?.revenue_target ?? 13290000,
          hectares: 0,
          variacao: 0,
          gatilho: '',
          techdengue: 0,
          aeroeng: 0,
        },
      },
    },
  } as StrategicContext
}
