// Types para o Sistema de Planos de Ação por Área

// ============================================================
// ENUMS E STATUS
// ============================================================

export type AreaPlanStatus = 'RASCUNHO' | 'EM_APROVACAO' | 'ATIVO' | 'CONCLUIDO' | 'ARQUIVADO'

export type ActionStatus = 
  | 'PENDENTE'
  | 'EM_ANDAMENTO'
  | 'BLOQUEADA'
  | 'AGUARDANDO_EVIDENCIA'
  | 'EM_VALIDACAO'
  | 'CONCLUIDA'
  | 'CANCELADA'

export type ActionPriority = 'P0' | 'P1' | 'P2'

export type EvidenceStatus = 'PENDENTE' | 'APROVADA_GESTOR' | 'APROVADA' | 'REJEITADA'

export type ApproverRole = 'gestor' | 'direcao'

export type CostType = 'CAPEX' | 'OPEX'

export type OkrStatus = 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'ATENCAO' | 'CONCLUIDO'

export type InitiativeStatus = 'PLANEJADA' | 'EM_ANDAMENTO' | 'BLOQUEADA' | 'CONCLUIDA' | 'CANCELADA'

export type InitiativeType = 'ENT' | 'MET' | 'SIS' | 'ORG' | 'COM'

export type InitiativePriority = 'P0' | 'P1' | 'P2'

export type InitiativeEffort = 'BAIXO' | 'MEDIO' | 'ALTO'

export type RiskLevel = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'

export type OkrPriority = 'Crítica' | 'Alta' | 'Média' | 'Baixa'

// ============================================================
// ENTIDADES BASE
// ============================================================

export interface Area {
  id: string
  slug: string
  name: string
  owner: string | null
  focus: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface Pillar {
  id: string
  code: string
  title: string
  frontier: string | null
  created_at: string
}

export interface Subpillar {
  id: string
  pillar_id: string
  code: string
  title: string
  frontier: string | null
}

export interface CorporateOkr {
  id: string
  pillar_id: string | null
  objective: string
  owner: string | null
  priority: OkrPriority | null
  created_at: string
  pillar?: Pillar
  key_results?: KeyResult[]
}

export interface KeyResult {
  id: string
  okr_id: string
  code: string
  title: string
  target: string | null
  status: OkrStatus
  due_date: string | null
}

export interface AreaOkr {
  id: string
  area_id: string
  objective: string
  status: OkrStatus
  area?: Area
  linked_krs?: KeyResult[]
}

export interface Initiative {
  id: string
  code: string
  title: string
  type: InitiativeType | null
  priority: InitiativePriority | null
  pillar_id: string | null
  okr_code: string | null
  kr_code: string | null
  owner: string | null
  sponsor: string | null
  status: InitiativeStatus
  start_date: string | null
  end_date: string | null
  effort: InitiativeEffort | null
  created_at: string
  updated_at: string
  pillar?: Pillar
}

// ============================================================
// PLANOS DE AÇÃO
// ============================================================

export interface AreaPlan {
  id: string
  area_id: string
  year: number
  title: string
  description: string | null
  status: AreaPlanStatus
  template_id: string | null
  pack_id: string | null
  created_by: string | null
  manager_approved_by: string | null
  manager_approved_at: string | null
  direction_approved_by: string | null
  direction_approved_at: string | null
  created_at: string
  updated_at: string
  area?: Area
  actions?: PlanAction[]
}

export type NodeType = 'macro' | 'area' | 'meta' | 'pilar' | 'acao'

export interface PlanAction {
  id: string
  plan_id: string
  pillar_id: string | null
  area_okr_id: string | null
  initiative_id: string | null
  parent_action_id: string | null
  pack_id: string | null
  program_key: string | null
  objective_key: string | null
  section_id: string | null
  node_type: NodeType
  title: string
  description: string | null
  status: ActionStatus
  priority: ActionPriority
  responsible: string | null
  assigned_to: string | null
  start_date: string | null
  due_date: string | null
  completed_at: string | null
  progress: number
  evidence_required: boolean
  notes: string | null
  cost_estimate: number | null
  cost_actual: number | null
  cost_type: CostType | null
  currency: string
  created_at: string
  updated_at: string
  pillar?: Pillar
  area_okr?: AreaOkr
  initiative?: Initiative
  subtasks?: ActionSubtask[]
  evidences?: ActionEvidence[]
  comments?: ActionComment[]
  dependencies?: ActionDependency[]
  risks?: ActionRisk[]
  children?: PlanAction[]
}

export interface ActionSubtask {
  id: string
  action_id: string
  title: string
  completed: boolean
  completed_at: string | null
  sort_order: number
}

export interface ActionDependency {
  id: string
  action_id: string
  depends_on_action_id: string
  depends_on_action?: PlanAction
}

export interface ActionEvidence {
  id: string
  action_id: string
  filename: string
  storage_path: string
  file_size: number
  mime_type: string
  submitted_by: string | null
  submitted_at: string
  status: EvidenceStatus
  approvals?: EvidenceApproval[]
}

export interface EvidenceApproval {
  id: string
  evidence_id: string
  role: ApproverRole
  decision: 'APROVADO' | 'REJEITADO'
  decided_by: string | null
  decided_at: string
  note: string | null
}

export interface ActionComment {
  id: string
  action_id: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  user_email?: string
  user_role?: string
}

export interface ActionHistory {
  id: string
  action_id: string
  field_changed: string
  old_value: string | null
  new_value: string | null
  changed_by: string | null
  changed_at: string
}

export interface ActionRisk {
  id: string
  action_id: string
  risk_label: string
  risk_level: RiskLevel
  mitigation: string | null
}

// ============================================================
// VIEWS E RESUMOS
// ============================================================

export interface AreaPlanProgress {
  plan_id: string
  area_id: string
  area_name: string
  area_slug: string
  year: number
  plan_title: string
  plan_status: AreaPlanStatus
  total_actions: number
  completed_actions: number
  pending_actions: number
  awaiting_evidence: number
  in_validation: number
  overdue_actions: number
  completion_percentage: number
  total_cost_estimate: number
  total_cost_actual: number
}

export interface AreaPillarProgress {
  area_id: string
  area_name: string
  year: number
  pillar_id: string
  pillar_code: string
  pillar_title: string
  total_actions: number
  completed_actions: number
  completion_percentage: number
}

export interface EvidenceBacklogItem {
  evidence_id: string
  action_id: string
  action_title: string
  filename: string
  evidence_status: EvidenceStatus
  submitted_at: string
  submitted_by: string | null
  area_id: string
  area_name: string
  area_slug: string
  approval_count: number
  manager_approved: boolean
  direction_approved: boolean
}

export interface AreaCostSummary {
  area_id: string
  area_name: string
  year: number
  cost_type: CostType
  action_count: number
  total_estimate: number
  total_actual: number
  variance: number
}

// ============================================================
// DTOs PARA CRIAÇÃO/ATUALIZAÇÃO
// ============================================================

export interface CreateAreaPlanData {
  area_id: string
  year: number
  title: string
  description?: string
  template_id?: string
  hierarchy_structure?: PlanAction[]
}

export interface UpdateAreaPlanData {
  title?: string
  description?: string
}

export interface CreatePlanActionData {
  plan_id: string
  pillar_id?: string
  area_okr_id?: string
  initiative_id?: string
  parent_action_id?: string
  pack_id?: string | null
  program_key?: string | null
  objective_key?: string | null
  section_id?: string | null
  node_type?: NodeType
  title: string
  description?: string
  priority?: ActionPriority
  responsible?: string
  assigned_to?: string
  start_date?: string
  due_date?: string
  evidence_required?: boolean
  cost_estimate?: number
  cost_type?: CostType
}

export interface UpdatePlanActionData {
  pillar_id?: string
  area_okr_id?: string
  initiative_id?: string
  parent_action_id?: string
  pack_id?: string | null
  program_key?: string | null
  objective_key?: string | null
  section_id?: string | null
  node_type?: NodeType
  title?: string
  description?: string
  status?: ActionStatus
  priority?: ActionPriority
  responsible?: string
  assigned_to?: string
  start_date?: string
  due_date?: string
  evidence_required?: boolean
  notes?: string
  cost_estimate?: number
  cost_actual?: number
  cost_type?: CostType
}

export interface CreateSubtaskData {
  action_id: string
  title: string
  sort_order?: number
}

export interface UpdateSubtaskData {
  title?: string
  completed?: boolean
  sort_order?: number
}

export interface CreateEvidenceData {
  action_id: string
  filename: string
  storage_path: string
  file_size: number
  mime_type: string
}

export interface CreateCommentData {
  action_id: string
  content: string
}

export interface UpdateCommentData {
  content: string
}

export interface CreateRiskData {
  action_id: string
  risk_label: string
  risk_level?: RiskLevel
  mitigation?: string
}

export interface UpdateRiskData {
  risk_label?: string
  risk_level?: RiskLevel
  mitigation?: string
}

// ============================================================
// FILTROS E PAGINAÇÃO
// ============================================================

export interface ActionFilters {
  status?: ActionStatus[]
  priority?: ActionPriority[]
  pillar_id?: string
  assigned_to?: string
  overdue?: boolean
  search?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================
// KANBAN
// ============================================================

export interface KanbanColumn {
  id: ActionStatus
  title: string
  actions: PlanAction[]
  color: string
}

export const KANBAN_COLUMNS: { id: ActionStatus; title: string; color: string }[] = [
  { id: 'PENDENTE', title: 'Pendente', color: 'bg-accent' },
  { id: 'EM_ANDAMENTO', title: 'Em Andamento', color: 'bg-primary-100 dark:bg-primary-500/20' },
  { id: 'BLOQUEADA', title: 'Bloqueada', color: 'bg-danger-100 dark:bg-danger-500/20' },
  { id: 'AGUARDANDO_EVIDENCIA', title: 'Aguardando Evidência', color: 'bg-warning-100 dark:bg-warning-500/20' },
  { id: 'EM_VALIDACAO', title: 'Em Validação', color: 'bg-info-100 dark:bg-info-500/20' },
  { id: 'CONCLUIDA', title: 'Concluída', color: 'bg-success-100 dark:bg-success-500/20' },
]

// ============================================================
// HELPERS
// ============================================================

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  BLOQUEADA: 'Bloqueada',
  AGUARDANDO_EVIDENCIA: 'Aguardando Evidência',
  EM_VALIDACAO: 'Em Validação',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
}

export const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  PENDENTE: 'bg-accent text-foreground',
  EM_ANDAMENTO: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400',
  BLOQUEADA: 'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400',
  AGUARDANDO_EVIDENCIA: 'bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400',
  EM_VALIDACAO: 'bg-info-100 text-info-700 dark:bg-info-500/20 dark:text-info-400',
  CONCLUIDA: 'bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-400',
  CANCELADA: 'bg-accent text-muted',
}

export const PRIORITY_LABELS: Record<ActionPriority, string> = {
  P0: 'Crítica',
  P1: 'Alta',
  P2: 'Média',
}

export const PRIORITY_COLORS: Record<ActionPriority, string> = {
  P0: 'bg-danger-100 text-danger-700 border-danger-300 dark:bg-danger-500/20 dark:text-danger-400 dark:border-danger-500/30',
  P1: 'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-500/20 dark:text-warning-400 dark:border-warning-500/30',
  P2: 'bg-info-100 text-info-700 border-info-300 dark:bg-info-500/20 dark:text-info-400 dark:border-info-500/30',
}

export const PLAN_STATUS_LABELS: Record<AreaPlanStatus, string> = {
  RASCUNHO: 'Rascunho',
  EM_APROVACAO: 'Em Aprovação',
  ATIVO: 'Ativo',
  CONCLUIDO: 'Concluído',
  ARQUIVADO: 'Arquivado',
}

export const PLAN_STATUS_COLORS: Record<AreaPlanStatus, string> = {
  RASCUNHO: 'bg-accent text-foreground',
  EM_APROVACAO: 'bg-yellow-100 text-yellow-800',
  ATIVO: 'bg-green-100 text-green-800',
  CONCLUIDO: 'bg-blue-100 text-blue-800',
  ARQUIVADO: 'bg-accent text-muted',
}

export const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
  PENDENTE: 'Pendente',
  APROVADA_GESTOR: 'Aprovada (Gestor)',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
}

export const EVIDENCE_STATUS_COLORS: Record<EvidenceStatus, string> = {
  PENDENTE: 'bg-accent text-foreground',
  APROVADA_GESTOR: 'bg-blue-100 text-blue-800',
  APROVADA: 'bg-green-100 text-green-800',
  REJEITADA: 'bg-red-100 text-red-800',
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  BAIXO: 'Baixo',
  MEDIO: 'Médio',
  ALTO: 'Alto',
  CRITICO: 'Crítico',
}

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  BAIXO: 'bg-green-100 text-green-800',
  MEDIO: 'bg-yellow-100 text-yellow-800',
  ALTO: 'bg-orange-100 text-orange-800',
  CRITICO: 'bg-red-100 text-red-800',
}
