import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { ActionPlan, ActionPlanFormData, PortfolioStats, ActionPlanStatus, ActionPlanHealth, ActionPlanPriority } from './types'

// Mock data expandido para demo mode
const mockPlans: ActionPlan[] = [
  {
    id: '1',
    title: 'Migração para Cloud AWS',
    description: 'Migrar infraestrutura on-premise para AWS com foco em escalabilidade e redução de custos',
    area_id: 'ti',
    area_name: 'Tecnologia da Informação',
    parent_plan_id: null,
    linked_kpis: ['kpi-1', 'kpi-2'],
    linked_goals: ['goal-1'],
    status: 'in_progress',
    priority: 'critical',
    health: 'at_risk',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-1', phase: 'plan', description: 'Definido escopo e cronograma', findings: '', actions_taken: '', date: '2026-01-05', user_id: 'demo-user' },
      { id: 'pdca-2', phase: 'do', description: 'Iniciada migração fase 1', findings: 'Atraso de 5 dias', actions_taken: 'Alocado recurso adicional', date: '2026-01-20', user_id: 'demo-user' },
    ],
    what: 'Migrar 100% da infraestrutura para AWS',
    why: 'Reduzir custos operacionais em 30% e aumentar disponibilidade',
    where: 'Data Center AWS São Paulo',
    when_start: '2026-01-01',
    when_end: '2026-03-31',
    who_responsible: 'Carlos Mendes',
    who_team: ['João Silva', 'Maria Santos'],
    how: 'Migração em fases: Dev → Homolog → Prod',
    how_much: 150000,
    progress: 45,
    milestones: [
      { id: 'm1', title: 'Ambiente Dev migrado', due_date: '2026-01-15', completed: true, completed_at: '2026-01-14' },
      { id: 'm2', title: 'Ambiente Homolog migrado', due_date: '2026-02-15', completed: false },
      { id: 'm3', title: 'Ambiente Prod migrado', due_date: '2026-03-31', completed: false },
    ],
    tasks: [
      { id: 't1', title: 'Configurar VPC', status: 'done', assignee_id: 'user-1', due_date: '2026-01-10', order: 1 },
      { id: 't2', title: 'Migrar banco de dados', status: 'doing', assignee_id: 'user-2', due_date: '2026-02-01', order: 2 },
      { id: 't3', title: 'Configurar load balancer', status: 'todo', assignee_id: 'user-1', due_date: '2026-02-15', order: 3 },
    ],
    risk_level: 'high',
    risk_description: 'Dependência de fornecedor e janela de manutenção limitada',
    mitigation_plan: 'Plano de rollback documentado e ambiente paralelo',
    owner_id: 'user-1',
    sponsor_id: 'sponsor-1',
    responsible: 'Carlos Mendes',
    due_date: '2026-03-31',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: '2',
    title: 'Programa de Capacitação Digital',
    description: 'Treinar 100% dos colaboradores em ferramentas digitais e metodologias ágeis',
    area_id: 'rh',
    area_name: 'Recursos Humanos',
    parent_plan_id: null,
    linked_kpis: ['kpi-3'],
    linked_goals: ['goal-2'],
    status: 'in_progress',
    priority: 'high',
    health: 'on_track',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-3', phase: 'plan', description: 'Mapeamento de competências', findings: '', actions_taken: '', date: '2026-01-10', user_id: 'demo-user' },
    ],
    what: 'Capacitar 500 colaboradores em ferramentas digitais',
    why: 'Aumentar produtividade e engajamento',
    where: 'Plataforma EAD + Workshops presenciais',
    when_start: '2026-01-15',
    when_end: '2026-06-30',
    who_responsible: 'Ana Paula Costa',
    who_team: ['Pedro Oliveira', 'Lucia Ferreira'],
    how: 'Trilhas de aprendizado personalizadas por área',
    how_much: 85000,
    progress: 72,
    milestones: [
      { id: 'm4', title: 'Turma 1 concluída', due_date: '2026-02-28', completed: true, completed_at: '2026-02-25' },
      { id: 'm5', title: 'Turma 2 concluída', due_date: '2026-04-30', completed: false },
    ],
    tasks: [],
    risk_level: 'low',
    risk_description: 'Baixa adesão inicial',
    mitigation_plan: 'Gamificação e incentivos',
    owner_id: 'user-3',
    sponsor_id: 'sponsor-2',
    responsible: 'Ana Paula Costa',
    due_date: '2026-06-30',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-28T10:00:00Z',
  },
  {
    id: '3',
    title: 'Automação de Processos RPA',
    description: 'Implementar robôs para automatizar processos repetitivos',
    area_id: 'ops',
    area_name: 'Operações',
    parent_plan_id: null,
    linked_kpis: ['kpi-4', 'kpi-5'],
    linked_goals: ['goal-3'],
    status: 'planned',
    priority: 'high',
    health: 'on_track',
    pdca_phase: 'plan',
    pdca_history: [],
    what: 'Automatizar 15 processos críticos',
    why: 'Reduzir erros e tempo de execução',
    where: 'Departamentos Financeiro e Operações',
    when_start: '2026-02-01',
    when_end: '2026-05-31',
    who_responsible: 'Roberto Lima',
    who_team: ['Fernanda Souza'],
    how: 'Mapeamento → Desenvolvimento → Testes → Deploy',
    how_much: 120000,
    progress: 15,
    milestones: [],
    tasks: [],
    risk_level: 'medium',
    risk_description: 'Resistência à mudança',
    mitigation_plan: 'Change management e comunicação',
    owner_id: 'user-4',
    sponsor_id: 'sponsor-1',
    responsible: 'Roberto Lima',
    due_date: '2026-05-31',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '4',
    title: 'Compliance LGPD',
    description: 'Adequação completa à Lei Geral de Proteção de Dados',
    area_id: 'juridico',
    area_name: 'Jurídico',
    parent_plan_id: null,
    linked_kpis: ['kpi-6'],
    linked_goals: ['goal-4'],
    status: 'completed',
    priority: 'critical',
    health: 'on_track',
    pdca_phase: 'act',
    pdca_history: [
      { id: 'pdca-4', phase: 'plan', description: 'Mapeamento de dados pessoais', findings: '', actions_taken: '', date: '2025-10-01', user_id: 'demo-user' },
      { id: 'pdca-5', phase: 'do', description: 'Implementação de controles', findings: '', actions_taken: '', date: '2025-11-15', user_id: 'demo-user' },
      { id: 'pdca-6', phase: 'check', description: 'Auditoria interna', findings: '2 gaps identificados', actions_taken: 'Correções aplicadas', date: '2025-12-20', user_id: 'demo-user' },
      { id: 'pdca-7', phase: 'act', description: 'Monitoramento contínuo', findings: '', actions_taken: '', date: '2026-01-10', user_id: 'demo-user' },
    ],
    what: 'Implementar programa de privacidade',
    why: 'Conformidade legal e proteção de dados',
    where: 'Toda a organização',
    when_start: '2025-10-01',
    when_end: '2026-01-15',
    who_responsible: 'Dra. Mariana Alves',
    who_team: ['TI', 'RH', 'Marketing'],
    how: 'Framework LGPD + Treinamentos + Auditorias',
    how_much: 95000,
    progress: 100,
    milestones: [
      { id: 'm6', title: 'Mapeamento concluído', due_date: '2025-10-31', completed: true, completed_at: '2025-10-28' },
      { id: 'm7', title: 'Controles implementados', due_date: '2025-12-15', completed: true, completed_at: '2025-12-10' },
      { id: 'm8', title: 'Certificação obtida', due_date: '2026-01-15', completed: true, completed_at: '2026-01-12' },
    ],
    tasks: [],
    risk_level: 'low',
    risk_description: '',
    mitigation_plan: '',
    owner_id: 'user-5',
    sponsor_id: 'sponsor-3',
    responsible: 'Dra. Mariana Alves',
    due_date: '2026-01-15',
    completed_at: '2026-01-12T10:00:00Z',
    user_id: 'demo-user',
    created_at: '2025-10-01T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    id: '5',
    title: 'Novo Sistema de Gestão Financeira',
    description: 'Substituir ERP legado por solução moderna integrada',
    area_id: 'financeiro',
    area_name: 'Financeiro',
    parent_plan_id: null,
    linked_kpis: ['kpi-7'],
    linked_goals: ['goal-5'],
    status: 'blocked',
    priority: 'high',
    health: 'off_track',
    pdca_phase: 'do',
    pdca_history: [
      { id: 'pdca-8', phase: 'plan', description: 'RFP e seleção de fornecedor', findings: '', actions_taken: '', date: '2025-11-01', user_id: 'demo-user' },
      { id: 'pdca-9', phase: 'do', description: 'Início da implementação', findings: 'Bloqueio por dependência de TI', actions_taken: 'Aguardando migração cloud', date: '2026-01-20', user_id: 'demo-user' },
    ],
    what: 'Implementar novo ERP financeiro',
    why: 'Modernização e integração de processos',
    where: 'Departamento Financeiro',
    when_start: '2025-11-01',
    when_end: '2026-04-30',
    who_responsible: 'Paulo Henrique',
    who_team: ['Equipe Financeira', 'TI'],
    how: 'Implementação em fases com consultoria especializada',
    how_much: 280000,
    progress: 25,
    milestones: [
      { id: 'm9', title: 'Fornecedor selecionado', due_date: '2025-12-15', completed: true, completed_at: '2025-12-10' },
      { id: 'm10', title: 'Módulo Contábil', due_date: '2026-02-28', completed: false },
    ],
    tasks: [],
    risk_level: 'high',
    risk_description: 'Dependência da migração cloud e integração com sistemas legados',
    mitigation_plan: 'Plano de contingência com sistema paralelo',
    owner_id: 'user-6',
    sponsor_id: 'sponsor-1',
    responsible: 'Paulo Henrique',
    due_date: '2026-04-30',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: '6',
    title: 'Expansão Comercial Região Sul',
    description: 'Abrir 3 novas filiais na região Sul do Brasil',
    area_id: 'comercial',
    area_name: 'Comercial',
    parent_plan_id: null,
    linked_kpis: ['kpi-8', 'kpi-9'],
    linked_goals: ['goal-6'],
    status: 'in_progress',
    priority: 'medium',
    health: 'on_track',
    pdca_phase: 'do',
    pdca_history: [],
    what: 'Abrir filiais em Curitiba, Florianópolis e Porto Alegre',
    why: 'Aumentar market share na região Sul',
    where: 'PR, SC, RS',
    when_start: '2026-01-01',
    when_end: '2026-08-31',
    who_responsible: 'Marcos Vieira',
    who_team: ['Equipe Comercial Sul'],
    how: 'Estudo de mercado → Locação → Contratação → Inauguração',
    how_much: 450000,
    progress: 35,
    milestones: [
      { id: 'm11', title: 'Curitiba inaugurada', due_date: '2026-03-31', completed: false },
      { id: 'm12', title: 'Florianópolis inaugurada', due_date: '2026-06-30', completed: false },
      { id: 'm13', title: 'Porto Alegre inaugurada', due_date: '2026-08-31', completed: false },
    ],
    tasks: [],
    risk_level: 'medium',
    risk_description: 'Dificuldade de contratação local',
    mitigation_plan: 'Parceria com consultorias de RH locais',
    owner_id: 'user-7',
    sponsor_id: 'sponsor-2',
    responsible: 'Marcos Vieira',
    due_date: '2026-08-31',
    completed_at: null,
    user_id: 'demo-user',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
]

// Áreas disponíveis
export const mockAreas = [
  { id: 'ti', name: 'Tecnologia da Informação' },
  { id: 'rh', name: 'Recursos Humanos' },
  { id: 'ops', name: 'Operações' },
  { id: 'juridico', name: 'Jurídico' },
  { id: 'financeiro', name: 'Financeiro' },
  { id: 'comercial', name: 'Comercial' },
  { id: 'marketing', name: 'Marketing' },
]

export async function fetchActionPlans(): Promise<ActionPlan[]> {
  if (!isSupabaseConfigured()) {
    return mockPlans
  }

  const { data, error } = await supabase
    .from('action_plans')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createActionPlan(plan: Partial<ActionPlanFormData>): Promise<ActionPlan> {
  if (!isSupabaseConfigured()) {
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

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!userData.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('action_plans')
    .insert([
      {
        ...plan,
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
  return data
}

export async function updateActionPlan(id: string, plan: Partial<ActionPlanFormData>): Promise<ActionPlan> {
  if (!isSupabaseConfigured()) {
    const index = mockPlans.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Plano não encontrado')
    
    mockPlans[index] = {
      ...mockPlans[index],
      ...plan,
      updated_at: new Date().toISOString(),
    }
    return mockPlans[index]
  }

  const { data, error } = await supabase
    .from('action_plans')
    .update(plan)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteActionPlan(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const index = mockPlans.findIndex((p) => p.id === id)
    if (index !== -1) {
      mockPlans.splice(index, 1)
    }
    return
  }

  const { error } = await supabase
    .from('action_plans')
    .delete()
    .eq('id', id)

  if (error) throw error
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
  if (!isSupabaseConfigured()) {
    return mockAreas
  }
  
  const { data, error } = await supabase
    .from('areas')
    .select('id, name')
    .order('name')
  
  if (error) throw error
  return data || mockAreas
}
