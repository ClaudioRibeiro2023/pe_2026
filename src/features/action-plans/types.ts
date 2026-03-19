import type { BaseEntity } from '@/shared/types'

// Status expandido com mais estados
export type ActionPlanStatus = 'draft' | 'planned' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'

export type ActionPlanPriority = 'low' | 'medium' | 'high' | 'critical'

export type ActionPlanHealth = 'on_track' | 'at_risk' | 'off_track'

export type PDCAPhase = 'plan' | 'do' | 'check' | 'act'

export type RiskLevel = 'low' | 'medium' | 'high'

export type TaskStatus = 'todo' | 'doing' | 'done'

// Entrada do ciclo PDCA
export interface PDCAEntry {
  id: string
  phase: PDCAPhase
  description: string
  findings: string
  actions_taken: string
  date: string
  user_id: string
}

// Marco/Milestone
export interface Milestone {
  id: string
  title: string
  due_date: string
  completed: boolean
  completed_at?: string
}

// Tarefa
export interface Task {
  id: string
  title: string
  status: TaskStatus
  assignee_id: string
  due_date: string
  order: number
}

// Plano de Ação Expandido
export interface ActionPlan extends BaseEntity {
  title: string
  description: string | null
  
  // Vinculações
  area_id: string | null
  area_name?: string
  parent_plan_id: string | null
  linked_kpis: string[]
  linked_goals: string[]
  
  // Status e Prioridade
  status: ActionPlanStatus
  priority: ActionPlanPriority
  health: ActionPlanHealth
  
  // PDCA
  pdca_phase: PDCAPhase
  pdca_history: PDCAEntry[]
  
  // 5W2H
  what: string | null
  why: string | null
  where: string | null
  when_start: string | null
  when_end: string | null
  who_responsible: string | null
  who_team: string[]
  how: string | null
  how_much: number | null
  
  // Progresso
  progress: number
  milestones: Milestone[]
  tasks: Task[]
  
  // Riscos
  risk_level: RiskLevel
  risk_description: string | null
  mitigation_plan: string | null
  
  // Metadados
  owner_id: string | null
  sponsor_id: string | null
  user_id: string
  completed_at: string | null
  
  // Campos legados (compatibilidade)
  responsible: string | null
  due_date: string | null
}

// Formulário expandido com 5W2H
export interface ActionPlanFormData {
  title: string
  description: string
  
  // Vinculações
  area_id: string
  parent_plan_id: string
  linked_kpis: string[]
  linked_goals: string[]
  
  // Status
  status: ActionPlanStatus
  priority: ActionPlanPriority
  health: ActionPlanHealth
  
  // PDCA
  pdca_phase: PDCAPhase
  
  // 5W2H
  what: string
  why: string
  where: string
  when_start: string
  when_end: string
  who_responsible: string
  who_team: string[]
  how: string
  how_much: number
  
  // Riscos
  risk_level: RiskLevel
  risk_description: string
  mitigation_plan: string
  
  // Legado
  responsible: string
  due_date: string
}

// Estatísticas do portfólio
export interface PortfolioStats {
  total: number
  byStatus: Record<ActionPlanStatus, number>
  byHealth: Record<ActionPlanHealth, number>
  byPriority: Record<ActionPlanPriority, number>
  byArea: { area_id: string; area_name: string; count: number }[]
  overdue: number
  dueSoon: number
  completionRate: number
  avgProgress: number
}

// Dados para Kanban
export interface KanbanColumn {
  id: ActionPlanStatus
  title: string
  plans: ActionPlan[]
}

// Dados para Timeline/Gantt
export interface TimelineItem {
  id: string
  title: string
  start: string
  end: string
  progress: number
  health: ActionPlanHealth
  area_name?: string
}

// Dados para Matriz de Riscos
export interface RiskMatrixItem {
  id: string
  title: string
  risk_level: RiskLevel
  probability: RiskLevel
  impact: RiskLevel
  area_name?: string
}
