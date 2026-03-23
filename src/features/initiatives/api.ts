import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { InitiativesContext, Initiative } from './types'

const INITIATIVES_CONTEXT_URL = '/data/initiatives_context.json'

export async function fetchInitiativesContext(): Promise<InitiativesContext> {
  if (!isSupabaseConfigured()) {
    return fetchContextFromStore<InitiativesContext>({
      slug: 'initiatives',
      fallbackUrl: INITIATIVES_CONTEXT_URL,
      errorLabel: 'iniciativas',
    })
  }

  const [initiativesRes, pillarsRes] = await Promise.all([
    supabase.from('initiatives').select('*').order('code'),
    supabase.from('pillars').select('id, code').order('code'),
  ])

  const rows = initiativesRes.data ?? []
  const pillars = pillarsRes.data ?? []
  const pillarById = Object.fromEntries(pillars.map((p) => [p.id, p.code]))

  const initiatives: Initiative[] = rows.map((r) => ({
    id: r.code ?? r.id,
    title: r.title,
    type: r.type as Initiative['type'],
    priority: r.priority as Initiative['priority'],
    pillar: pillarById[r.pillar_id] ?? '',
    okr: r.okr_code ?? '',
    kr: r.kr_code ?? '',
    owner: r.owner ?? '',
    sponsor: r.sponsor ?? '',
    status: r.status as Initiative['status'],
    startDate: r.start_date ?? '',
    endDate: r.end_date ?? '',
    effort: r.effort as Initiative['effort'],
    dependencies: [],
    evidences: [],
  }))

  return {
    metadata: {
      version: '2026-canonical',
      lastUpdate: new Date().toISOString(),
      source: 'supabase',
    },
    capacity: {
      wipInstitutionalLimit: 13,
      wipAreaLimit: 3,
      inProgressCount: initiatives.filter((i) => i.status === 'EM_ANDAMENTO').length,
      blockedCount: initiatives.filter((i) => i.status === 'BLOQUEADA').length,
      p0Count: initiatives.filter((i) => i.priority === 'P0').length,
    },
    prioritizationCriteria: [],
    evidenceRequirement: {
      mandatory: true,
      requiredArtifacts: [],
      validation: 'Direção Executiva',
    },
    initiatives,
  }
}
