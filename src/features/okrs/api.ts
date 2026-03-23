import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { OkrsContext, CorporateOkr, KeyResult } from './types'

const OKRS_CONTEXT_URL = '/data/okrs_context.json'

export async function fetchOkrsContext(): Promise<OkrsContext> {
  if (!isSupabaseConfigured()) {
    return fetchContextFromStore<OkrsContext>({
      slug: 'okrs',
      fallbackUrl: OKRS_CONTEXT_URL,
      errorLabel: 'OKRs',
    })
  }

  const [okrsRes, krsRes, pillarsRes] = await Promise.all([
    supabase.from('corporate_okrs').select('*').order('code'),
    supabase.from('key_results').select('*').order('code'),
    supabase.from('pillars').select('id, code, title').order('code'),
  ])

  const okrs = okrsRes.data ?? []
  const krs = krsRes.data ?? []
  const pillars = pillarsRes.data ?? []

  const pillarById = Object.fromEntries(pillars.map((p) => [p.id, p]))

  const corporate: CorporateOkr[] = okrs.map((okr) => {
    const pillar = pillarById[okr.pillar_id]
    const okrKrs: KeyResult[] = krs
      .filter((kr) => kr.okr_id === okr.id)
      .map((kr) => ({
        id: kr.code,
        title: kr.title,
        target: kr.target ?? '',
        status: kr.status ?? 'EM_ANDAMENTO',
        evidence: [],
        kpis: [],
        initiatives: [],
      }))
    return {
      id: okr.code ?? okr.id,
      pillar: pillar?.code ?? '',
      objective: okr.objective,
      owner: okr.owner ?? '',
      priority: okr.priority ?? 'P1',
      krs: okrKrs,
    }
  })

  return {
    metadata: {
      version: '2026-canonical',
      lastUpdate: new Date().toISOString(),
      source: 'supabase',
    },
    corporate,
    areas: [],
  }
}
