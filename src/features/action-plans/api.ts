import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { ActionPlan, ActionPlanFormData, PortfolioStats, ActionPlanStatus, ActionPlanHealth, ActionPlanPriority } from './types'

const mockPlans: ActionPlan[] = [
  {
    id: 'ap-rh-rituais-onboarding',
    title: 'Rituais mínimos de liderança e onboarding 30/60/90',
    description: 'Implantar rituais mínimos de liderança, sucessão mínima e onboarding mensurável para posições críticas',
    area_id: 'rh',
    area_name: 'RH / Pessoas',
    parent_plan_id: null,
    linked_kpis: ['P5.KPI-02', 'P5.KPI-03', 'P5.KPI-04'],
    linked_goals: ['goal-turnover-2026'],
    status: 'in_progress',
    priority: 'critical',
    health: 'at_risk',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-rh-1', phase: 'plan', description: 'Mapeadas posições-chave, rituais mínimos e desenho de onboarding 30/60/90', findings: '', actions_taken: '', date: '2026-02-06', user_id: 'demo-user' },
      { id: 'pdca-rh-2', phase: 'do', description: 'Piloto iniciado com líderes e duas funções críticas', findings: 'Aderência inicial abaixo do esperado', actions_taken: 'Reforço de rotina com check-ins quinzenais', date: '2026-03-01', user_id: 'demo-user' },
    ],
    what: 'Implantar rituais mínimos, mapa de posições-chave e onboarding 30/60/90',
    why: 'Sustentar capacidade humana e reduzir risco de turnover em posições críticas',
    where: 'RH / Pessoas + lideranças das áreas',
    when_start: '2026-02-06',
    when_end: '2026-06-30',
    who_responsible: 'Renata Silvestre',
    who_team: ['Fernanda Xavier', 'Lideranças de área'],
    how: 'Mapa de críticos → rituais mínimos → piloto de onboarding → expansão por área',
    how_much: 68000,
    progress: 48,
    milestones: [
      { id: 'ms-rh-1', title: 'Mapa de posições-chave publicado', due_date: '2026-03-15', completed: true, completed_at: '2026-03-12' },
      { id: 'ms-rh-2', title: 'Onboarding 30/60/90 em piloto', due_date: '2026-04-30', completed: false },
      { id: 'ms-rh-3', title: 'Rituais mínimos com aderência ≥ 75%', due_date: '2026-06-30', completed: false },
    ],
    tasks: [
      { id: 'tsk-rh-1', title: 'Fechar baseline de posições críticas', status: 'done', assignee_id: 'user-rh-1', due_date: '2026-03-10', order: 1 },
      { id: 'tsk-rh-2', title: 'Rodar piloto onboarding em funções críticas', status: 'doing', assignee_id: 'user-rh-2', due_date: '2026-04-30', order: 2 },
      { id: 'tsk-rh-3', title: 'Publicar checklist de rituais mínimos', status: 'todo', assignee_id: 'user-rh-1', due_date: '2026-05-15', order: 3 },
    ],
    risk_level: 'high',
    risk_description: 'Baixa aderência dos líderes e sobrecarga operacional das áreas',
    mitigation_plan: 'Cadência quinzenal com diretoria e acompanhamento por área no MBR RH',
    owner_id: 'user-rh-1',
    sponsor_id: 'sponsor-direcao',
    responsible: 'Renata Silvestre',
    due_date: '2026-06-30',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-02-06T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ap-mkt-provas-expansao',
    title: 'Biblioteca de provas e agenda nacional com tese',
    description: 'Consolidar provas de valor, kits de decisão e agenda de expansão com narrativa única',
    area_id: 'marketing',
    area_name: 'Marketing',
    parent_plan_id: null,
    linked_kpis: ['P4.KPI-01', 'P2.KPI-03'],
    linked_goals: ['goal-receita-base-2026'],
    status: 'in_progress',
    priority: 'high',
    health: 'on_track',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-mkt-1', phase: 'plan', description: 'Definida biblioteca de provas por tese e agenda nacional 2026', findings: '', actions_taken: '', date: '2026-02-12', user_id: 'demo-user' },
    ],
    what: 'Publicar kits de decisão e sustentar agenda nacional com tese',
    why: 'Aumentar prova de valor e apoiar expansão com coerência estratégica',
    where: 'Marketing + interface com Comercial e P&D / Produto / Dados',
    when_start: '2026-02-12',
    when_end: '2026-06-30',
    who_responsible: 'Time de Marketing',
    who_team: ['Comercial', 'P&D / Produto / Dados'],
    how: 'Biblioteca de provas → kits de decisão → agenda nacional → pós-evento com rastreabilidade',
    how_much: 54000,
    progress: 58,
    milestones: [
      { id: 'ms-mkt-1', title: 'Kits de decisão da tese publicados', due_date: '2026-03-31', completed: true, completed_at: '2026-03-28' },
      { id: 'ms-mkt-2', title: 'Agenda nacional Q2 operacional', due_date: '2026-04-30', completed: false },
    ],
    tasks: [
      { id: 'tsk-mkt-1', title: 'Validar biblioteca de provas', status: 'done', assignee_id: 'user-mkt-1', due_date: '2026-03-20', order: 1 },
      { id: 'tsk-mkt-2', title: 'Conectar agenda a pipeline rastreado', status: 'doing', assignee_id: 'user-mkt-2', due_date: '2026-04-25', order: 2 },
    ],
    risk_level: 'low',
    risk_description: 'Desalinhamento entre narrativa e tese comercial',
    mitigation_plan: 'Revisão quinzenal com Comercial e Direção',
    owner_id: 'user-mkt-1',
    sponsor_id: 'sponsor-direcao',
    responsible: 'Time de Marketing',
    due_date: '2026-06-30',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-02-12T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ap-pd-painel-evidencias',
    title: 'Painel de monetização e evidências executivas',
    description: 'Consolidar painel executivo com saldo, vazão, previsão 30/60/90 e biblioteca de evidências',
    area_id: 'pd',
    area_name: 'P&D / Produto / Dados',
    parent_plan_id: null,
    linked_kpis: ['P4.KPI-01', 'P4.KPI-02', 'P4.KPI-03'],
    linked_goals: ['goal-receita-base-2026', 'goal-q1-hectares-fixos'],
    status: 'in_progress',
    priority: 'high',
    health: 'on_track',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-pd-1', phase: 'plan', description: 'Definido escopo do painel executivo e camada de evidências', findings: '', actions_taken: '', date: '2026-02-15', user_id: 'demo-user' },
      { id: 'pdca-pd-2', phase: 'do', description: 'Primeira versão conectada ao War Room', findings: 'Diferença entre fontes de saldo e agenda', actions_taken: 'Criada rotina de reconciliação semanal', date: '2026-03-01', user_id: 'demo-user' },
    ],
    what: 'Implantar painel de monetização com lastro e trilha de evidências',
    why: 'Transformar produto e dados em prova de valor e inteligência de gestão',
    where: 'Direção + P&D / Produto / Dados + CS / Relacionamento',
    when_start: '2026-02-15',
    when_end: '2026-05-31',
    who_responsible: 'Direção Executiva',
    who_team: ['CS / Relacionamento', 'Marketing'],
    how: 'Painel de saldo/vazão → forecast com lastro → evidências executivas por cliente',
    how_much: 92000,
    progress: 52,
    milestones: [
      { id: 'ms-pd-1', title: 'Painel de saldo e vazão publicado', due_date: '2026-03-31', completed: true, completed_at: '2026-03-29' },
      { id: 'ms-pd-2', title: 'Forecast 30/60/90 reconciliado', due_date: '2026-04-30', completed: false },
    ],
    tasks: [
      { id: 'tsk-pd-1', title: 'Conciliar fontes de saldo', status: 'done', assignee_id: 'user-pd-1', due_date: '2026-03-25', order: 1 },
      { id: 'tsk-pd-2', title: 'Publicar trilha de evidências executivas', status: 'doing', assignee_id: 'user-pd-2', due_date: '2026-04-20', order: 2 },
    ],
    risk_level: 'medium',
    risk_description: 'Baixa confiabilidade dos dados de origem em ciclos semanais',
    mitigation_plan: 'Reconciliação semanal com dono por fonte e trilha de correção',
    owner_id: 'user-pd-1',
    sponsor_id: 'sponsor-direcao',
    responsible: 'Direção Executiva',
    due_date: '2026-05-31',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ap-operacoes-capacidade-sla',
    title: 'Planejamento semanal de capacidade e padrão SLA',
    description: 'Instalar rotina semanal de capacidade, padronização de qualidade e leitura de gargalos',
    area_id: 'operacoes',
    area_name: 'Operação',
    parent_plan_id: null,
    linked_kpis: ['A3', 'P3.KPI-01', 'P3.KPI-02', 'P3.KPI-03'],
    linked_goals: ['goal-q1-hectares-fixos', 'goal-margem-operacional'],
    status: 'in_progress',
    priority: 'critical',
    health: 'at_risk',
    pdca_phase: 'check',
    pdca_history: [
      { id: 'pdca-op-1', phase: 'plan', description: 'Estruturado pipeline de 4 a 6 semanas com leitura de capacidade', findings: '', actions_taken: '', date: '2026-02-08', user_id: 'demo-user' },
      { id: 'pdca-op-2', phase: 'check', description: 'Verificada aderência e retrabalho em ciclos críticos', findings: 'Retrabalho acima do limite em duas frentes', actions_taken: 'Criado checklist mínimo e auditoria interna', date: '2026-03-01', user_id: 'demo-user' },
    ],
    what: 'Operar capacidade semanal, checklist mínimo de qualidade e integração com CS',
    why: 'Garantir margem, qualidade e prontidão operacional',
    where: 'Operação + interface com CS / Relacionamento e Dados',
    when_start: '2026-02-08',
    when_end: '2026-06-30',
    who_responsible: 'Liderança de Operação',
    who_team: ['CS / Relacionamento', 'P&D / Produto / Dados'],
    how: 'Pipeline semanal → checklists → auditoria → revisão no War Room e MBR',
    how_much: 110000,
    progress: 44,
    milestones: [
      { id: 'ms-op-1', title: 'Pipeline semanal implantado', due_date: '2026-03-15', completed: true, completed_at: '2026-03-10' },
      { id: 'ms-op-2', title: 'Checklist mínimo de qualidade ativo', due_date: '2026-04-15', completed: false },
      { id: 'ms-op-3', title: 'Integração com CS estabilizada', due_date: '2026-06-30', completed: false },
    ],
    tasks: [
      { id: 'tsk-op-1', title: 'Atualizar leitura semanal de gargalos', status: 'doing', assignee_id: 'user-op-1', due_date: '2026-04-05', order: 1 },
      { id: 'tsk-op-2', title: 'Aplicar checklist mínimo em frentes críticas', status: 'todo', assignee_id: 'user-op-2', due_date: '2026-04-20', order: 2 },
    ],
    risk_level: 'high',
    risk_description: 'Capacidade crítica no pico do Q1 e retrabalho acima do limite',
    mitigation_plan: 'Repriorização semanal, auditoria interna e escalonamento no War Room',
    owner_id: 'user-op-1',
    sponsor_id: 'sponsor-direcao',
    responsible: 'Liderança de Operação',
    due_date: '2026-06-30',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-02-08T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ap-cs-warroom-pareto',
    title: 'Sala de Situação Pareto Top-14 e forecast 30/60/90',
    description: 'Instalar governança de monetização com Pareto Top-14, ativação e previsão com lastro',
    area_id: 'cs',
    area_name: 'CS / Relacionamento',
    parent_plan_id: null,
    linked_kpis: ['A2', 'P2.KPI-01', 'P2.KPI-02', 'C1', 'C4', 'C5', 'C7'],
    linked_goals: ['goal-q1-hectares-fixos', 'goal-receita-base-2026'],
    status: 'in_progress',
    priority: 'critical',
    health: 'at_risk',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-cs-1', phase: 'plan', description: 'Definidos Pareto Top-14, cadência semanal e indicadores de ativação', findings: '', actions_taken: '', date: '2026-02-05', user_id: 'demo-user' },
      { id: 'pdca-cs-2', phase: 'do', description: 'Sala de Situação em operação com revisão semanal', findings: 'Ativação ainda abaixo do alvo de 70%', actions_taken: 'Escalonamento de clientes com saldo envelhecido', date: '2026-03-01', user_id: 'demo-user' },
    ],
    what: 'Operar Pareto Top-14 com plano por cliente e forecast 30/60/90 com lastro',
    why: 'Converter saldo em agenda, execução e caixa com previsibilidade',
    where: 'CS / Relacionamento + Operação + Direção',
    when_start: '2026-02-05',
    when_end: '2026-06-30',
    who_responsible: 'CS / Relacionamento',
    who_team: ['Operação', 'P&D / Produto / Dados'],
    how: 'War Room semanal → plano por cliente → agenda confirmada → reconciliação de forecast',
    how_much: 74000,
    progress: 55,
    milestones: [
      { id: 'ms-cs-1', title: 'Pareto Top-14 validado', due_date: '2026-02-28', completed: true, completed_at: '2026-02-26' },
      { id: 'ms-cs-2', title: 'Ativação do Pareto ≥ 70%', due_date: '2026-04-30', completed: false },
      { id: 'ms-cs-3', title: 'Forecast 30/60/90 com lastro estável', due_date: '2026-06-30', completed: false },
    ],
    tasks: [
      { id: 'tsk-cs-1', title: 'Escalonar clientes com saldo envelhecido', status: 'doing', assignee_id: 'user-cs-1', due_date: '2026-04-10', order: 1 },
      { id: 'tsk-cs-2', title: 'Consolidar 30/60/90 com agenda confirmada', status: 'doing', assignee_id: 'user-cs-2', due_date: '2026-04-18', order: 2 },
    ],
    risk_level: 'high',
    risk_description: 'Saldo envelhecido e baixa ativação em clientes prioritários',
    mitigation_plan: 'Escalonamento por cliente, plano ativo e revisão semanal com direção',
    owner_id: 'user-cs-1',
    sponsor_id: 'sponsor-direcao',
    responsible: 'CS / Relacionamento',
    due_date: '2026-06-30',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-02-05T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ap-comercial-icp-handover',
    title: 'Estruturação comercial com ICP e handover para CS',
    description: 'Estruturar pipeline com tese, ICP, oferta replicável e transição disciplinada para CS',
    area_id: 'comercial',
    area_name: 'Comercial',
    parent_plan_id: null,
    linked_kpis: ['P2.KPI-03'],
    linked_goals: ['goal-receita-base-2026'],
    status: 'planned',
    priority: 'high',
    health: 'on_track',
    pdca_phase: 'plan',
    pdca_history: [
      { id: 'pdca-com-1', phase: 'plan', description: 'Estruturado escopo inicial da área comercial com tese, ICP e handover', findings: '', actions_taken: '', date: '2026-03-01', user_id: 'demo-user' },
    ],
    what: 'Implantar rotina comercial com ICP, contas-alvo e checklist de handover',
    why: 'Reduzir concentração e apoiar expansão com previsibilidade',
    where: 'Comercial + interface com Marketing e CS / Relacionamento',
    when_start: '2026-03-01',
    when_end: '2026-08-31',
    who_responsible: 'Comercial',
    who_team: ['Marketing', 'CS / Relacionamento'],
    how: 'ICP → contas-alvo → proposta replicável → checklist de transição para CS',
    how_much: 88000,
    progress: 18,
    milestones: [
      { id: 'ms-com-1', title: 'ICP e contas-alvo publicados', due_date: '2026-04-15', completed: false },
      { id: 'ms-com-2', title: 'Checklist de handover ativo', due_date: '2026-06-15', completed: false },
    ],
    tasks: [
      { id: 'tsk-com-1', title: 'Fechar ICP e lista de contas-alvo', status: 'doing', assignee_id: 'user-com-1', due_date: '2026-04-10', order: 1 },
      { id: 'tsk-com-2', title: 'Desenhar checklist de transição para CS', status: 'todo', assignee_id: 'user-com-2', due_date: '2026-05-15', order: 2 },
    ],
    risk_level: 'medium',
    risk_description: 'Área ainda em estruturação e sem rotina comercial consolidada',
    mitigation_plan: 'Escopo inicial reduzido, cadência semanal e governança com direção',
    owner_id: 'user-com-1',
    sponsor_id: 'sponsor-direcao',
    responsible: 'Comercial',
    due_date: '2026-08-31',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'ap-fin-dre-separacao',
    title: 'DRE gerencial por unidade e separação Aero × Techdengue',
    description: 'Consolidar DRE por unidade, centros de custo e leitura econômica para preparação de transação',
    area_id: 'financeiro',
    area_name: 'Financeiro',
    parent_plan_id: null,
    linked_kpis: ['A1', 'P1.KPI-01', 'P1.KPI-02'],
    linked_goals: ['goal-receita-base-2026', 'goal-margem-operacional'],
    status: 'in_progress',
    priority: 'critical',
    health: 'on_track',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-fin-1', phase: 'plan', description: 'Definido desenho de centros de custo e leitura econômica por unidade', findings: '', actions_taken: '', date: '2026-02-10', user_id: 'demo-user' },
      { id: 'pdca-fin-2', phase: 'do', description: 'Primeiro fechamento por unidade executado', findings: 'Alguns custos ainda sem alocação consistente', actions_taken: 'Criada revisão mensal de rateios', date: '2026-03-01', user_id: 'demo-user' },
    ],
    what: 'Implantar DRE gerencial por unidade e separação econômica Aero × Techdengue',
    why: 'Dar previsibilidade de margem e preparar a empresa para separação e transação',
    where: 'Financeiro + Direção Executiva',
    when_start: '2026-02-10',
    when_end: '2026-06-30',
    who_responsible: 'Financeiro',
    who_team: ['Direção Executiva'],
    how: 'Centros de custo → regras de alocação → fechamento por unidade → revisão mensal',
    how_much: 97000,
    progress: 61,
    milestones: [
      { id: 'ms-fin-1', title: 'Centros de custo definidos', due_date: '2026-03-10', completed: true, completed_at: '2026-03-07' },
      { id: 'ms-fin-2', title: 'Primeiro fechamento por unidade concluído', due_date: '2026-03-31', completed: true, completed_at: '2026-03-30' },
      { id: 'ms-fin-3', title: 'Separação econômica estabilizada', due_date: '2026-06-30', completed: false },
    ],
    tasks: [
      { id: 'tsk-fin-1', title: 'Revisar rateios sem alocação consistente', status: 'doing', assignee_id: 'user-fin-1', due_date: '2026-04-12', order: 1 },
      { id: 'tsk-fin-2', title: 'Formalizar leitura gerencial mensal', status: 'todo', assignee_id: 'user-fin-2', due_date: '2026-04-25', order: 2 },
    ],
    risk_level: 'medium',
    risk_description: 'Rateios e fronteiras econômicas ainda em estabilização',
    mitigation_plan: 'Revisão mensal com direção e trilha documental de decisões',
    owner_id: 'user-fin-1',
    sponsor_id: 'sponsor-direcao',
    responsible: 'Financeiro',
    due_date: '2026-06-30',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
]

export const mockAreas = [
  { id: 'rh', name: 'RH / Pessoas' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'pd', name: 'P&D / Produto / Dados' },
  { id: 'operacoes', name: 'Operação' },
  { id: 'cs', name: 'CS / Relacionamento' },
  { id: 'comercial', name: 'Comercial' },
  { id: 'financeiro', name: 'Financeiro' },
]

function resolveActionPlansSource(action: string): 'supabase' | 'mock' {
  if (isSupabaseConfigured()) {
    return 'supabase'
  }

  console.warn(`[action-plans] Supabase unavailable — using mock fallback for ${action}.`)
  return 'mock'
}

function mapDbToActionPlan(row: Record<string, unknown>): ActionPlan {
  const { where_location, ...rest } = row as Record<string, unknown> & { where_location?: string }
  return { ...rest, where: where_location ?? null } as unknown as ActionPlan
}

export async function fetchActionPlans(): Promise<ActionPlan[]> {
  if (resolveActionPlansSource('fetchActionPlans') === 'mock') {
    return mockPlans
  }

  try {
    const { data, error } = await supabase
      .from('action_plans')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(mapDbToActionPlan)
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[action-plans] Supabase request failed, falling back to DEV mock data.')
      return mockPlans
    }

    throw error
  }
}

export async function createActionPlan(plan: Partial<ActionPlanFormData>): Promise<ActionPlan> {
  const createMockActionPlan = (): ActionPlan => {
    const newPlan: ActionPlan = {
      id: String(Date.now()),
      title: plan.title || 'Novo Plano',
      description: plan.description || null,
      area_id: plan.area_id || null,
      area_name: mockAreas.find(a => a.id === plan.area_id)?.name,
      parent_plan_id: plan.parent_plan_id || null,
      linked_kpis: plan.linked_kpis || [],
      linked_goals: plan.linked_goals || [],
      status: plan.status || 'draft',
      priority: plan.priority || 'medium',
      health: plan.health || 'on_track',
      pdca_phase: plan.pdca_phase || 'plan',
      pdca_history: [],
      what: plan.what || null,
      why: plan.why || null,
      where: plan.where || null,
      when_start: plan.when_start || null,
      when_end: plan.when_end || null,
      who_responsible: plan.who_responsible || null,
      who_team: plan.who_team || [],
      how: plan.how || null,
      how_much: plan.how_much || null,
      progress: 0,
      milestones: [],
      tasks: [],
      risk_level: plan.risk_level || 'low',
      risk_description: plan.risk_description || null,
      mitigation_plan: plan.mitigation_plan || null,
      owner_id: null,
      sponsor_id: null,
      responsible: plan.responsible || plan.who_responsible || null,
      due_date: plan.due_date || plan.when_end || null,
      completed_at: null,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockPlans.unshift(newPlan)
    return newPlan
  }

  if (resolveActionPlansSource('createActionPlan') === 'mock') {
    return createMockActionPlan()
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) throw new Error('Usuário não autenticado')

    const { where: whereField, ...planRest } = plan as Partial<ActionPlanFormData> & { where?: string }
    const { data, error } = await supabase
      .from('action_plans')
      .insert([
        {
          ...planRest,
          where_location: whereField || null,
          description: plan.description || null,
          responsible: plan.responsible || null,
          due_date: plan.due_date || null,
          completed_at: null,
          user_id: userData.user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return mapDbToActionPlan(data)
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[action-plans] Supabase request failed, using DEV mock create.')
      return createMockActionPlan()
    }

    throw error
  }
}

export async function updateActionPlan(id: string, plan: Partial<ActionPlanFormData>): Promise<ActionPlan> {
  const updateMockActionPlan = (): ActionPlan => {
    const index = mockPlans.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Plano não encontrado')

    mockPlans[index] = {
      ...mockPlans[index],
      ...plan,
      updated_at: new Date().toISOString(),
    }
    return mockPlans[index]
  }

  if (resolveActionPlansSource('updateActionPlan') === 'mock') {
    return updateMockActionPlan()
  }

  try {
    const { where: whereField, ...planRest } = plan as Partial<ActionPlanFormData> & { where?: string }
    const dbUpdate = whereField !== undefined
      ? { ...planRest, where_location: whereField }
      : planRest
    const { data, error } = await supabase
      .from('action_plans')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return mapDbToActionPlan(data)
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[action-plans] Supabase request failed, using DEV mock update.')
      return updateMockActionPlan()
    }

    throw error
  }
}

export async function deleteActionPlan(id: string): Promise<void> {
  const deleteMockActionPlan = () => {
    const index = mockPlans.findIndex((p) => p.id === id)
    if (index !== -1) {
      mockPlans.splice(index, 1)
    }
    return
  }

  if (resolveActionPlansSource('deleteActionPlan') === 'mock') {
    deleteMockActionPlan()
    return
  }

  try {
    const { error } = await supabase
      .from('action_plans')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[action-plans] Supabase request failed, using DEV mock delete.')
      deleteMockActionPlan()
      return
    }

    throw error
  }
}

// Calcular estatísticas do portfólio
export function calculatePortfolioStats(plans: ActionPlan[]): PortfolioStats {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const byStatus: Record<ActionPlanStatus, number> = {
    draft: 0,
    planned: 0,
    in_progress: 0,
    blocked: 0,
    completed: 0,
    cancelled: 0,
  }
  
  const byHealth: Record<ActionPlanHealth, number> = {
    on_track: 0,
    at_risk: 0,
    off_track: 0,
  }
  
  const byPriority: Record<ActionPlanPriority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  }
  
  const areaCount: Record<string, { area_id: string; area_name: string; count: number }> = {}
  
  let overdue = 0
  let dueSoon = 0
  let totalProgress = 0
  
  plans.forEach(plan => {
    byStatus[plan.status]++
    byHealth[plan.health]++
    byPriority[plan.priority]++
    totalProgress += plan.progress
    
    if (plan.area_id) {
      if (!areaCount[plan.area_id]) {
        areaCount[plan.area_id] = {
          area_id: plan.area_id,
          area_name: plan.area_name || plan.area_id,
          count: 0,
        }
      }
      areaCount[plan.area_id].count++
    }
    
    if (plan.due_date && plan.status !== 'completed' && plan.status !== 'cancelled') {
      const dueDate = new Date(plan.due_date)
      if (dueDate < today) {
        overdue++
      } else {
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays <= 14) {
          dueSoon++
        }
      }
    }
  })
  
  const completed = byStatus.completed
  const total = plans.length
  
  return {
    total,
    byStatus,
    byHealth,
    byPriority,
    byArea: Object.values(areaCount).sort((a, b) => b.count - a.count),
    overdue,
    dueSoon,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    avgProgress: total > 0 ? Math.round(totalProgress / total) : 0,
  }
}

// Buscar áreas disponíveis
export async function fetchAreas(): Promise<{ id: string; name: string }[]> {
  if (resolveActionPlansSource('fetchAreas') === 'mock') {
    return mockAreas
  }

  try {
    const { data, error } = await supabase
      .from('areas')
      .select('id, name')
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    if (import.meta.env.DEV && !isSupabaseConfigured()) {
      console.warn('[action-plans] Supabase request failed, using DEV mock areas.')
      return mockAreas
    }

    throw error
  }
}
