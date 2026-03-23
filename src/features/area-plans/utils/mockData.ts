/**
 * Mock Data Store para o Módulo de Planos de Ação
 * Hierarquia: PILARES → OKR → KR → PROGRAMA → INICIATIVAS → EVIDÊNCIAS → KPI
 */

import type {
  Area, Pillar, Subpillar, AreaOkr, Initiative, AreaPlan, PlanAction,
  ActionSubtask, ActionEvidence, ActionComment, ActionHistory, ActionRisk,
  KeyResult, CorporateOkr, Motor, StrategicTheme, StrategicRisk, FinancialScenario,
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
  subpillars: [] as Subpillar[],
  keyResults: [] as KeyResult[],
  corporateOkrs: [] as CorporateOkr[],
  areaOkrs: [] as AreaOkr[],
  initiatives: [] as Initiative[],
  motors: [] as Motor[],
  strategicThemes: [] as StrategicTheme[],
  strategicRisks: [] as StrategicRisk[],
  financialScenarios: [] as FinancialScenario[],
  plans: [] as AreaPlan[],
  actions: [] as PlanAction[],
  subtasks: [] as ActionSubtask[],
  evidences: [] as ActionEvidence[],
  comments: [] as ActionComment[],
  history: [] as ActionHistory[],
  risks: [] as ActionRisk[],
}

// ============================================================
// ÁREAS (7 áreas)
// ============================================================

mockStore.areas = [
  { id: 'area-rh', slug: 'rh', name: 'RH / Pessoas', owner: null, focus: 'Liderança, retenção, people analytics e capacidade intelectual', color: '#3B82F6', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-marketing', slug: 'marketing', name: 'Marketing', owner: null, focus: 'Marca, narrativa de evidência e suporte à expansão e renovação', color: '#10B981', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-pd', slug: 'pd', name: 'P&D / Produto / Dados', owner: 'Direção Executiva', focus: 'Evidência, produto e inteligência via Direção e consultorias', color: '#8B5CF6', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-operacoes', slug: 'operacoes', name: 'Operação', owner: null, focus: 'Capacidade, produtividade, qualidade e prontidão para execução', color: '#F59E0B', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-cs', slug: 'cs', name: 'CS / Relacionamento', owner: null, focus: 'Ativação de demanda e previsibilidade 30/60/90', color: '#06B6D4', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-com', slug: 'comercial', name: 'Comercial', owner: null, focus: 'Expansão e diversificação com tese', color: '#EC4899', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-fin', slug: 'financeiro', name: 'Financeiro', owner: null, focus: 'Previsibilidade, DRE gerencial por unidade, controles e guardrails', color: '#EF4444', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// PILARES INSTITUCIONAIS (5 pilares)
// ============================================================

mockStore.pillars = [
  { id: 'pillar-1', code: 'P1', title: 'Estrutura Corporativa, Governança e Preparação para Transação', frontier: 'Organização gerenciável, auditável e pronta para separação Aero × Techdengue', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-2', code: 'P2', title: 'Crescimento, Expansão e Diversificação', frontier: 'Expandir com tese, reduzir concentração e monetizar a base contratual', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-3', code: 'P3', title: 'Excelência Operacional e Escala com Margem', frontier: 'Executar com qualidade, produtividade e previsibilidade', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-4', code: 'P4', title: 'Produto, Dados e IA como Vantagem Defensável', frontier: 'Transformar tecnologia em vantagem competitiva duradoura', created_at: '2026-01-01T00:00:00Z' },
  { id: 'pillar-5', code: 'P5', title: 'Pessoas, Liderança e Capacidade Intelectual', frontier: 'Capacidade de sustentar crescimento com método e densidade intelectual', created_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// KEY RESULTS (KRs)
// ============================================================

mockStore.keyResults = [
  { id: 'kr-1-1', okr_id: 'okr-1', code: 'P1.1', title: 'Apuração gerencial por unidade implantada', target: 'Fechamento mensal até dia 10', status: 'EM_ANDAMENTO', due_date: '2026-12-31' },
  { id: 'kr-1-2', okr_id: 'okr-1', code: 'P1.2', title: 'Centros de custo e alçadas formalizados', target: 'DEC-* ativo', status: 'EM_ANDAMENTO', due_date: '2026-03-31' },
  { id: 'kr-1-3', okr_id: 'okr-1', code: 'P1.3', title: 'Registro de riscos (RSK-*) ativo', target: '100% dos riscos críticos com dono', status: 'EM_ANDAMENTO', due_date: '2026-03-31' },
  { id: 'kr-1-4', okr_id: 'okr-1', code: 'P1.4', title: 'Trilha de evidências (EVID-*) operante', target: '100% dos KRs com evidência por trimestre', status: 'NAO_INICIADO', due_date: '2026-12-31' },
  { id: 'kr-1-5', okr_id: 'okr-1', code: 'P1.5', title: 'Modelo de separação por fases definido', target: 'v1.0 formalizada', status: 'NAO_INICIADO', due_date: '2026-04-30' },
  { id: 'kr-2-1', okr_id: 'okr-2', code: 'P2.1', title: 'Executar mínimo 50.438 ha no Q1', target: '50.438 ha', status: 'EM_ANDAMENTO', due_date: '2026-03-31' },
  { id: 'kr-2-2', okr_id: 'okr-2', code: 'P2.2', title: 'Reduzir saldo para ≤ 37.911 ha', target: '≤ 37.911 ha', status: 'EM_ANDAMENTO', due_date: '2026-03-31' },
  { id: 'kr-2-3', okr_id: 'okr-2', code: 'P2.3', title: 'Sala de Situação operante semanalmente', target: '100% do Pareto Top-14 com plano', status: 'EM_ANDAMENTO', due_date: '2026-02-28' },
  { id: 'kr-2-4', okr_id: 'okr-2', code: 'P2.4', title: 'Reduzir Baixa Execução para ≤ 25%', target: '≤ 25%', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-2-5', okr_id: 'okr-2', code: 'P2.5', title: 'Ativação Pareto Top-14 ≥ 70%', target: '≥ 70%', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-3-1', okr_id: 'okr-3', code: 'P3.1', title: 'Margem operacional anual ≥ 30%', target: '≥ 30%', status: 'EM_ANDAMENTO', due_date: '2026-12-31' },
  { id: 'kr-3-2', okr_id: 'okr-3', code: 'P3.2', title: 'Planejamento semanal de capacidade Q1 implantado', target: 'Semanas registradas', status: 'EM_ANDAMENTO', due_date: '2026-03-31' },
  { id: 'kr-3-3', okr_id: 'okr-3', code: 'P3.3', title: 'Reduzir retrabalho em 20%', target: '-20%', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-3-4', okr_id: 'okr-3', code: 'P3.4', title: 'Padrão mínimo de qualidade/SLA ≥ 90%', target: '≥ 90%', status: 'NAO_INICIADO', due_date: '2026-12-31' },
  { id: 'kr-3-5', okr_id: 'okr-3', code: 'P3.5', title: 'Integração Operação ↔ CS ↔ Dados definida', target: 'Pontos de passagem definidos', status: 'NAO_INICIADO', due_date: '2026-04-30' },
  { id: 'kr-4-1', okr_id: 'okr-4', code: 'P4.1', title: 'Pacote de evidências Top-14 mensal', target: 'Prova de valor ≥ 70%', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-4-2', okr_id: 'okr-4', code: 'P4.2', title: 'Relatório executivo de prova de valor publicado', target: 'v1.0 publicada', status: 'EM_ANDAMENTO', due_date: '2026-03-31' },
  { id: 'kr-4-3', okr_id: 'okr-4', code: 'P4.3', title: 'Painel de gestão da monetização implantado', target: 'Saldo, vazão e 30/60/90 ativos', status: 'EM_ANDAMENTO', due_date: '2026-04-30' },
  { id: 'kr-4-4', okr_id: 'okr-4', code: 'P4.4', title: 'Baseline de uso de produto com melhoria ≥ 15%', target: '≥ 15%', status: 'NAO_INICIADO', due_date: '2026-12-31' },
  { id: 'kr-4-5', okr_id: 'okr-4', code: 'P4.5', title: 'Duas frentes de automação/IA com ganho mensurável', target: '2 frentes', status: 'NAO_INICIADO', due_date: '2026-09-30' },
  { id: 'kr-5-1', okr_id: 'okr-5', code: 'P5.1', title: 'Turnover anual ≤ 35%', target: '≤ 35%', status: 'EM_ANDAMENTO', due_date: '2026-12-31' },
  { id: 'kr-5-2', okr_id: 'okr-5', code: 'P5.2', title: 'Engajamento ≥ 85%', target: '≥ 85%', status: 'NAO_INICIADO', due_date: '2026-12-31' },
  { id: 'kr-5-3', okr_id: 'okr-5', code: 'P5.3', title: 'Rituais mínimos de liderança ≥ 85%', target: '≥ 85%', status: 'NAO_INICIADO', due_date: '2026-06-30' },
  { id: 'kr-5-4', okr_id: 'okr-5', code: 'P5.4', title: 'Posições-chave ≥ 80% preenchidas', target: '≥ 80%', status: 'EM_ANDAMENTO', due_date: '2026-06-30' },
  { id: 'kr-5-5', okr_id: 'okr-5', code: 'P5.5', title: 'Onboarding estruturado e mensurável', target: 'Processo padrão implantado', status: 'NAO_INICIADO', due_date: '2026-04-30' },
]

// ============================================================
// OKRs CORPORATIVOS
// ============================================================

mockStore.corporateOkrs = [
  { id: 'okr-1', pillar_id: 'pillar-1', code: 'OKR-P1', objective: 'Governança, Separação Aero × Techdengue e Padrão de Empresa Auditável', owner: 'Direção Executiva', priority: 'Crítica', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-2', pillar_id: 'pillar-2', code: 'OKR-P2', objective: 'Crescimento com Tese e Monetização da Base Contratual', owner: 'Direção Executiva + CS', priority: 'Crítica', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-3', pillar_id: 'pillar-3', code: 'OKR-P3', objective: 'Escala Operacional com Margem, Qualidade e Prontidão', owner: 'Operação + Direção', priority: 'Crítica', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-4', pillar_id: 'pillar-4', code: 'OKR-P4', objective: 'Produto, Dados e IA como Vantagem Defensável', owner: 'Direção Executiva', priority: 'Alta', created_at: '2026-01-01T00:00:00Z' },
  { id: 'okr-5', pillar_id: 'pillar-5', code: 'OKR-P5', objective: 'Densidade Intelectual, Liderança e Capacidade Humana', owner: 'RH + Direção', priority: 'Crítica', created_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// OKRs POR ÁREA
// ============================================================

 mockStore.areaOkrs = [
  { id: 'area-okr-rh-1', area_id: 'area-rh', objective: 'Estruturar mapa de posições-chave e rituais mínimos de liderança', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-rh-2', area_id: 'area-rh', objective: 'Reduzir turnover e estruturar onboarding mensurável', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-marketing-1', area_id: 'area-marketing', objective: 'Fortalecer narrativa de evidência e prova de valor', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-marketing-2', area_id: 'area-marketing', objective: 'Apoiar expansão e diversificação com tese', status: 'NAO_INICIADO' },
  { id: 'area-okr-pd-1', area_id: 'area-pd', objective: 'Estruturar produto, dados e IA como vantagem defensável', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-operacoes-1', area_id: 'area-operacoes', objective: 'Escalar operação com margem, qualidade e prontidão', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-operacoes-2', area_id: 'area-operacoes', objective: 'Planejar capacidade e reduzir retrabalho', status: 'ATENCAO' },
  { id: 'area-okr-cs-1', area_id: 'area-cs', objective: 'Ativar demanda e previsão 30/60/90 com disciplina', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-cs-2', area_id: 'area-cs', objective: 'Operar Pareto Top-14 e monetização da base contratual', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-com-1', area_id: 'area-com', objective: 'Estruturar área comercial e pipeline com tese', status: 'NAO_INICIADO' },
  { id: 'area-okr-fin-1', area_id: 'area-fin', objective: 'Implantar apuração gerencial por unidade', status: 'EM_ANDAMENTO' },
  { id: 'area-okr-fin-2', area_id: 'area-fin', objective: 'Operar guardrails de margem e caixa com previsibilidade', status: 'EM_ANDAMENTO' },
]

// ============================================================
// MOTORES ESTRATÉGICOS (DOC 08 v2)
// ============================================================

mockStore.motors = [
  { id: 'motor-m1', code: 'M1', title: 'Motor de Monetização',  description: 'Ativar e reduzir saldo, Pareto Top-14, previsão 30/60/90',        pillar_code: 'P2', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'motor-m2', code: 'M2', title: 'Motor de Governança',   description: 'Separação Aero×TD, registros formais, controles auditáveis',        pillar_code: 'P1', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'motor-m3', code: 'M3', title: 'Motor de Escala',       description: 'Capacidade planejada, qualidade, SLA, margem ≥ 30%',                pillar_code: 'P3', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'motor-m4', code: 'M4', title: 'Motor de Produto/IA',   description: 'Produto, dados, automação e prova de valor defensável',              pillar_code: 'P4', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'motor-m5', code: 'M5', title: 'Motor de Pessoas',      description: 'Retenção, liderança, onboarding e densidade intelectual',           pillar_code: 'P5', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// INICIATIVAS CORPORATIVAS (DOC 08 v2 — 22 INITs)
//   P0 (13): INIT-001 a INIT-013 — críticas 90 dias
//   P1  (9): INIT-014 a INIT-022 — estratégicas do ano
// ============================================================

mockStore.initiatives = [
  // P0 — Críticas 90 dias
  { id: 'init-001', code: 'INIT-001', title: 'Apuração gerencial por unidade e estrutura de centros de custo',          type: 'SIS', priority: 'P0', pillar_id: 'pillar-1', okr_code: 'OKR-P1', kr_code: 'P1.1', owner: 'Financeiro',            sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-15', end_date: '2026-04-30', effort: 'ALTO',  motor_id: 'motor-m2', motor_codes: ['M2'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'init-002', code: 'INIT-002', title: 'Formalização de alçadas, decisões e registro de riscos',                  type: 'MET', priority: 'P0', pillar_id: 'pillar-1', okr_code: 'OKR-P1', kr_code: 'P1.3', owner: 'Direção Executiva',    sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-10', end_date: '2026-03-31', effort: 'MEDIO', motor_id: 'motor-m2', motor_codes: ['M2'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-10T00:00:00Z' },
  { id: 'init-003', code: 'INIT-003', title: 'Sala de Situação e gestão semanal do Pareto Top-14',                     type: 'MET', priority: 'P0', pillar_id: 'pillar-2', okr_code: 'OKR-P2', kr_code: 'P2.3', owner: 'CS / Relacionamento',  sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-01', end_date: '2026-03-31', effort: 'ALTO',  motor_id: 'motor-m1', motor_codes: ['M1'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-004', code: 'INIT-004', title: 'Modelo de ativação e previsão 30/60/90 da base contratual',              type: 'COM', priority: 'P0', pillar_id: 'pillar-2', okr_code: 'OKR-P2', kr_code: 'P2.5', owner: 'CS / Relacionamento',  sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-20', end_date: '2026-06-30', effort: 'ALTO',  motor_id: 'motor-m1', motor_codes: ['M1'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-20T00:00:00Z' },
  { id: 'init-005', code: 'INIT-005', title: 'Planejamento semanal de capacidade operacional Q1',                      type: 'MET', priority: 'P0', pillar_id: 'pillar-3', okr_code: 'OKR-P3', kr_code: 'P3.2', owner: 'Operação',             sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-15', end_date: '2026-03-31', effort: 'MEDIO', motor_id: 'motor-m3', motor_codes: ['M3'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'init-006', code: 'INIT-006', title: 'Implantação do registro semanal de capacidade 4–6 semanas à frente',    type: 'MET', priority: 'P0', pillar_id: 'pillar-3', okr_code: 'OKR-P3', kr_code: 'P3.2', owner: 'Operação',             sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-15', end_date: '2026-03-31', effort: 'MEDIO', motor_id: 'motor-m3', motor_codes: ['M3'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'init-007', code: 'INIT-007', title: 'Pacote mensal de evidências e prova de valor',                           type: 'COM', priority: 'P0', pillar_id: 'pillar-4', okr_code: 'OKR-P4', kr_code: 'P4.1', owner: 'Marketing',            sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-01', end_date: '2026-12-31', effort: 'MEDIO', motor_id: 'motor-m4', motor_codes: ['M4'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-008', code: 'INIT-008', title: 'Relatório executivo de prova de valor Top-14',                          type: 'COM', priority: 'P0', pillar_id: 'pillar-4', okr_code: 'OKR-P4', kr_code: 'P4.2', owner: 'Marketing',            sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-02-01', end_date: '2026-03-31', effort: 'BAIXO', motor_id: 'motor-m4', motor_codes: ['M4'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'init-009', code: 'INIT-009', title: 'Mapa de posições-chave e sucessão mínima',                              type: 'ORG', priority: 'P0', pillar_id: 'pillar-5', okr_code: 'OKR-P5', kr_code: 'P5.4', owner: 'RH / Pessoas',         sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-02-01', end_date: '2026-07-31', effort: 'MEDIO', motor_id: 'motor-m5', motor_codes: ['M5'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'init-010', code: 'INIT-010', title: 'Onboarding estruturado e rituais mínimos de liderança',                 type: 'ORG', priority: 'P0', pillar_id: 'pillar-5', okr_code: 'OKR-P5', kr_code: 'P5.5', owner: 'RH / Pessoas',         sponsor: 'Direção Executiva', status: 'PLANEJADA',     start_date: '2026-02-15', end_date: '2026-06-30', effort: 'MEDIO', motor_id: 'motor-m5', motor_codes: ['M5'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-011', code: 'INIT-011', title: 'Processo de cobrança e reativação da base com baixa execução',          type: 'COM', priority: 'P0', pillar_id: 'pillar-2', okr_code: 'OKR-P2', kr_code: 'P2.4', owner: 'CS / Relacionamento',  sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-20', end_date: '2026-06-30', effort: 'ALTO',  motor_id: 'motor-m1', motor_codes: ['M1'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-20T00:00:00Z' },
  { id: 'init-012', code: 'INIT-012', title: 'Definição do modelo de separação societária Aero × Techdengue v1',     type: 'MET', priority: 'P0', pillar_id: 'pillar-1', okr_code: 'OKR-P1', kr_code: 'P1.5', owner: 'Direção Executiva',    sponsor: 'Direção Executiva', status: 'NAO_INICIADA',  start_date: '2026-02-01', end_date: '2026-04-30', effort: 'ALTO',  motor_id: 'motor-m2', motor_codes: ['M2'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-013', code: 'INIT-013', title: 'Implantação da trilha de evidências EVID-* para KRs',                   type: 'MET', priority: 'P0', pillar_id: 'pillar-1', okr_code: 'OKR-P1', kr_code: 'P1.4', owner: 'Direção Executiva',    sponsor: 'Direção Executiva', status: 'EM_ANDAMENTO',  start_date: '2026-01-15', end_date: '2026-12-31', effort: 'MEDIO', motor_id: 'motor-m2', motor_codes: ['M2'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  // P1 — Estratégicas do ano
  { id: 'init-014', code: 'INIT-014', title: 'Painel de gestão da monetização, saldo e vazão',                        type: 'SIS', priority: 'P1', pillar_id: 'pillar-4', okr_code: 'OKR-P4', kr_code: 'P4.3', owner: 'P&D / Produto / Dados', sponsor: 'Direção Executiva', status: 'PLANEJADA',     start_date: '2026-03-01', end_date: '2026-07-31', effort: 'ALTO',  motor_id: 'motor-m4', motor_codes: ['M4', 'M1'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-015', code: 'INIT-015', title: 'Padrão mínimo de qualidade e SLA por operação',                         type: 'ORG', priority: 'P1', pillar_id: 'pillar-3', okr_code: 'OKR-P3', kr_code: 'P3.4', owner: 'Operação',             sponsor: 'Direção Executiva', status: 'PLANEJADA',     start_date: '2026-04-01', end_date: '2026-09-30', effort: 'ALTO',  motor_id: 'motor-m3', motor_codes: ['M3'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-016', code: 'INIT-016', title: 'Redução de retrabalho em 20% com rastreamento por operação',            type: 'ORG', priority: 'P1', pillar_id: 'pillar-3', okr_code: 'OKR-P3', kr_code: 'P3.3', owner: 'Operação',             sponsor: 'Direção Executiva', status: 'PLANEJADA',     start_date: '2026-04-01', end_date: '2026-09-30', effort: 'MEDIO', motor_id: 'motor-m3', motor_codes: ['M3'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-017', code: 'INIT-017', title: 'Integração formal Operação ↔ CS ↔ Dados (pontos de passagem)',          type: 'ORG', priority: 'P1', pillar_id: 'pillar-3', okr_code: 'OKR-P3', kr_code: 'P3.5', owner: 'Operação + CS',        sponsor: 'Direção Executiva', status: 'PLANEJADA',     start_date: '2026-04-01', end_date: '2026-07-31', effort: 'MEDIO', motor_id: 'motor-m3', motor_codes: ['M3', 'M1'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-018', code: 'INIT-018', title: 'Estruturação da área Comercial e processo de pipeline com tese',        type: 'ORG', priority: 'P1', pillar_id: 'pillar-2', okr_code: 'OKR-P2', kr_code: 'P2.2', owner: 'Comercial',            sponsor: 'Direção Executiva', status: 'NAO_INICIADA',  start_date: '2026-04-01', end_date: '2026-09-30', effort: 'ALTO',  motor_id: 'motor-m1', motor_codes: ['M1'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-019', code: 'INIT-019', title: 'Baseline de uso de produto e melhoria ≥ 15%',                           type: 'SIS', priority: 'P1', pillar_id: 'pillar-4', okr_code: 'OKR-P4', kr_code: 'P4.4', owner: 'P&D / Produto / Dados', sponsor: 'Direção Executiva', status: 'NAO_INICIADA',  start_date: '2026-06-01', end_date: '2026-12-31', effort: 'ALTO',  motor_id: 'motor-m4', motor_codes: ['M4'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-020', code: 'INIT-020', title: 'Duas frentes de automação/IA com ganho mensurável',                     type: 'SIS', priority: 'P1', pillar_id: 'pillar-4', okr_code: 'OKR-P4', kr_code: 'P4.5', owner: 'P&D / Produto / Dados', sponsor: 'Direção Executiva', status: 'NAO_INICIADA',  start_date: '2026-06-01', end_date: '2026-12-31', effort: 'ALTO',  motor_id: 'motor-m4', motor_codes: ['M4'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-021', code: 'INIT-021', title: 'Diversificação Aero — mapeamento de novos serviços e clientes',         type: 'COM', priority: 'P1', pillar_id: 'pillar-2', okr_code: 'OKR-P2', kr_code: 'P2.3', owner: 'Comercial + Operação',  sponsor: 'Direção Executiva', status: 'NAO_INICIADA',  start_date: '2026-06-01', end_date: '2026-12-31', effort: 'MEDIO', motor_id: 'motor-m1', motor_codes: ['M1'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'init-022', code: 'INIT-022', title: 'Programa de engajamento e retenção de talentos',                        type: 'ORG', priority: 'P1', pillar_id: 'pillar-5', okr_code: 'OKR-P5', kr_code: 'P5.2', owner: 'RH / Pessoas',         sponsor: 'Direção Executiva', status: 'NAO_INICIADA',  start_date: '2026-05-01', end_date: '2026-12-31', effort: 'MEDIO', motor_id: 'motor-m5', motor_codes: ['M5'], budget_estimate: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// PLANOS DE AÇÃO (7 áreas × 1 plano = 7 planos)
// ============================================================

 mockStore.plans = [
  { id: 'plan-rh-2026', area_id: 'area-rh', year: 2026, title: 'Plano de Ação RH 2026', description: 'Liderança, posições-chave, onboarding e saúde organizacional', status: 'ATIVO', template_id: null, pack_id: 'pack-rh-2026', created_by: 'user-1', manager_approved_by: 'manager-1', manager_approved_at: '2026-01-10T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-15T00:00:00Z', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'plan-marketing-2026', area_id: 'area-marketing', year: 2026, title: 'Plano de Ação Marketing 2026', description: 'Narrativa de evidência, prova de valor e suporte à expansão', status: 'ATIVO', template_id: null, pack_id: 'pack-marketing-2026', created_by: 'user-2', manager_approved_by: 'manager-2', manager_approved_at: '2026-01-12T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-18T00:00:00Z', created_at: '2026-01-05T00:00:00Z', updated_at: '2026-01-18T00:00:00Z' },
  { id: 'plan-pd-2026', area_id: 'area-pd', year: 2026, title: 'Plano de Ação P&D 2026', description: 'Produto, dados, IA, evidência e automação com apoio da Direção', status: 'ATIVO', template_id: null, pack_id: 'pack-pd-2026', created_by: 'user-3', manager_approved_by: 'manager-3', manager_approved_at: '2026-01-09T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-14T00:00:00Z', created_at: '2026-01-03T00:00:00Z', updated_at: '2026-01-14T00:00:00Z' },
  { id: 'plan-operacoes-2026', area_id: 'area-operacoes', year: 2026, title: 'Plano de Ação Operação 2026', description: 'Capacidade, qualidade, SLA, margem e prontidão de execução', status: 'ATIVO', template_id: null, pack_id: 'pack-operacoes-2026', created_by: 'user-4', manager_approved_by: 'manager-4', manager_approved_at: '2026-01-08T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-12T00:00:00Z', created_at: '2026-01-02T00:00:00Z', updated_at: '2026-01-12T00:00:00Z' },
  { id: 'plan-cs-2026', area_id: 'area-cs', year: 2026, title: 'Plano de Ação CS 2026', description: 'Ativação de demanda, Pareto Top-14 e previsão 30/60/90', status: 'ATIVO', template_id: null, pack_id: 'pack-cs-2026', created_by: 'user-5', manager_approved_by: 'manager-5', manager_approved_at: '2026-01-11T00:00:00Z', direction_approved_by: 'director-1', direction_approved_at: '2026-01-16T00:00:00Z', created_at: '2026-01-04T00:00:00Z', updated_at: '2026-01-16T00:00:00Z' },
  { id: 'plan-com-2026', area_id: 'area-com', year: 2026, title: 'Plano de Ação Comercial 2026', description: 'Estruturação da área comercial, processos e pipeline com tese', status: 'RASCUNHO', template_id: null, pack_id: null, created_by: 'user-6', manager_approved_by: null, manager_approved_at: null, direction_approved_by: null, direction_approved_at: null, created_at: '2026-01-15T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'plan-fin-2026', area_id: 'area-fin', year: 2026, title: 'Plano de Ação Financeiro 2026', description: 'Apuração gerencial por unidade, guardrails e previsibilidade de caixa', status: 'EM_APROVACAO', template_id: null, pack_id: 'pack-fin-2026', created_by: 'user-7', manager_approved_by: 'manager-7', manager_approved_at: '2026-01-20T00:00:00Z', direction_approved_by: null, direction_approved_at: null, created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-20T00:00:00Z' },
 ]

// ============================================================
// SUBPILARES (DOC 04 — 4 por pilar = 20 total)
// ============================================================

mockStore.subpillars = [
  { id: 'sp-p1s1', pillar_id: 'pillar-1', code: 'P1.S1', title: 'Separação Aero × Techdengue',        frontier: 'Separação societária progressiva com rastreabilidade legal e financeira' },
  { id: 'sp-p1s2', pillar_id: 'pillar-1', code: 'P1.S2', title: 'Governança e Registro de Decisões',  frontier: 'Decisões formalizadas com DEC-*, alçadas e trilha auditável' },
  { id: 'sp-p1s3', pillar_id: 'pillar-1', code: 'P1.S3', title: 'Controles e Apuração Gerencial',     frontier: 'DRE por unidade, centros de custo e fechamento mensal até dia 10' },
  { id: 'sp-p1s4', pillar_id: 'pillar-1', code: 'P1.S4', title: 'Preparação para Transação',          frontier: 'Documentação, compliance e padrão auditável para eventual exit ou parceria' },
  { id: 'sp-p2s1', pillar_id: 'pillar-2', code: 'P2.S1', title: 'Monetização da Base Contratual',     frontier: 'Executar e reduzir saldo, ativar Pareto Top-14, operar war room semanal' },
  { id: 'sp-p2s2', pillar_id: 'pillar-2', code: 'P2.S2', title: 'Expansão e Novos Contratos TD',      frontier: 'Crescer receita TD com tese de expansão e novas praças' },
  { id: 'sp-p2s3', pillar_id: 'pillar-2', code: 'P2.S3', title: 'Diversificação Aero',                frontier: 'Ampliar portfólio Aero e reduzir dependência de poucos clientes' },
  { id: 'sp-p2s4', pillar_id: 'pillar-2', code: 'P2.S4', title: 'Previsibilidade de Receita 30/60/90',frontier: 'Operar forecasting estruturado e early warning de desvio' },
  { id: 'sp-p3s1', pillar_id: 'pillar-3', code: 'P3.S1', title: 'Capacidade e Planejamento Operacional',frontier: 'Planejar semana a semana, garantir prontidão e evitar gargalos' },
  { id: 'sp-p3s2', pillar_id: 'pillar-3', code: 'P3.S2', title: 'Qualidade e SLA',                    frontier: 'Padrão mínimo rastreável por operação, retrabalho controlado' },
  { id: 'sp-p3s3', pillar_id: 'pillar-3', code: 'P3.S3', title: 'Margem e Eficiência',                frontier: 'Margem operacional ≥ 30%, controle de custo operacional' },
  { id: 'sp-p3s4', pillar_id: 'pillar-3', code: 'P3.S4', title: 'Integração Operação ↔ CS ↔ Dados',  frontier: 'Pontos de passagem, responsabilidade de interface e fluidez operacional' },
  { id: 'sp-p4s1', pillar_id: 'pillar-4', code: 'P4.S1', title: 'Produto e Experiência do Cliente',   frontier: 'Maturidade do produto, adoção e melhoria contínua de experiência' },
  { id: 'sp-p4s2', pillar_id: 'pillar-4', code: 'P4.S2', title: 'Dados e Inteligência Operacional',   frontier: 'Dados como ativo: painel de gestão, rastreabilidade e capacidade analítica' },
  { id: 'sp-p4s3', pillar_id: 'pillar-4', code: 'P4.S3', title: 'IA e Automação',                     frontier: 'Frentes de automação e IA com ganho mensurável em produtividade ou qualidade' },
  { id: 'sp-p4s4', pillar_id: 'pillar-4', code: 'P4.S4', title: 'Prova de Valor e Evidência',         frontier: 'Pacote mensal de evidências, relatório executivo e diferencial competitivo' },
  { id: 'sp-p5s1', pillar_id: 'pillar-5', code: 'P5.S1', title: 'Retenção e Saúde Organizacional',   frontier: 'Turnover ≤ 35%, engajamento ≥ 85% e saúde medida como guardrail' },
  { id: 'sp-p5s2', pillar_id: 'pillar-5', code: 'P5.S2', title: 'Liderança e Rituais Mínimos',        frontier: 'Rituais de liderança ≥ 85%, 1:1, QBR pessoal e feedback estruturado' },
  { id: 'sp-p5s3', pillar_id: 'pillar-5', code: 'P5.S3', title: 'Posições-Chave e Sucessão',          frontier: 'Mapa de posições críticas ≥ 80% preenchidas com plano de sucessão' },
  { id: 'sp-p5s4', pillar_id: 'pillar-5', code: 'P5.S4', title: 'Onboarding e Densidade Intelectual', frontier: 'Onboarding estruturado, cultura de aprendizado e densidade de conhecimento' },
]

// ============================================================
// TEMAS ESTRATÉGICOS (DOC 02 v2 — 8 temas)
// ============================================================

mockStore.strategicThemes = [
  { id: 'th-01', code: 'TH-01', title: 'Separação Aero × Techdengue',        description: 'Separação societária progressiva, governança dual, rastreabilidade legal e financeira',       pillar_codes: ['P1'],       priority: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'th-02', code: 'TH-02', title: 'TD Sell-Ready',                       description: 'Techdengue pronta para crescimento, separação e eventual transação societária',                 pillar_codes: ['P1', 'P2'], priority: 2, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'th-03', code: 'TH-03', title: 'Monetização da Base Contratual',      description: 'Ativar, reduzir saldo e operar Pareto Top-14 com disciplina semanal',                          pillar_codes: ['P2'],       priority: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'th-04', code: 'TH-04', title: 'Expansão com Permanência',            description: 'Crescer novos contratos mantendo qualidade, SLA e margem adequada',                           pillar_codes: ['P2', 'P3'], priority: 2, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'th-05', code: 'TH-05', title: 'Diversificação Aero',                 description: 'Ampliar portfólio Aero, reduzir concentração e explorar novos segmentos',                     pillar_codes: ['P2'],       priority: 3, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'th-06', code: 'TH-06', title: 'Densidade Intelectual',               description: 'Pessoas como vantagem competitiva: retenção, liderança e capacidade de geração de valor',    pillar_codes: ['P5'],       priority: 2, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'th-07', code: 'TH-07', title: 'Governança e Disciplina Operacional', description: 'Registros formais, decisões auditáveis e rituais de acompanhamento ativos',                   pillar_codes: ['P1', 'P3'], priority: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'th-08', code: 'TH-08', title: 'Produto, Dados e IA',                 description: 'Tecnologia como ativo defensável: produto, evidência, automação e inteligência operacional', pillar_codes: ['P4'],       priority: 2, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// RISCOS ESTRATÉGICOS (DOC 10 v2 — 13 riscos)
// ============================================================

mockStore.strategicRisks = [
  { id: 'rsk-01', code: 'RSK-2026-01', title: 'Risco Regulatório Agroquímico',                    description: 'Mudanças de licenciamento afetam operação Aero',                         category: 'Regulatório',  severity: 'CRITICO',    probability: 'MEDIO', impact: 'CRITICO', owner: 'Direção Executiva',   mitigation: 'Monitorar legislação, formalizar compliance e mapear impacto por produto',  pillar_code: 'P1', status: 'ATIVO', review_cadence: 'MENSAL',    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-02', code: 'RSK-2026-02', title: 'Falha de Ativação da Base Contratual',             description: 'Saldo se acumula sem execução, motor do ano em risco',                   category: 'Operacional',  severity: 'CRITICO',    probability: 'ALTO',  impact: 'CRITICO', owner: 'CS / Relacionamento', mitigation: 'Pareto Top-14, war room semanal e modelo 30/60/90',                         pillar_code: 'P2', status: 'ATIVO', review_cadence: 'SEMANAL',   created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-03', code: 'RSK-2026-03', title: 'Gargalo de Capacidade Operacional Q1',             description: 'Demanda supera oferta no período crítico',                               category: 'Operacional',  severity: 'CRITICO',    probability: 'ALTO',  impact: 'CRITICO', owner: 'Operação',            mitigation: 'Planejamento semanal de capacidade, antecipação de contratações',           pillar_code: 'P3', status: 'ATIVO', review_cadence: 'SEMANAL',   created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-04', code: 'RSK-2026-04', title: 'Queda de Qualidade e SLA',                         description: 'Impacto na renovação e expansão por falha de entrega',                  category: 'Qualidade',    severity: 'CRITICO',    probability: 'MEDIO', impact: 'CRITICO', owner: 'Operação',            mitigation: 'Implantar padrão mínimo de qualidade, medir SLA por operação',             pillar_code: 'P3', status: 'ATIVO', review_cadence: 'MENSAL',    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-05', code: 'RSK-2026-05', title: 'Concentração em Poucos Clientes',                  description: 'Risco de receita por perda de cliente-chave',                           category: 'Comercial',    severity: 'CRITICO',    probability: 'MEDIO', impact: 'CRITICO', owner: 'Direção Executiva',   mitigation: 'Estruturar diversificação Aero e expansão TD com tese',                    pillar_code: 'P2', status: 'ATIVO', review_cadence: 'TRIMESTRAL', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-06', code: 'RSK-2026-06', title: 'Risco de Caixa por Desvio e Inadimplência',        description: 'Desvio de execução pressiona caixa além do guardrail',                  category: 'Financeiro',   severity: 'ALTO',       probability: 'MEDIO', impact: 'ALTO',    owner: 'Financeiro',          mitigation: 'Guardrail de caixa 30/60/90, acompanhamento semanal do forecast',          pillar_code: 'P1', status: 'ATIVO', review_cadence: 'SEMANAL',   created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-07', code: 'RSK-2026-07', title: 'Falha de Interfaces Operação ↔ CS ↔ Dados',        description: 'Perda de rastreabilidade entre áreas críticas',                         category: 'Operacional',  severity: 'ALTO',       probability: 'MEDIO', impact: 'ALTO',    owner: 'Operação + CS',       mitigation: 'Formalizar pontos de passagem e responsabilidades de interface',           pillar_code: 'P3', status: 'ATIVO', review_cadence: 'MENSAL',    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-08', code: 'RSK-2026-08', title: 'Turnover Elevado de Pessoas-Chave',                description: 'Perda de conhecimento operacional crítico',                             category: 'Pessoas',      severity: 'ALTO',       probability: 'MEDIO', impact: 'ALTO',    owner: 'RH / Pessoas',        mitigation: 'Mapa de sucessão, programa de retenção e rituais de engajamento',          pillar_code: 'P5', status: 'ATIVO', review_cadence: 'MENSAL',    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-09', code: 'RSK-2026-09', title: 'Atraso na Separação Societária Aero × TD',         description: 'Risco legal e operacional por dependência societária prolongada',        category: 'Governança',   severity: 'ALTO',       probability: 'BAIXO', impact: 'ALTO',    owner: 'Direção Executiva',   mitigation: 'Definir modelo de separação v1, acompanhar cronograma legal',              pillar_code: 'P1', status: 'ATIVO', review_cadence: 'MENSAL',    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-10', code: 'RSK-2026-10', title: 'Qualidade e Governança dos Dados',                 description: 'Decisões baseadas em dados incorretos ou sem rastreabilidade',          category: 'Dados',        severity: 'ALTO',       probability: 'MEDIO', impact: 'ALTO',    owner: 'P&D / Produto',       mitigation: 'Implantar governança de dados, validar fontes críticas por domínio',       pillar_code: 'P4', status: 'ATIVO', review_cadence: 'MENSAL',    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-11', code: 'RSK-2026-11', title: 'Crescimento Sem Tese',                             description: 'Expansão comercial sem critério de seleção de clientes/segmentos',     category: 'Estratégico',  severity: 'MONITORADO', probability: 'BAIXO', impact: 'MEDIO',   owner: 'Direção Executiva',   mitigation: 'Definir tese de expansão e critérios de elegibilidade por segmento',       pillar_code: 'P2', status: 'ATIVO', review_cadence: 'TRIMESTRAL', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-12', code: 'RSK-2026-12', title: 'Dependência de Pessoas-Chave Sem Backup',          description: 'Processos críticos sem documentação ou substituto imediato',            category: 'Pessoas',      severity: 'MONITORADO', probability: 'BAIXO', impact: 'MEDIO',   owner: 'RH / Pessoas',        mitigation: 'Mapa de sucessão mínima e documentação de processos críticos',             pillar_code: 'P5', status: 'ATIVO', review_cadence: 'TRIMESTRAL', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'rsk-13', code: 'RSK-2026-13', title: 'Atraso em Contratações Críticas',                  description: 'Gargalo humano em posições estratégicas não suprido a tempo',          category: 'Pessoas',      severity: 'ALTO',       probability: 'MEDIO', impact: 'ALTO',    owner: 'RH / Pessoas',        mitigation: 'Antecipar contratações, operar mapa de posições-chave',                   pillar_code: 'P5', status: 'ATIVO', review_cadence: 'MENSAL',    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

// ============================================================
// CENÁRIOS FINANCEIROS (DOC 07 v2 + DOC 09 v3)
// ============================================================

mockStore.financialScenarios = [
  { id: 'scen-pessimista', code: 'PESSIMISTA', label: 'Pessimista', probability_pct: 15, revenue_target: 8310000,  margin_target: 18.2, description: 'Execução abaixo da meta, inadimplência elevada, gargalo Q1 não resolvido',                      is_reference: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'scen-base',       code: 'BASE',       label: 'Base',       probability_pct: 60, revenue_target: 11440000, margin_target: 30.0, description: 'Execução dentro do plano, ativação da base, margem sustentável acima de 30%',                   is_reference: true,  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'scen-otimista',   code: 'OTIMISTA',   label: 'Otimista',   probability_pct: 25, revenue_target: 13290000, margin_target: 36.4, description: 'Aceleração de execução, ativação plena do Pareto, diversificação em curso antes do prazo', is_reference: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

// Expose mockStore on window for platform diagnostics (dev/preview only)
declare global {
  interface Window {
    __mockStoreDebug?: typeof mockStore
  }
}
if (typeof window !== 'undefined') {
  window.__mockStoreDebug = mockStore
}

// Export aliases for backward compatibility
export const mockAreas = mockStore.areas
export const mockPillars = mockStore.pillars
export const mockKeyResults = mockStore.keyResults
export const mockCorporateOkrs = mockStore.corporateOkrs
export const mockAreaOkrs = mockStore.areaOkrs
export const mockInitiatives = mockStore.initiatives
export const mockPlans = mockStore.plans

// Export aliases para novas entidades canônicas
export const mockSubpillars = mockStore.subpillars
export const mockMotors = mockStore.motors
export const mockStrategicThemes = mockStore.strategicThemes
export const mockStrategicRisks = mockStore.strategicRisks
export const mockFinancialScenarios = mockStore.financialScenarios
