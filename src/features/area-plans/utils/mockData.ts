/**
 * Mock Data Store para o Módulo de Planos de Ação
 * Hierarquia: PILARES → OKR → KR → PROGRAMA → INICIATIVAS → EVIDÊNCIAS → KPI
 */

import type {
  Area, Pillar, AreaOkr, Initiative, AreaPlan, PlanAction,
  ActionSubtask, ActionEvidence, ActionComment, ActionHistory, ActionRisk,
  KeyResult, CorporateOkr,
} from '../types'

// ============================================================
// UTILITIES
// ============================================================

let idCounter = 1000
export const generateId = (prefix = 'mock'): string => `${prefix}-${Date.now()}-${++idCounter}`
export const now = (): string => new Date().toISOString()

// ============================================================
// MOCK STORE (Estado reativo em memória)
// ============================================================

export const mockStore = {
  areas: [] as Area[],
  pillars: [] as Pillar[],
  keyResults: [] as KeyResult[],
  corporateOkrs: [] as CorporateOkr[],
  areaOkrs: [] as AreaOkr[],
  initiatives: [] as Initiative[],
  plans: [] as AreaPlan[],
  actions: [] as PlanAction[],
  subtasks: [] as ActionSubtask[],
  evidences: [] as ActionEvidence[],
  comments: [] as ActionComment[],
  history: [] as ActionHistory[],
  risks: [] as ActionRisk[],
}

// ============================================================
// ÁREAS (5 áreas)
// ============================================================

mockStore.areas = [
  { id: 'area-rh', slug: 'rh', name: 'RH', owner: 'Ana Paula Silva', focus: 'Liderança, retenção e people analytics', color: '#3B82F6', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-mkt', slug: 'marketing', name: 'Marketing', owner: 'Carlos Silva', focus: 'Demanda qualificada e brand awareness', color: '#10B981', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-ops', slug: 'operacoes', name: 'Operações', owner: 'Roberto Lima', focus: 'Eficiência operacional e automação', color: '#F59E0B', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-ti', slug: 'ti', name: 'Tecnologia da Informação', owner: 'Carlos Mendes', focus: 'Infraestrutura, segurança e inovação', color: '#8B5CF6', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-fin', slug: 'financeiro', name: 'Financeiro', owner: 'Maria Santos', focus: 'Gestão financeira e compliance', color: '#EF4444', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// PILARES INSTITUCIONAIS (5 pilares)
// ============================================================

mockStore.pillars = [
  { id: 'pillar-1', code: 'P1', title: 'Excelência Operacional', frontier: 'Processos otimizados e eficiência máxima', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-2', code: 'P2', title: 'Inovação e Tecnologia', frontier: 'Transformação digital e automação', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-3', code: 'P3', title: 'Pessoas e Cultura', frontier: 'Engajamento e desenvolvimento de talentos', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-4', code: 'P4', title: 'Crescimento Sustentável', frontier: 'Expansão com responsabilidade', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-5', code: 'P5', title: 'Cliente no Centro', frontier: 'Experiência e satisfação do cliente', created_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// KEY RESULTS (KRs)
// ============================================================

mockStore.keyResults = [
  { id: 'kr-1-1', okr_id: 'okr-1', code: 'KR1.1', title: 'Reduzir tempo de ciclo operacional', target: '-25%', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-1-2', okr_id: 'okr-1', code: 'KR1.2', title: 'Automatizar 80% dos processos repetitivos', target: '80%', status: 'EM_ANDAMENTO', due_date: '2026-09-30' },
  { id: 'kr-1-3', okr_id: 'okr-1', code: 'KR1.3', title: 'Reduzir custos operacionais', target: '-15%', status: 'NAO_INICIADO', due_date: '2026-12-31' },
  { id: 'kr-2-1', okr_id: 'okr-2', code: 'KR2.1', title: 'Implementar 3 novas tecnologias', target: '3', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-2-2', okr_id: 'okr-2', code: 'KR2.2', title: 'Migrar 100% para cloud', target: '100%', status: 'EM_ANDAMENTO', due_date: '2026-12-31' },
  { id: 'kr-3-1', okr_id: 'okr-3', code: 'KR3.1', title: 'Aumentar eNPS para 70+', target: '70', status: 'EM_ANDAMENTO', due_date: '2026-12-31' },
  { id: 'kr-3-2', okr_id: 'okr-3', code: 'KR3.2', title: 'Reduzir turnover voluntário', target: '-30%', status: 'ATENCAO', due_date: '2026-12-31' },
  { id: 'kr-3-3', okr_id: 'okr-3', code: 'KR3.3', title: '100% líderes com PDI ativo', target: '100%', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-4-1', okr_id: 'okr-4', code: 'KR4.1', title: 'Aumentar receita em 25%', target: '+25%', status: 'EM_ANDAMENTO', due_date: '2026-12-31' },
  { id: 'kr-4-2', okr_id: 'okr-4', code: 'KR4.2', title: 'Expandir para 2 novos mercados', target: '2', status: 'NAO_INICIADO', due_date: '2026-12-31' },
  { id: 'kr-5-1', okr_id: 'okr-5', code: 'KR5.1', title: 'NPS acima de 75', target: '75', status: 'EM_ANDAMENTO', due_date: '2026-12-31' },
  { id: 'kr-5-2', okr_id: 'okr-5', code: 'KR5.2', title: 'Tempo de resposta < 2h', target: '<2h', status: 'CONCLUIDO', due_date: '2026-03-31' },
]

// ============================================================
// OKRs CORPORATIVOS
// ============================================================

mockStore.corporateOkrs = [
  { id: 'okr-1', pillar_id: 'pillar-1', objective: 'Alcançar excelência operacional com processos otimizados', owner: 'Roberto Lima', priority: 'Crítica', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-2', pillar_id: 'pillar-2', objective: 'Liderar transformação digital e inovação tecnológica', owner: 'Carlos Mendes', priority: 'Alta', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-3', pillar_id: 'pillar-3', objective: 'Construir cultura de alto desempenho e engajamento', owner: 'Ana Paula Silva', priority: 'Crítica', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-4', pillar_id: 'pillar-4', objective: 'Acelerar crescimento sustentável e rentável', owner: 'Maria Santos', priority: 'Alta', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-5', pillar_id: 'pillar-5', objective: 'Entregar experiência excepcional ao cliente', owner: 'Carlos Silva', priority: 'Crítica', created_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// OKRs POR ÁREA
// ============================================================

mockStore.areaOkrs = [
  { id: 'area-okr-rh-1', area_id: 'area-rh', objective: 'Desenvolver pipeline de liderança', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-rh-2', area_id: 'area-rh', objective: 'Implementar people analytics', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-mkt-1', area_id: 'area-mkt', objective: 'Gerar demanda qualificada', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-mkt-2', area_id: 'area-mkt', objective: 'Fortalecer posicionamento de marca', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-ops-1', area_id: 'area-ops', objective: 'Otimizar cadeia de suprimentos', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-ops-2', area_id: 'area-ops', objective: 'Implementar lean manufacturing', status: 'ATENCAO' },
  { id: 'area-okr-ti-1', area_id: 'area-ti', objective: 'Modernizar infraestrutura', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-ti-2', area_id: 'area-ti', objective: 'Fortalecer segurança cibernética', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-fin-1', area_id: 'area-fin', objective: 'Otimizar gestão de capital', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-fin-2', area_id: 'area-fin', objective: 'Garantir compliance regulatório', status: 'CONCLUIDO' },
]

// ============================================================
// INICIATIVAS (Programas de execução)
// ============================================================

mockStore.initiatives = [
  { id: 'init-1', code: 'INI-001', title: 'Programa de Automação RPA', type: 'SIS', priority: 'P0', pillar_id: 'pillar-1', okr_code: 'OKR1', kr_code: 'KR1.2', owner: 'Roberto Lima', sponsor: 'CEO', status: 'EM_ANDAMENTO', start_date: '2026-01-15', end_date: '2026-06-30', effort: 'ALTO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'init-2', code: 'INI-002', title: 'Lean Six Sigma Deployment', type: 'MET', priority: 'P1', pillar_id: 'pillar-1', okr_code: 'OKR1', kr_code: 'KR1.1', owner: 'Roberto Lima', sponsor: 'COO', status: 'EM_ANDAMENTO', start_date: '2026-02-01', end_date: '2026-09-30', effort: 'MEDIO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'init-3', code: 'INI-003', title: 'Cloud Migration Program', type: 'SIS', priority: 'P0', pillar_id: 'pillar-2', okr_code: 'OKR2', kr_code: 'KR2.2', owner: 'Carlos Mendes', sponsor: 'CTO', status: 'EM_ANDAMENTO', start_date: '2026-01-01', end_date: '2026-12-31', effort: 'ALTO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-4', code: 'INI-004', title: 'Cybersecurity Enhancement', type: 'SIS', priority: 'P0', pillar_id: 'pillar-2', okr_code: 'OKR2', kr_code: 'KR2.1', owner: 'Carlos Mendes', sponsor: 'CTO', status: 'EM_ANDAMENTO', start_date: '2026-02-01', end_date: '2026-08-31', effort: 'ALTO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'init-5', code: 'INI-005', title: 'Leadership Development Program', type: 'ORG', priority: 'P0', pillar_id: 'pillar-3', okr_code: 'OKR3', kr_code: 'KR3.3', owner: 'Ana Paula Silva', sponsor: 'CEO', status: 'EM_ANDAMENTO', start_date: '2026-01-15', end_date: '2026-06-30', effort: 'MEDIO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'init-6', code: 'INI-006', title: 'Employee Experience Transformation', type: 'ORG', priority: 'P1', pillar_id: 'pillar-3', okr_code: 'OKR3', kr_code: 'KR3.1', owner: 'Ana Paula Silva', sponsor: 'CHRO', status: 'PLANEJADA', start_date: '2026-04-01', end_date: '2026-12-31', effort: 'ALTO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-7', code: 'INI-007', title: 'Digital Marketing Acceleration', type: 'MET', priority: 'P1', pillar_id: 'pillar-4', okr_code: 'OKR4', kr_code: 'KR4.1', owner: 'Carlos Silva', sponsor: 'CMO', status: 'EM_ANDAMENTO', start_date: '2026-01-01', end_date: '2026-12-31', effort: 'MEDIO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-8', code: 'INI-008', title: 'Brand Repositioning', type: 'COM', priority: 'P2', pillar_id: 'pillar-5', okr_code: 'OKR5', kr_code: 'KR5.1', owner: 'Carlos Silva', sponsor: 'CMO', status: 'PLANEJADA', start_date: '2026-03-01', end_date: '2026-09-30', effort: 'MEDIO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-9', code: 'INI-009', title: 'Financial Planning Automation', type: 'SIS', priority: 'P1', pillar_id: 'pillar-1', okr_code: 'OKR1', kr_code: 'KR1.3', owner: 'Maria Santos', sponsor: 'CFO', status: 'EM_ANDAMENTO', start_date: '2026-02-01', end_date: '2026-07-31', effort: 'MEDIO', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'init-10', code: 'INI-010', title: 'Compliance Management System', type: 'SIS', priority: 'P0', pillar_id: 'pillar-4', okr_code: 'OKR4', kr_code: 'KR4.2', owner: 'Maria Santos', sponsor: 'CFO', status: 'CONCLUIDA', start_date: '2025-10-01', end_date: '2026-01-31', effort: 'ALTO', created_at: '2025-10-01T00:00:00Z', updated_at: '2026-01-31T00:00:00Z' },
]

// ============================================================
// PLANOS DE AÇÃO (5 áreas × 2 planos = 10 planos)
// ============================================================

mockStore.plans = [
  { id: 'plan-rh-2026', area_id: 'area-rh', year: 2026, title: 'Plano de Ação RH 2026', description: 'Plano estratégico focado em lideranças e people analytics', status: 'ATIVO', template_id: null, pack_id: 'pack-rh-2026', created_by: 'user-1', manager_approved_by: 'manager-1', manager_approved_at: '2026-01-10T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-15T00:00:00Z', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'plan-rh-2025', area_id: 'area-rh', year: 2025, title: 'Plano de Ação RH 2025', description: 'Plano do ano anterior - concluído', status: 'CONCLUIDO', template_id: null, pack_id: null, created_by: 'user-1', manager_approved_by: 'manager-1', manager_approved_at: '2025-01-10T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2025-01-15T00:00:00Z', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z' },
  { id: 'plan-mkt-2026', area_id: 'area-mkt', year: 2026, title: 'Plano de Ação Marketing 2026', description: 'Estratégia de marketing digital e brand awareness', status: 'ATIVO', template_id: null, pack_id: 'pack-mkt-2026', created_by: 'user-2', manager_approved_by: 'manager-2', manager_approved_at: '2026-01-12T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-18T00:00:00Z', created_at: '2026-01-05T00:00:00Z', updated_at: '2026-01-18T00:00:00Z' },
  { id: 'plan-mkt-2025', area_id: 'area-mkt', year: 2025, title: 'Plano de Ação Marketing 2025', description: 'Plano do ano anterior', status: 'CONCLUIDO', template_id: null, pack_id: null, created_by: 'user-2', manager_approved_by: 'manager-2', manager_approved_at: '2025-01-10T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2025-01-15T00:00:00Z', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z' },
  { id: 'plan-ops-2026', area_id: 'area-ops', year: 2026, title: 'Plano de Ação Operações 2026', description: 'Foco em automação e eficiência operacional', status: 'ATIVO', template_id: null, pack_id: 'pack-ops-2026', created_by: 'user-3', manager_approved_by: 'manager-3', manager_approved_at: '2026-01-08T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-12T00:00:00Z', created_at: '2026-01-02T00:00:00Z', updated_at: '2026-01-12T00:00:00Z' },
  { id: 'plan-ops-2025', area_id: 'area-ops', year: 2025, title: 'Plano de Ação Operações 2025', description: 'Plano do ano anterior', status: 'CONCLUIDO', template_id: null, pack_id: null, created_by: 'user-3', manager_approved_by: 'manager-3', manager_approved_at: '2025-01-10T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2025-01-15T00:00:00Z', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z' },
  { id: 'plan-ti-2026', area_id: 'area-ti', year: 2026, title: 'Plano de Ação TI 2026', description: 'Modernização de infraestrutura e segurança', status: 'ATIVO', template_id: null, pack_id: null, created_by: 'user-4', manager_approved_by: 'manager-4', manager_approved_at: '2026-01-09T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-14T00:00:00Z', created_at: '2026-01-03T00:00:00Z', updated_at: '2026-01-14T00:00:00Z' },
  { id: 'plan-ti-2025', area_id: 'area-ti', year: 2025, title: 'Plano de Ação TI 2025', description: 'Plano do ano anterior', status: 'CONCLUIDO', template_id: null, pack_id: null, created_by: 'user-4', manager_approved_by: 'manager-4', manager_approved_at: '2025-01-10T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2025-01-15T00:00:00Z', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z' },
  { id: 'plan-fin-2026', area_id: 'area-fin', year: 2026, title: 'Plano de Ação Financeiro 2026', description: 'Gestão financeira e compliance', status: 'EM_APROVACAO', template_id: null, pack_id: 'pack-fin-2026', created_by: 'user-5', manager_approved_by: 'manager-5', manager_approved_at: '2026-01-20T00:00:00Z', direction_approved_by: null, direction_approved_at: null, created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-20T00:00:00Z' },
  { id: 'plan-fin-2025', area_id: 'area-fin', year: 2025, title: 'Plano de Ação Financeiro 2025', description: 'Plano do ano anterior', status: 'CONCLUIDO', template_id: null, pack_id: null, created_by: 'user-5', manager_approved_by: 'manager-5', manager_approved_at: '2025-01-10T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2025-01-15T00:00:00Z', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z' },
]

// Expose mockStore on window for platform diagnostics (dev/preview only)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__mockStoreDebug = mockStore
}

// Export aliases for backward compatibility
export const mockAreas = mockStore.areas
export const mockPillars = mockStore.pillars
export const mockKeyResults = mockStore.keyResults
export const mockCorporateOkrs = mockStore.corporateOkrs
export const mockAreaOkrs = mockStore.areaOkrs
export const mockInitiatives = mockStore.initiatives
export const mockPlans = mockStore.plans
