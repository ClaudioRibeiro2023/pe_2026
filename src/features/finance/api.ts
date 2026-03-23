import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { FinanceContext } from './types'

const FINANCE_CONTEXT_URL = '/data/finance_context.json'

export async function fetchFinanceContext(): Promise<FinanceContext> {
  if (!isSupabaseConfigured()) {
    return fetchContextFromStore<FinanceContext>({
      slug: 'finance',
      fallbackUrl: FINANCE_CONTEXT_URL,
      errorLabel: 'financeiro',
    })
  }

  const [scenariosRes, legacyCtx] = await Promise.all([
    supabase.from('financial_scenarios').select('*').order('probability_pct'),
    fetchContextFromStore<FinanceContext>({
      slug: 'finance',
      fallbackUrl: FINANCE_CONTEXT_URL,
      errorLabel: 'financeiro',
    }),
  ])

  const scenarios = scenariosRes.data ?? []

  const base = scenarios.find((s) => s.is_reference) ?? scenarios.find((s) => s.code === 'BASE')

  return {
    ...legacyCtx,
    budget: {
      ...legacyCtx.budget,
      status: base ? 'OK' : 'ATENCAO',
      notes: scenarios.map((s) => `${s.label}: R$${s.revenue_target?.toLocaleString('pt-BR')} (${s.probability_pct}%)`),
    },
  } as FinanceContext
}
