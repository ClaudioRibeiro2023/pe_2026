/**
 * API Mock Completa para o Módulo de Planos de Ação
 * Todas operações CRUD funcionam 100% localmente com mockStore
 */

import { mockStore, generateId, now } from './utils/mockData'
import './utils/mockActions' // Carrega os dados mock de ações
import type {
  Area, AreaPlan, PlanAction, ActionSubtask, ActionEvidence,
  ActionComment, ActionHistory, ActionRisk, Pillar, Subpillar, AreaOkr, Initiative,
  CorporateOkr, KeyResult, Motor, StrategicTheme, StrategicRisk, FinancialScenario,
  AreaPlanProgress, AreaPillarProgress, EvidenceBacklogItem,
  CreateAreaPlanData, UpdateAreaPlanData, CreatePlanActionData, UpdatePlanActionData,
  CreateSubtaskData, UpdateSubtaskData, CreateEvidenceData,
  CreateCommentData, UpdateCommentData, CreateRiskData, UpdateRiskData, ActionFilters,
  ActionStatus,
} from './types'

 const CANONICAL_ID_BY_LEGACY_ID: Record<string, string> = {
  'area-mkt': 'area-marketing',
  'area-ops': 'area-operacoes',
  'plan-mkt-2026': 'plan-marketing-2026',
  'plan-ops-2026': 'plan-operacoes-2026',
  'pack-mkt-2026': 'pack-marketing-2026',
  'pack-ops-2026': 'pack-operacoes-2026',
  'area-okr-mkt-1': 'area-okr-marketing-1',
  'area-okr-mkt-2': 'area-okr-marketing-2',
  'area-okr-ops-1': 'area-okr-operacoes-1',
  'area-okr-ops-2': 'area-okr-operacoes-2',
 }

 function normalizeMockId(id: string | null | undefined): string | null | undefined {
  if (!id) return id
  return CANONICAL_ID_BY_LEGACY_ID[id] ?? id
 }

 function matchesMockId(candidate: string | null | undefined, requested: string | null | undefined): boolean {
  return normalizeMockId(candidate) === normalizeMockId(requested)
 }

 function normalizeActionReferences(action: PlanAction): PlanAction {
  return {
    ...action,
    plan_id: normalizeMockId(action.plan_id) || action.plan_id,
    area_okr_id: normalizeMockId(action.area_okr_id) || action.area_okr_id,
    pack_id: normalizeMockId(action.pack_id) || action.pack_id,
  }
 }

// ============================================================
// ÁREAS
// ============================================================

export async function fetchAreas(): Promise<Area[]> {
  console.info('[Mock API] fetchAreas')
  return [...mockStore.areas]
}

export async function fetchAreaBySlug(slug: string): Promise<Area | null> {
  console.info('[Mock API] fetchAreaBySlug:', slug)
  return mockStore.areas.find(a => a.slug === slug) || null
}

// ============================================================
// PILARES
// ============================================================

export async function fetchPillars(): Promise<Pillar[]> {
  console.info('[Mock API] fetchPillars')
  return [...mockStore.pillars]
}

// ============================================================
// OKRs DA ÁREA
// ============================================================

export async function fetchAreaOkrs(areaId: string): Promise<AreaOkr[]> {
  console.info('[Mock API] fetchAreaOkrs:', areaId)
  return mockStore.areaOkrs.filter(o => matchesMockId(o.area_id, areaId))
}

// ============================================================
// INICIATIVAS
// ============================================================

export async function fetchInitiatives(): Promise<Initiative[]> {
  console.info('[Mock API] fetchInitiatives')
  return mockStore.initiatives.map(init => ({
    ...init,
    pillar: mockStore.pillars.find(p => p.id === init.pillar_id),
  }))
}

// ============================================================
// PLANOS DE AÇÃO
// ============================================================

export async function fetchAreaPlans(year?: number): Promise<AreaPlan[]> {
  console.info('[Mock API] fetchAreaPlans:', year)
  let plans = [...mockStore.plans]
  if (year) {
    plans = plans.filter(p => p.year === year)
  }
  return plans.map(plan => ({
    ...plan,
    area: mockStore.areas.find(a => a.id === plan.area_id),
  }))
}

export async function fetchAreaPlanByAreaSlug(areaSlug: string, year: number): Promise<AreaPlan | null> {
  console.info('[Mock API] fetchAreaPlanByAreaSlug:', areaSlug, year)
  const area = mockStore.areas.find(a => a.slug === areaSlug)
  if (!area) return null
  const plan = mockStore.plans.find(p => p.area_id === area.id && p.year === year)
  if (!plan) return null
  return { ...plan, area }
}

export async function fetchAreaPlanById(planId: string): Promise<AreaPlan | null> {
  console.info('[Mock API] fetchAreaPlanById:', planId)
  const plan = mockStore.plans.find(p => matchesMockId(p.id, planId))
  if (!plan) return null
  return { ...plan, area: mockStore.areas.find(a => a.id === plan.area_id) }
}

export async function createAreaPlan(data: CreateAreaPlanData & { pack_id?: string }): Promise<AreaPlan> {
  console.info('[Mock API] createAreaPlan:', data)
  const newPlan: AreaPlan = {
    id: generateId('plan'),
    area_id: data.area_id,
    year: data.year,
    title: data.title,
    description: data.description || null,
    status: 'RASCUNHO',
    template_id: data.template_id || null,
    pack_id: normalizeMockId(data.pack_id) || null,
    created_by: 'mock-user',
    manager_approved_by: null,
    manager_approved_at: null,
    direction_approved_by: null,
    direction_approved_at: null,
    created_at: now(),
    updated_at: now(),
    area: mockStore.areas.find(a => a.id === data.area_id),
  }
  mockStore.plans.push(newPlan)
  return newPlan
}

export async function getOrCreatePlanForPack(params: {
  areaSlug: string
  areaName: string
  year: number
  packId: string
}): Promise<AreaPlan> {
  console.info('[Mock API] getOrCreatePlanForPack:', params)
  
  // Buscar área pelo slug
  const area = mockStore.areas.find(a => a.slug === params.areaSlug)
  if (!area) {
    throw new Error(`Área não encontrada: ${params.areaSlug}`)
  }
  
  // Buscar plano existente por (area_id, year, pack_id)
  const existingPlan = mockStore.plans.find(
    p => p.area_id === area.id && p.year === params.year && matchesMockId(p.pack_id, params.packId)
  )
  
  if (existingPlan) {
    console.info('[Mock API] Plano existente encontrado:', existingPlan.id)
    return { ...existingPlan, area }
  }
  
  // Criar novo plano vinculado ao pack
  const newPlan = await createAreaPlan({
    area_id: area.id,
    year: params.year,
    title: `Plano ${params.areaName} ${params.year} - Strategic Pack`,
    description: `Plano gerado a partir do Strategic Pack ${params.year}`,
    pack_id: params.packId,
  })
  
  console.info('[Mock API] Novo plano criado:', newPlan.id)
  return newPlan
}

export async function fetchPlanByPackId(packId: string): Promise<AreaPlan | null> {
  console.info('[Mock API] fetchPlanByPackId:', packId)
  const plan = mockStore.plans.find(p => matchesMockId(p.pack_id, packId))
  if (!plan) return null
  return { ...plan, area: mockStore.areas.find(a => a.id === plan.area_id) }
}

export async function updateAreaPlan(planId: string, data: UpdateAreaPlanData): Promise<AreaPlan> {
  console.info('[Mock API] updateAreaPlan:', planId, data)
  const index = mockStore.plans.findIndex(p => matchesMockId(p.id, planId))
  if (index === -1) throw new Error('Plano não encontrado')
  mockStore.plans[index] = {
    ...mockStore.plans[index],
    ...data,
    updated_at: now(),
  }
  return { ...mockStore.plans[index], area: mockStore.areas.find(a => a.id === mockStore.plans[index].area_id) }
}

export async function deleteAreaPlan(planId: string): Promise<void> {
  console.info('[Mock API] deleteAreaPlan:', planId)
  const index = mockStore.plans.findIndex(p => matchesMockId(p.id, planId))
  if (index !== -1) mockStore.plans.splice(index, 1)
}

// ============================================================
// APROVAÇÃO DE PLANOS
// ============================================================

export async function approvePlanAsManager(planId: string): Promise<{ success: boolean; message?: string }> {
  console.info('[Mock API] approvePlanAsManager:', planId)
  const index = mockStore.plans.findIndex(p => matchesMockId(p.id, planId))
  if (index === -1) return { success: false, message: 'Plano não encontrado' }
  mockStore.plans[index].manager_approved_by = 'mock-manager'
  mockStore.plans[index].manager_approved_at = now()
  mockStore.plans[index].status = 'EM_APROVACAO'
  mockStore.plans[index].updated_at = now()
  return { success: true, message: 'Aprovado pelo gestor' }
}

export async function approvePlanAsDirection(planId: string): Promise<{ success: boolean; message?: string }> {
  console.info('[Mock API] approvePlanAsDirection:', planId)
  const index = mockStore.plans.findIndex(p => matchesMockId(p.id, planId))
  if (index === -1) return { success: false, message: 'Plano não encontrado' }
  mockStore.plans[index].direction_approved_by = 'mock-director'
  mockStore.plans[index].direction_approved_at = now()
  mockStore.plans[index].status = 'ATIVO'
  mockStore.plans[index].updated_at = now()
  return { success: true, message: 'Aprovado pela direção' }
}

export async function rejectPlan(planId: string, reason?: string): Promise<{ success: boolean; message?: string }> {
  console.info('[Mock API] rejectPlan:', planId, reason)
  const index = mockStore.plans.findIndex(p => matchesMockId(p.id, planId))
  if (index === -1) return { success: false, message: 'Plano não encontrado' }
  mockStore.plans[index].status = 'RASCUNHO'
  mockStore.plans[index].updated_at = now()
  return { success: true, message: reason || 'Plano rejeitado' }
}

// ============================================================
// AÇÕES
// ============================================================

export async function fetchPlanActions(
  planId: string, 
  filters?: ActionFilters,
  pagination?: { page: number; limit: number }
): Promise<PlanAction[] | { data: PlanAction[]; total: number }> {
  console.info('[Mock API] fetchPlanActions:', planId, filters, pagination)
  let actions = mockStore.actions.filter(a => matchesMockId(a.plan_id, planId))
  
  if (filters) {
    if (filters.status?.length) actions = actions.filter(a => filters.status!.includes(a.status))
    if (filters.priority?.length) actions = actions.filter(a => filters.priority!.includes(a.priority))
    if (filters.pillar_id) actions = actions.filter(a => a.pillar_id === filters.pillar_id)
    if (filters.assigned_to) actions = actions.filter(a => a.assigned_to === filters.assigned_to)
    if (filters.overdue) {
      const today = new Date().toISOString().split('T')[0]
      actions = actions.filter(a => a.due_date && a.due_date < today && a.status !== 'CONCLUIDA')
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      actions = actions.filter(a => a.title.toLowerCase().includes(search) || a.description?.toLowerCase().includes(search))
    }
  }
  
  const enrichedActions = actions.map(action => ({
    ...normalizeActionReferences(action),
    pillar: mockStore.pillars.find(p => p.id === action.pillar_id),
    subtasks: mockStore.subtasks.filter(s => s.action_id === action.id),
  }))
  
  // Se paginação solicitada, retorna formato paginado
  if (pagination) {
    const start = (pagination.page - 1) * pagination.limit
    const paginatedData = enrichedActions.slice(start, start + pagination.limit)
    return { data: paginatedData, total: enrichedActions.length }
  }
  
  return enrichedActions
}

export async function fetchActionById(actionId: string): Promise<PlanAction | null> {
  console.info('[Mock API] fetchActionById:', actionId)
  const action = mockStore.actions.find(a => a.id === actionId)
  if (!action) return null
  return {
    ...normalizeActionReferences(action),
    pillar: mockStore.pillars.find(p => p.id === action.pillar_id),
    subtasks: mockStore.subtasks.filter(s => s.action_id === action.id),
    evidences: mockStore.evidences.filter(e => e.action_id === action.id),
    comments: mockStore.comments.filter(c => c.action_id === action.id),
    risks: mockStore.risks.filter(r => r.action_id === action.id),
  }
}

export async function createPlanAction(data: CreatePlanActionData): Promise<PlanAction> {
  console.info('[Mock API] createPlanAction:', data)
  const newAction: PlanAction = {
    id: generateId('action'),
    plan_id: normalizeMockId(data.plan_id) || data.plan_id,
    pillar_id: data.pillar_id || null,
    area_okr_id: normalizeMockId(data.area_okr_id) || null,
    initiative_id: data.initiative_id || null,
    parent_action_id: data.parent_action_id || null,
    pack_id: normalizeMockId(data.pack_id) || null,
    program_key: data.program_key || null,
    objective_key: data.objective_key || null,
    section_id: data.section_id || null,
    node_type: data.node_type || 'acao',
    title: data.title,
    description: data.description || null,
    status: 'PENDENTE',
    priority: data.priority || 'P2',
    responsible: data.responsible || null,
    assigned_to: data.assigned_to || null,
    start_date: data.start_date || null,
    due_date: data.due_date || null,
    completed_at: null,
    progress: 0,
    evidence_required: data.evidence_required ?? true,
    notes: null,
    cost_estimate: data.cost_estimate || null,
    cost_actual: null,
    cost_type: data.cost_type || null,
    currency: 'BRL',
    created_at: now(),
    updated_at: now(),
  }
  mockStore.actions.push(newAction)
  
  // Adicionar ao histórico
  mockStore.history.push({
    id: generateId('history'),
    action_id: newAction.id,
    field_changed: 'status',
    old_value: null,
    new_value: 'PENDENTE',
    changed_by: 'mock-user',
    changed_at: now(),
  })
  
  return normalizeActionReferences(newAction)
}

export async function updatePlanAction(actionId: string, data: UpdatePlanActionData): Promise<PlanAction> {
  console.info('[Mock API] updatePlanAction:', actionId, data)
  const index = mockStore.actions.findIndex(a => a.id === actionId)
  if (index === -1) throw new Error('Ação não encontrada')
  
  const oldAction = { ...mockStore.actions[index] }
  mockStore.actions[index] = {
    ...mockStore.actions[index],
    ...data,
    area_okr_id: normalizeMockId(data.area_okr_id) || (data.area_okr_id === null ? null : mockStore.actions[index].area_okr_id),
    pack_id: normalizeMockId(data.pack_id) || (data.pack_id === null ? null : mockStore.actions[index].pack_id),
    updated_at: now(),
  }
  
  // Registrar mudanças no histórico
  Object.keys(data).forEach(key => {
    const oldVal = (oldAction as Record<string, unknown>)[key]
    const newVal = (data as Record<string, unknown>)[key]
    if (oldVal !== newVal) {
      mockStore.history.push({
        id: generateId('history'),
        action_id: actionId,
        field_changed: key,
        old_value: String(oldVal ?? ''),
        new_value: String(newVal ?? ''),
        changed_by: 'mock-user',
        changed_at: now(),
      })
    }
  })
  
  return normalizeActionReferences(mockStore.actions[index])
}

export async function deletePlanAction(actionId: string): Promise<void> {
  console.info('[Mock API] deletePlanAction:', actionId)
  const index = mockStore.actions.findIndex(a => a.id === actionId)
  if (index !== -1) mockStore.actions.splice(index, 1)
  // Também remove subtasks, evidências, comentários e riscos
  mockStore.subtasks = mockStore.subtasks.filter(s => s.action_id !== actionId)
  mockStore.evidences = mockStore.evidences.filter(e => e.action_id !== actionId)
  mockStore.comments = mockStore.comments.filter(c => c.action_id !== actionId)
  mockStore.risks = mockStore.risks.filter(r => r.action_id !== actionId)
}

export async function updateActionStatus(actionId: string, status: string): Promise<PlanAction> {
  console.info('[Mock API] updateActionStatus:', actionId, status)
  return updatePlanAction(actionId, { status: status as ActionStatus })
}

export async function fetchActionsByPackId(packId: string): Promise<PlanAction[]> {
  console.info('[Mock API] fetchActionsByPackId:', packId)
  return mockStore.actions
    .filter(a => matchesMockId(a.pack_id, packId))
    .map(action => normalizeActionReferences(action))
}

export async function fetchActionsByProgramKey(packId: string, programKey: string): Promise<PlanAction[]> {
  console.info('[Mock API] fetchActionsByProgramKey:', packId, programKey)
  return mockStore.actions
    .filter(a => matchesMockId(a.pack_id, packId) && a.program_key === programKey)
    .map(action => normalizeActionReferences(action))
}

export async function fetchActionsByObjectiveKey(packId: string, objectiveKey: string): Promise<PlanAction[]> {
  console.info('[Mock API] fetchActionsByObjectiveKey:', packId, objectiveKey)
  return mockStore.actions
    .filter(a => matchesMockId(a.pack_id, packId) && a.objective_key === objectiveKey)
    .map(action => normalizeActionReferences(action))
}

// ============================================================
// SUBTAREFAS
// ============================================================

export async function fetchSubtasks(actionId: string): Promise<ActionSubtask[]> {
  console.info('[Mock API] fetchSubtasks:', actionId)
  return mockStore.subtasks.filter(s => s.action_id === actionId).sort((a, b) => a.sort_order - b.sort_order)
}

export async function createSubtask(data: CreateSubtaskData): Promise<ActionSubtask> {
  console.info('[Mock API] createSubtask:', data)
  const maxOrder = Math.max(0, ...mockStore.subtasks.filter(s => s.action_id === data.action_id).map(s => s.sort_order))
  const newSubtask: ActionSubtask = {
    id: generateId('subtask'),
    action_id: data.action_id,
    title: data.title,
    completed: false,
    completed_at: null,
    sort_order: data.sort_order ?? maxOrder + 1,
  }
  mockStore.subtasks.push(newSubtask)
  return newSubtask
}

export async function updateSubtask(subtaskId: string, data: UpdateSubtaskData): Promise<ActionSubtask> {
  console.info('[Mock API] updateSubtask:', subtaskId, data)
  const index = mockStore.subtasks.findIndex(s => s.id === subtaskId)
  if (index === -1) throw new Error('Subtarefa não encontrada')
  mockStore.subtasks[index] = { ...mockStore.subtasks[index], ...data }
  if (data.completed !== undefined) {
    mockStore.subtasks[index].completed_at = data.completed ? now() : null
  }
  return mockStore.subtasks[index]
}

export async function deleteSubtask(subtaskId: string): Promise<void> {
  console.info('[Mock API] deleteSubtask:', subtaskId)
  const index = mockStore.subtasks.findIndex(s => s.id === subtaskId)
  if (index !== -1) mockStore.subtasks.splice(index, 1)
}

export async function toggleSubtask(subtaskId: string, completed: boolean): Promise<ActionSubtask> {
  console.info('[Mock API] toggleSubtask:', subtaskId, completed)
  return updateSubtask(subtaskId, { completed })
}

// ============================================================
// EVIDÊNCIAS
// ============================================================

export async function fetchEvidences(actionId: string): Promise<ActionEvidence[]> {
  console.info('[Mock API] fetchEvidences:', actionId)
  return mockStore.evidences.filter(e => e.action_id === actionId)
}

export async function createEvidence(data: CreateEvidenceData): Promise<ActionEvidence> {
  console.info('[Mock API] createEvidence:', data)
  const newEvidence: ActionEvidence = {
    id: generateId('evidence'),
    action_id: data.action_id,
    filename: data.filename,
    storage_path: data.storage_path,
    file_size: data.file_size,
    mime_type: data.mime_type,
    submitted_by: 'mock-user',
    submitted_at: now(),
    status: 'PENDENTE',
  }
  mockStore.evidences.push(newEvidence)
  return newEvidence
}

export async function uploadEvidence(actionId: string, file: File): Promise<ActionEvidence> {
  console.info('[Mock API] uploadEvidence:', actionId, file.name)
  // Simula upload - apenas cria registro
  return createEvidence({
    action_id: actionId,
    filename: file.name,
    storage_path: `/mock-uploads/${actionId}/${file.name}`,
    file_size: file.size,
    mime_type: file.type,
  })
}

export async function deleteEvidence(evidenceId: string): Promise<void> {
  console.info('[Mock API] deleteEvidence:', evidenceId)
  const index = mockStore.evidences.findIndex(e => e.id === evidenceId)
  if (index !== -1) mockStore.evidences.splice(index, 1)
}

export async function approveEvidenceAsManager(evidenceId: string, note?: string): Promise<{ success: boolean; message?: string }> {
  console.info('[Mock API] approveEvidenceAsManager:', evidenceId)
  const index = mockStore.evidences.findIndex(e => e.id === evidenceId)
  if (index === -1) return { success: false, message: 'Evidência não encontrada' }
  mockStore.evidences[index].status = 'APROVADA_GESTOR'
  return { success: true, message: note || 'Aprovado pelo gestor' }
}

export async function approveEvidenceAsDirection(evidenceId: string, note?: string): Promise<{ success: boolean; message?: string }> {
  console.info('[Mock API] approveEvidenceAsDirection:', evidenceId)
  const index = mockStore.evidences.findIndex(e => e.id === evidenceId)
  if (index === -1) return { success: false, message: 'Evidência não encontrada' }
  mockStore.evidences[index].status = 'APROVADA'
  return { success: true, message: note || 'Aprovado pela direção' }
}

export async function rejectEvidence(evidenceId: string, _role?: string, reason?: string): Promise<{ success: boolean; message?: string }> {
  console.info('[Mock API] rejectEvidence:', evidenceId, reason)
  const index = mockStore.evidences.findIndex(e => e.id === evidenceId)
  if (index === -1) return { success: false, message: 'Evidência não encontrada' }
  mockStore.evidences[index].status = 'REJEITADA'
  return { success: true, message: reason || 'Evidência rejeitada' }
}

// ============================================================
// COMENTÁRIOS
// ============================================================

export async function fetchComments(actionId: string): Promise<ActionComment[]> {
  console.info('[Mock API] fetchComments:', actionId)
  return mockStore.comments.filter(c => c.action_id === actionId).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function createComment(data: CreateCommentData): Promise<ActionComment> {
  console.info('[Mock API] createComment:', data)
  const newComment: ActionComment = {
    id: generateId('comment'),
    action_id: data.action_id,
    content: data.content,
    user_id: 'mock-user',
    created_at: now(),
    updated_at: now(),
    user_email: 'mock@empresa.com',
    user_role: 'colaborador',
  }
  mockStore.comments.push(newComment)
  return newComment
}

export async function updateComment(commentId: string, data: UpdateCommentData): Promise<ActionComment> {
  console.info('[Mock API] updateComment:', commentId, data)
  const index = mockStore.comments.findIndex(c => c.id === commentId)
  if (index === -1) throw new Error('Comentário não encontrado')
  mockStore.comments[index] = { ...mockStore.comments[index], ...data, updated_at: now() }
  return mockStore.comments[index]
}

export async function deleteComment(commentId: string): Promise<void> {
  console.info('[Mock API] deleteComment:', commentId)
  const index = mockStore.comments.findIndex(c => c.id === commentId)
  if (index !== -1) mockStore.comments.splice(index, 1)
}

// ============================================================
// HISTÓRICO
// ============================================================

export async function fetchActionHistory(actionId: string): Promise<ActionHistory[]> {
  console.info('[Mock API] fetchActionHistory:', actionId)
  return mockStore.history.filter(h => h.action_id === actionId).sort((a, b) => 
    new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
  )
}

// ============================================================
// RISCOS
// ============================================================

export async function fetchActionRisks(actionId: string): Promise<ActionRisk[]> {
  console.info('[Mock API] fetchActionRisks:', actionId)
  return mockStore.risks.filter(r => r.action_id === actionId)
}

export async function createRisk(data: CreateRiskData): Promise<ActionRisk> {
  console.info('[Mock API] createRisk:', data)
  const newRisk: ActionRisk = {
    id: generateId('risk'),
    action_id: data.action_id,
    risk_label: data.risk_label,
    risk_level: data.risk_level || 'MEDIO',
    mitigation: data.mitigation || null,
  }
  mockStore.risks.push(newRisk)
  return newRisk
}

export async function updateRisk(riskId: string, data: UpdateRiskData): Promise<ActionRisk> {
  console.info('[Mock API] updateRisk:', riskId, data)
  const index = mockStore.risks.findIndex(r => r.id === riskId)
  if (index === -1) throw new Error('Risco não encontrado')
  mockStore.risks[index] = { ...mockStore.risks[index], ...data }
  return mockStore.risks[index]
}

export async function deleteRisk(riskId: string): Promise<void> {
  console.info('[Mock API] deleteRisk:', riskId)
  const index = mockStore.risks.findIndex(r => r.id === riskId)
  if (index !== -1) mockStore.risks.splice(index, 1)
}

// Alias para compatibilidade com hooks
export const fetchRisks = fetchActionRisks

// ============================================================
// VIEWS E MÉTRICAS
// ============================================================

export async function fetchAreaPlanProgress(year?: number): Promise<AreaPlanProgress[]> {
  console.info('[Mock API] fetchAreaPlanProgress:', year)
  const currentYear = year || new Date().getFullYear()
  const plans = mockStore.plans.filter(p => p.year === currentYear)
  const today = new Date().toISOString().split('T')[0]
  
  return plans.map(plan => {
    const area = mockStore.areas.find(a => a.id === plan.area_id)!
    const actions = mockStore.actions.filter(a => matchesMockId(a.plan_id, plan.id))
    
    const totalActions = actions.length
    const completedActions = actions.filter(a => a.status === 'CONCLUIDA').length
    const pendingActions = actions.filter(a => ['PENDENTE', 'EM_ANDAMENTO'].includes(a.status)).length
    const awaitingEvidence = actions.filter(a => a.status === 'AGUARDANDO_EVIDENCIA').length
    const inValidation = actions.filter(a => a.status === 'EM_VALIDACAO').length
    const overdueActions = actions.filter(a => a.due_date && a.due_date < today && a.status !== 'CONCLUIDA').length
    const completionPercentage = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0
    const totalCostEstimate = actions.reduce((sum, a) => sum + (a.cost_estimate || 0), 0)
    const totalCostActual = actions.reduce((sum, a) => sum + (a.cost_actual || 0), 0)
    
    return {
      plan_id: plan.id,
      area_id: plan.area_id,
      area_name: area?.name || '',
      area_slug: area?.slug || '',
      year: plan.year,
      plan_title: plan.title,
      plan_status: plan.status,
      total_actions: totalActions,
      completed_actions: completedActions,
      pending_actions: pendingActions,
      awaiting_evidence: awaitingEvidence,
      in_validation: inValidation,
      overdue_actions: overdueActions,
      completion_percentage: completionPercentage,
      total_cost_estimate: totalCostEstimate,
      total_cost_actual: totalCostActual,
    }
  })
}

export async function fetchAreaPillarProgress(areaId: string, year: number): Promise<AreaPillarProgress[]> {
  console.info('[Mock API] fetchAreaPillarProgress:', areaId, year)
  const area = mockStore.areas.find(a => matchesMockId(a.id, areaId))
  const plan = mockStore.plans.find(p => matchesMockId(p.area_id, areaId) && p.year === year)
  if (!plan || !area) return []
  
  const actions = mockStore.actions.filter(a => matchesMockId(a.plan_id, plan.id))
  const pillarMap = new Map<string, AreaPillarProgress>()
  
  mockStore.pillars.forEach(pillar => {
    const pillarActions = actions.filter(a => a.pillar_id === pillar.id)
    if (pillarActions.length > 0) {
      const completed = pillarActions.filter(a => a.status === 'CONCLUIDA').length
      pillarMap.set(pillar.id, {
        area_id: areaId,
        area_name: area.name,
        year,
        pillar_id: pillar.id,
        pillar_code: pillar.code,
        pillar_title: pillar.title,
        total_actions: pillarActions.length,
        completed_actions: completed,
        completion_percentage: Math.round((completed / pillarActions.length) * 100),
      })
    }
  })
  
  return Array.from(pillarMap.values())
}

export async function fetchEvidenceBacklog(): Promise<EvidenceBacklogItem[]> {
  console.info('[Mock API] fetchEvidenceBacklog')
  return mockStore.evidences
    .filter(e => e.status === 'PENDENTE' || e.status === 'APROVADA_GESTOR')
    .map(e => {
      const action = mockStore.actions.find(a => a.id === e.action_id)
      const plan = action ? mockStore.plans.find(p => matchesMockId(p.id, action.plan_id)) : null
      const area = plan ? mockStore.areas.find(a => a.id === plan.area_id) : null
      
      return {
        evidence_id: e.id,
        action_id: e.action_id,
        action_title: action?.title || '',
        filename: e.filename,
        evidence_status: e.status,
        submitted_at: e.submitted_at,
        submitted_by: e.submitted_by,
        area_id: area?.id || '',
        area_name: area?.name || '',
        area_slug: area?.slug || '',
        approval_count: e.status === 'APROVADA_GESTOR' ? 1 : 0,
        manager_approved: e.status === 'APROVADA_GESTOR' || e.status === 'APROVADA',
        direction_approved: e.status === 'APROVADA',
      }
    })
}

export async function fetchPlanStats(planId: string): Promise<{
  total: number
  completed: number
  inProgress: number
  pending: number
  blocked: number
  awaitingEvidence: number
  inValidation: number
  overdue: number
  completionPercentage: number
  totalCostEstimate: number
  totalCostActual: number
}> {
  console.info('[Mock API] fetchPlanStats:', planId)
  const actions = mockStore.actions.filter(a => matchesMockId(a.plan_id, planId))
  const today = new Date().toISOString().split('T')[0]
  const completed = actions.filter(a => a.status === 'CONCLUIDA').length
  
  return {
    total: actions.length,
    completed,
    inProgress: actions.filter(a => a.status === 'EM_ANDAMENTO').length,
    pending: actions.filter(a => a.status === 'PENDENTE').length,
    blocked: actions.filter(a => a.status === 'BLOQUEADA').length,
    awaitingEvidence: actions.filter(a => a.status === 'AGUARDANDO_EVIDENCIA').length,
    inValidation: actions.filter(a => a.status === 'EM_VALIDACAO').length,
    overdue: actions.filter(a => a.due_date && a.due_date < today && a.status !== 'CONCLUIDA').length,
    completionPercentage: actions.length > 0 ? Math.round((completed / actions.length) * 100) : 0,
    totalCostEstimate: actions.reduce((sum, a) => sum + (a.cost_estimate || 0), 0),
    totalCostActual: actions.reduce((sum, a) => sum + (a.cost_actual || 0), 0),
  }
}

// ============================================================
// SUBPILARES
// ============================================================

export async function fetchSubpillars(pillarId?: string): Promise<Subpillar[]> {
  console.info('[Mock API] fetchSubpillars', pillarId ?? 'all')
  if (pillarId) {
    return mockStore.subpillars.filter(sp => sp.pillar_id === pillarId)
  }
  return [...mockStore.subpillars]
}

export async function fetchSubpillarsByPillarCode(pillarCode: string): Promise<Subpillar[]> {
  const pillar = mockStore.pillars.find(p => p.code === pillarCode)
  if (!pillar) return []
  return mockStore.subpillars.filter(sp => sp.pillar_id === pillar.id)
}

// ============================================================
// OKRs CORPORATIVOS + KEY RESULTS
// ============================================================

export async function fetchCorporateOkrs(): Promise<CorporateOkr[]> {
  console.info('[Mock API] fetchCorporateOkrs')
  return mockStore.corporateOkrs.map(okr => ({
    ...okr,
    pillar: mockStore.pillars.find(p => p.id === okr.pillar_id),
    key_results: mockStore.keyResults.filter(kr => kr.okr_id === okr.id),
  }))
}

export async function fetchKeyResults(okrId?: string): Promise<KeyResult[]> {
  console.info('[Mock API] fetchKeyResults', okrId ?? 'all')
  if (okrId) {
    return mockStore.keyResults.filter(kr => kr.okr_id === okrId)
  }
  return [...mockStore.keyResults]
}

export async function fetchKeyResultByCode(code: string): Promise<KeyResult | null> {
  return mockStore.keyResults.find(kr => kr.code === code) ?? null
}

// ============================================================
// MOTORES ESTRATÉGICOS
// ============================================================

export async function fetchMotors(): Promise<Motor[]> {
  console.info('[Mock API] fetchMotors')
  return [...mockStore.motors]
}

export async function fetchMotorByCode(code: string): Promise<Motor | null> {
  return mockStore.motors.find(m => m.code === code) ?? null
}

// ============================================================
// TEMAS ESTRATÉGICOS
// ============================================================

export async function fetchStrategicThemes(): Promise<StrategicTheme[]> {
  console.info('[Mock API] fetchStrategicThemes')
  return [...mockStore.strategicThemes].sort((a, b) => a.priority - b.priority)
}

export async function fetchStrategicThemesByPillar(pillarCode: string): Promise<StrategicTheme[]> {
  return mockStore.strategicThemes.filter(th => th.pillar_codes.includes(pillarCode))
}

// ============================================================
// RISCOS ESTRATÉGICOS
// ============================================================

export async function fetchStrategicRisks(severity?: string): Promise<StrategicRisk[]> {
  console.info('[Mock API] fetchStrategicRisks', severity ?? 'all')
  const order: Record<string, number> = { CRITICO: 0, ALTO: 1, MONITORADO: 2 }
  let risks = [...mockStore.strategicRisks]
  if (severity) {
    risks = risks.filter(r => r.severity === severity)
  }
  return risks.sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9))
}

export async function fetchStrategicRiskByCode(code: string): Promise<StrategicRisk | null> {
  return mockStore.strategicRisks.find(r => r.code === code) ?? null
}

// ============================================================
// CENÁRIOS FINANCEIROS
// ============================================================

export async function fetchFinancialScenarios(): Promise<FinancialScenario[]> {
  console.info('[Mock API] fetchFinancialScenarios')
  return [...mockStore.financialScenarios]
}

export async function fetchReferenceScenario(): Promise<FinancialScenario | null> {
  return mockStore.financialScenarios.find(s => s.is_reference) ?? null
}

export async function fetchFinancialScenarioByCode(code: string): Promise<FinancialScenario | null> {
  return mockStore.financialScenarios.find(s => s.code === code) ?? null
}
