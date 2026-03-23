import { getSupabaseRuntimeState, supabase, assertSupabaseAvailableForProd } from '@/shared/lib/supabaseClient'
import * as mockApi from './api-mock'
import type {
  ActionComment,
  ActionEvidence,
  ActionFilters,
  ActionHistory,
  ActionRisk,
  ActionSubtask,
  Area,
  AreaOkr,
  AreaPillarProgress,
  AreaPlan,
  AreaPlanProgress,
  CreateAreaPlanData,
  CreateCommentData,
  CreateEvidenceData,
  CreatePlanActionData,
  CreateRiskData,
  CreateSubtaskData,
  EvidenceBacklogItem,
  FinancialScenario,
  Initiative,
  KeyResult,
  Motor,
  Pillar,
  Subpillar,
  CorporateOkr,
  StrategicRisk,
  StrategicTheme,
  PlanAction,
  UpdateAreaPlanData,
  UpdateCommentData,
  UpdatePlanActionData,
  UpdateRiskData,
  UpdateSubtaskData,
} from './types'

/**
 * API do Módulo de Planos de Ação
 * 
 * MODO MOCK COMPLETO ATIVO
 * Todas as operações CRUD funcionam 100% localmente com mockStore
 * independente do Supabase.
 * 
 * Para voltar ao modo Supabase, descomente as importações originais
 * e comente a re-exportação do api-mock.
 */

// ============================================================
// MODO MOCK - Re-exporta todas as funções do api-mock.ts
// ============================================================
function resolveAreaPlansSource(operation: string): 'mock' | 'supabase' {
  const state = getSupabaseRuntimeState()

  if (state.shouldUseSupabase) {
    return 'supabase'
  }

  if (state.canUseMockFallback) {
    console.info(`[Area Plans API] ${operation}: usando mock em ${state.environment}`)
    return 'mock'
  }

  // Lança erro explícito — bloqueia fallback silencioso em PROD
  assertSupabaseAvailableForProd(operation)

  const reason = state.isConfigured ? 'serviço inacessível' : 'variáveis de ambiente ausentes'
  throw new Error(`[Area Plans API] ${operation}: Supabase indisponível (${reason})`)
}

export async function fetchAreas(): Promise<Area[]> {
  if (resolveAreaPlansSource('fetchAreas') === 'mock') {
    return mockApi.fetchAreas()
  }

  return fetchAreas_supabase()
}

export async function fetchAreaBySlug(slug: string): Promise<Area | null> {
  if (resolveAreaPlansSource('fetchAreaBySlug') === 'mock') {
    return mockApi.fetchAreaBySlug(slug)
  }

  return fetchAreaBySlug_supabase(slug)
}

// ÁREAS - MODO SUPABASE
export async function fetchAreas_supabase(): Promise<Area[]> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export async function fetchAreaBySlug_supabase(slug: string): Promise<Area | null> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ============================================================
// PILARES
// ============================================================

export async function fetchPillars(): Promise<Pillar[]> {
  if (resolveAreaPlansSource('fetchPillars') === 'mock') {
    return mockApi.fetchPillars()
  }

  const { data, error } = await supabase
    .from('pillars')
    .select('*')
    .order('code')

  if (error) throw error
  return data || []
}

// ============================================================
// OKRs DA ÁREA
// ============================================================

export async function fetchAreaOkrs(areaId: string): Promise<AreaOkr[]> {
  if (resolveAreaPlansSource('fetchAreaOkrs') === 'mock') {
    return mockApi.fetchAreaOkrs(areaId)
  }

  const { data, error } = await supabase
    .from('area_okrs')
    .select('*')
    .eq('area_id', areaId)
    .order('objective')

  if (error) throw error
  return data || []
}

// ============================================================
// INICIATIVAS
// ============================================================

export async function fetchInitiatives(): Promise<Initiative[]> {
  if (resolveAreaPlansSource('fetchInitiatives') === 'mock') {
    return mockApi.fetchInitiatives()
  }

  const { data, error } = await supabase
    .from('initiatives')
    .select(`
      *,
      pillar:pillars(*)
    `)
    .order('code')

  if (error) throw error
  return data || []
}

// ============================================================
// PLANOS DE AÇÃO
// ============================================================

export async function fetchAreaPlans(year?: number): Promise<AreaPlan[]> {
  if (resolveAreaPlansSource('fetchAreaPlans') === 'mock') {
    return mockApi.fetchAreaPlans(year)
  }

  let query = supabase
    .from('area_plans')
    .select(`
      *,
      area:areas(*)
    `)
    .order('created_at', { ascending: false })

  if (year) {
    query = query.eq('year', year)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function fetchAreaPlanByAreaSlug(areaSlug: string, year: number): Promise<AreaPlan | null> {
  if (resolveAreaPlansSource('fetchAreaPlanByAreaSlug') === 'mock') {
    return mockApi.fetchAreaPlanByAreaSlug(areaSlug, year)
  }

  const { data, error } = await supabase
    .from('area_plans')
    .select(`
      *,
      area:areas!inner(*)
    `)
    .eq('areas.slug', areaSlug)
    .eq('year', year)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function fetchAreaPlanById(planId: string): Promise<AreaPlan | null> {
  if (resolveAreaPlansSource('fetchAreaPlanById') === 'mock') {
    return mockApi.fetchAreaPlanById(planId)
  }

  const { data, error } = await supabase
    .from('area_plans')
    .select(`
      *,
      area:areas(*)
    `)
    .eq('id', planId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function fetchPlanByPackId(packId: string): Promise<AreaPlan | null> {
  if (resolveAreaPlansSource('fetchPlanByPackId') === 'mock') {
    return mockApi.fetchPlanByPackId(packId)
  }

  const { data, error } = await supabase
    .from('area_plans')
    .select(`
      *,
      area:areas(*)
    `)
    .eq('pack_id', packId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getOrCreatePlanForPack(params: {
  areaSlug: string
  areaName: string
  year: number
  packId: string
}): Promise<AreaPlan> {
  if (resolveAreaPlansSource('getOrCreatePlanForPack') === 'mock') {
    return mockApi.getOrCreatePlanForPack(params)
  }

  const { data: area, error: areaError } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', params.areaSlug)
    .single()

  if (areaError && areaError.code !== 'PGRST116') throw areaError
  if (!area) throw new Error(`Área não encontrada: ${params.areaSlug}`)

  const { data: existingPlan, error: existingPlanError } = await supabase
    .from('area_plans')
    .select(`
      *,
      area:areas(*)
    `)
    .eq('area_id', area.id)
    .eq('year', params.year)
    .eq('pack_id', params.packId)
    .single()

  if (existingPlanError && existingPlanError.code !== 'PGRST116') throw existingPlanError
  if (existingPlan) return existingPlan

  try {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      if (!getSupabaseRuntimeState().canUseMockFallback) {
        throw new Error('[Area Plans API] getOrCreatePlanForPack: usuário não autenticado')
      }

      return {
        id: `plan-${Date.now()}`,
        pack_id: params.packId,
        area_id: area.id,
        year: params.year,
        title: `Plano ${params.areaName} ${params.year} - Strategic Pack`,
        description: `Plano gerado a partir do Strategic Pack ${params.year}`,
        status: 'RASCUNHO',
        template_id: null,
        created_by: 'dev-user',
        manager_approved_by: null,
        manager_approved_at: null,
        direction_approved_by: null,
        direction_approved_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        area,
      }
    }

    const { data: plan, error: planError } = await supabase
      .from('area_plans')
      .insert({
        area_id: area.id,
        year: params.year,
        title: `Plano ${params.areaName} ${params.year} - Strategic Pack`,
        description: `Plano gerado a partir do Strategic Pack ${params.year}`,
        status: 'RASCUNHO',
        created_by: user.user.id,
        pack_id: params.packId,
      })
      .select(`
        *,
        area:areas(*)
      `)
      .single()

    if (planError) throw planError
    return plan
  } catch (err) {
    console.error('[Area Plans API] Erro ao obter ou criar plano por pack:', err)
    throw err
  }
}

export async function createAreaPlan(data: CreateAreaPlanData): Promise<AreaPlan> {
  if (resolveAreaPlansSource('createAreaPlan') === 'mock') {
    const mockPlan: AreaPlan = {
      id: `plan-${Date.now()}`,
      pack_id: null,
      area_id: data.area_id,
      year: data.year,
      title: data.title,
      description: data.description || null,
      status: 'RASCUNHO',
      template_id: null,
      created_by: 'mock-user',
      manager_approved_by: null,
      manager_approved_at: null,
      direction_approved_by: null,
      direction_approved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return mockPlan
  }

  try {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      if (!getSupabaseRuntimeState().canUseMockFallback) {
        throw new Error('[Area Plans API] createAreaPlan: usuário não autenticado')
      }

      console.warn('[Area Plans API] Usuário não autenticado, criando plano em modo desenvolvimento')
      const mockPlan: AreaPlan = {
        id: `plan-${Date.now()}`,
        pack_id: null,
        area_id: data.area_id,
        year: data.year,
        title: data.title,
        description: data.description || null,
        status: 'RASCUNHO',
        template_id: null,
        created_by: 'dev-user',
        manager_approved_by: null,
        manager_approved_at: null,
        direction_approved_by: null,
        direction_approved_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return mockPlan
    }

    const { data: plan, error } = await supabase
      .from('area_plans')
      .insert({
        ...data,
        status: 'RASCUNHO',
        created_by: user.user.id,
      })
      .select(`
        *,
        area:areas(*)
      `)
      .single()

    if (error) throw error
    return plan
  } catch (err) {
    console.error('[Area Plans API] Erro ao criar plano:', err)
    throw err
  }
}

export async function updateAreaPlan(planId: string, data: UpdateAreaPlanData): Promise<AreaPlan> {
  const { data: plan, error } = await supabase
    .from('area_plans')
    .update(data)
    .eq('id', planId)
    .select(`
      *,
      area:areas(*)
    `)
    .single()

  if (error) throw error
  return plan
}

export async function deleteAreaPlan(planId: string): Promise<void> {
  const { error } = await supabase
    .from('area_plans')
    .delete()
    .eq('id', planId)

  if (error) throw error
}

// ============================================================
// APROVAÇÃO DE PLANOS
// ============================================================

export async function approvePlanAsManager(planId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const { data, error } = await supabase.rpc('approve_plan_as_manager', { p_plan_id: planId })

  if (error) throw error
  return data
}

export async function approvePlanAsDirection(planId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const { data, error } = await supabase.rpc('approve_plan_as_direction', { p_plan_id: planId })

  if (error) throw error
  return data
}

export async function rejectPlan(planId: string, reason?: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const { data, error } = await supabase.rpc('reject_plan', { p_plan_id: planId, p_reason: reason })

  if (error) throw error
  return data
}

// ============================================================
// AÇÕES DO PLANO
// ============================================================

export async function fetchPlanActions(
  planId: string, 
  filters?: ActionFilters,
  pagination?: { page: number; limit: number }
): Promise<{ data: PlanAction[]; total: number }> {
  // Calcular offset para paginação
  const offset = pagination ? (pagination.page - 1) * pagination.limit : 0
  const limit = pagination?.limit || 50

  // Query otimizada com apenas os campos necessários
  let query = supabase
    .from('plan_actions')
    .select(`
      id,
      plan_id,
      pillar_id,
      area_okr_id,
      initiative_id,
      parent_action_id,
      node_type,
      title,
      description,
      status,
      priority,
      responsible,
      assigned_to,
      start_date,
      due_date,
      completed_at,
      progress,
      evidence_required,
      notes,
      cost_estimate,
      cost_actual,
      cost_type,
      currency,
      created_at,
      updated_at,
      pillar:pillars(id, code, title),
      area_okr:area_okrs(id, objective, status),
      initiative:initiatives(id, code, title, status),
      subtasks:action_subtasks(id, title, status, due_date, completed_at),
      evidences:action_evidences(id, title, status, created_at)
    `, { count: 'exact' })
    .eq('plan_id', planId)
    .order('priority')
    .order('due_date')
    .range(offset, offset + limit - 1)

  // Aplicar filtros
  if (filters?.status?.length) {
    query = query.in('status', filters.status)
  }

  if (filters?.priority?.length) {
    query = query.in('priority', filters.priority)
  }

  if (filters?.pillar_id) {
    query = query.eq('pillar_id', filters.pillar_id)
  }

  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to)
  }

  if (filters?.overdue) {
    query = query
      .lt('due_date', new Date().toISOString().split('T')[0])
      .not('status', 'in', '("CONCLUIDA","CANCELADA")')
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  const { data, error, count } = await query

  if (error) throw error
  
  // Transformar dados para compatibilidade com tipos existentes
  const transformedData = (data || []).map((action: any) => ({
    ...action,
    pillar: action.pillar?.[0] || null,
    area_okr: action.area_okr?.[0] || null,
    initiative: action.initiative?.[0] || null,
    subtasks: action.subtasks || [],
    evidences: action.evidences || [],
  }))

  return { 
    data: transformedData, 
    total: count || 0 
  }
}

export async function fetchActionById(actionId: string): Promise<PlanAction | null> {
  const { data, error } = await supabase
    .from('plan_actions')
    .select(`
      *,
      pillar:pillars(*),
      area_okr:area_okrs(*),
      initiative:initiatives(*),
      subtasks:action_subtasks(*),
      evidences:action_evidences(
        *,
        approvals:evidence_approvals(*)
      ),
      comments:action_comments(*),
      risks:action_risks(*)
    `)
    .eq('id', actionId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createPlanAction(data: CreatePlanActionData): Promise<PlanAction> {
  const { data: action, error } = await supabase
    .from('plan_actions')
    .insert(data)
    .select(`
      *,
      pillar:pillars(*),
      area_okr:area_okrs(*),
      initiative:initiatives(*)
    `)
    .single()

  if (error) throw error
  return action
}

export async function updatePlanAction(actionId: string, data: UpdatePlanActionData): Promise<PlanAction> {
  const { data: action, error } = await supabase
    .from('plan_actions')
    .update(data)
    .eq('id', actionId)
    .select(`
      *,
      pillar:pillars(*),
      area_okr:area_okrs(*),
      initiative:initiatives(*)
    `)
    .single()

  if (error) throw error
  return action
}

export async function deletePlanAction(actionId: string): Promise<void> {
  const { error } = await supabase
    .from('plan_actions')
    .delete()
    .eq('id', actionId)

  if (error) throw error
}

export async function updateActionStatus(actionId: string, status: string): Promise<PlanAction> {
  return updatePlanAction(actionId, { status: status as any })
}

export async function fetchActionsByPackId(packId: string): Promise<PlanAction[]> {
  const { data, error } = await supabase
    .from('plan_actions')
    .select('*')
    .eq('pack_id', packId)

  if (error) throw error
  return data || []
}

export async function fetchActionsByProgramKey(packId: string, programKey: string): Promise<PlanAction[]> {
  const { data, error } = await supabase
    .from('plan_actions')
    .select('*')
    .eq('pack_id', packId)
    .eq('program_key', programKey)

  if (error) throw error
  return data || []
}

export async function fetchActionsByObjectiveKey(packId: string, objectiveKey: string): Promise<PlanAction[]> {
  const { data, error } = await supabase
    .from('plan_actions')
    .select('*')
    .eq('pack_id', packId)
    .eq('objective_key', objectiveKey)

  if (error) throw error
  return data || []
}

// ============================================================
// SUBTAREFAS
// ============================================================

export async function fetchSubtasks(actionId: string): Promise<ActionSubtask[]> {
  const { data, error } = await supabase
    .from('action_subtasks')
    .select('*')
    .eq('action_id', actionId)
    .order('sort_order')

  if (error) throw error
  return data || []
}

export async function createSubtask(data: CreateSubtaskData): Promise<ActionSubtask> {
  const { data: subtask, error } = await supabase
    .from('action_subtasks')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return subtask
}

export async function updateSubtask(subtaskId: string, data: UpdateSubtaskData): Promise<ActionSubtask> {
  const updateData: any = { ...data }
  if (data.completed !== undefined) {
    updateData.completed_at = data.completed ? new Date().toISOString() : null
  }

  const { data: subtask, error } = await supabase
    .from('action_subtasks')
    .update(updateData)
    .eq('id', subtaskId)
    .select()
    .single()

  if (error) throw error
  return subtask
}

export async function deleteSubtask(subtaskId: string): Promise<void> {
  const { error } = await supabase
    .from('action_subtasks')
    .delete()
    .eq('id', subtaskId)

  if (error) throw error
}

export async function toggleSubtask(subtaskId: string, completed: boolean): Promise<ActionSubtask> {
  return updateSubtask(subtaskId, { completed })
}

// ============================================================
// EVIDÊNCIAS
// ============================================================

export async function fetchEvidences(actionId: string): Promise<ActionEvidence[]> {
  const { data, error } = await supabase
    .from('action_evidences')
    .select(`
      *,
      approvals:evidence_approvals(*)
    `)
    .eq('action_id', actionId)
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createEvidence(data: CreateEvidenceData): Promise<ActionEvidence> {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Usuário não autenticado')

  const { data: evidence, error } = await supabase
    .from('action_evidences')
    .insert({
      ...data,
      submitted_by: user.user.id,
      status: 'PENDENTE',
    })
    .select()
    .single()

  if (error) throw error
  return evidence
}

export async function uploadEvidence(actionId: string, file: File): Promise<ActionEvidence> {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Usuário não autenticado')

  const fileExt = file.name.split('.').pop()
  const fileName = `${actionId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('action-evidences')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  return createEvidence({
    action_id: actionId,
    filename: file.name,
    storage_path: fileName,
    file_size: file.size,
    mime_type: file.type,
  })
}

export async function deleteEvidence(evidenceId: string): Promise<void> {
  const { data: evidence } = await supabase
    .from('action_evidences')
    .select('storage_path')
    .eq('id', evidenceId)
    .single()

  if (evidence?.storage_path) {
    await supabase.storage
      .from('action-evidences')
      .remove([evidence.storage_path])
  }

  const { error } = await supabase
    .from('action_evidences')
    .delete()
    .eq('id', evidenceId)

  if (error) throw error
}

// ============================================================
// APROVAÇÃO DE EVIDÊNCIAS
// ============================================================

export async function approveEvidenceAsManager(evidenceId: string, note?: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const { data, error } = await supabase.rpc('approve_evidence_as_manager', { 
    p_evidence_id: evidenceId, 
    p_note: note 
  })

  if (error) throw error
  return data
}

export async function approveEvidenceAsDirection(evidenceId: string, note?: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const { data, error } = await supabase.rpc('approve_evidence_as_direction', { 
    p_evidence_id: evidenceId, 
    p_note: note 
  })

  if (error) throw error
  return data
}

export async function rejectEvidence(evidenceId: string, role: 'gestor' | 'direcao', reason: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const { data, error } = await supabase.rpc('reject_evidence', { 
    p_evidence_id: evidenceId, 
    p_role: role,
    p_reason: reason 
  })

  if (error) throw error
  return data
}

// ============================================================
// COMENTÁRIOS
// ============================================================

export async function fetchComments(actionId: string): Promise<ActionComment[]> {
  const { data, error } = await supabase
    .from('action_comments')
    .select('*')
    .eq('action_id', actionId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createComment(data: CreateCommentData): Promise<ActionComment> {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Usuário não autenticado')

  const { data: comment, error } = await supabase
    .from('action_comments')
    .insert({
      ...data,
      user_id: user.user.id,
    })
    .select()
    .single()

  if (error) throw error
  return comment
}

export async function updateComment(commentId: string, data: UpdateCommentData): Promise<ActionComment> {
  const { data: comment, error } = await supabase
    .from('action_comments')
    .update(data)
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw error
  return comment
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('action_comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}

// ============================================================
// HISTÓRICO
// ============================================================

export async function fetchActionHistory(actionId: string): Promise<ActionHistory[]> {
  const { data, error } = await supabase
    .from('action_history')
    .select('*')
    .eq('action_id', actionId)
    .order('changed_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================
// RISCOS
// ============================================================

export async function fetchRisks(actionId: string): Promise<ActionRisk[]> {
  const { data, error } = await supabase
    .from('action_risks')
    .select('*')
    .eq('action_id', actionId)

  if (error) throw error
  return data || []
}

export async function createRisk(data: CreateRiskData): Promise<ActionRisk> {
  const { data: risk, error } = await supabase
    .from('action_risks')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return risk
}

export async function updateRisk(riskId: string, data: UpdateRiskData): Promise<ActionRisk> {
  const { data: risk, error } = await supabase
    .from('action_risks')
    .update(data)
    .eq('id', riskId)
    .select()
    .single()

  if (error) throw error
  return risk
}

export async function deleteRisk(riskId: string): Promise<void> {
  const { error } = await supabase
    .from('action_risks')
    .delete()
    .eq('id', riskId)

  if (error) throw error
}

// ============================================================
// VIEWS E MÉTRICAS
// ============================================================

export async function fetchAreaPlanProgress(year?: number): Promise<AreaPlanProgress[]> {
  // Query direta às tabelas pois a view não existe no banco
  let query = supabase
    .from('area_plans')
    .select(`
      *,
      area:areas(name, slug)
    `)
    .order('created_at')

  if (year) {
    query = query.eq('year', year)
  }

  const { data: plans, error } = await query

  if (error) throw error

  // Calcular progresso para cada plano
  const progress: AreaPlanProgress[] = []
  
  for (const plan of plans || []) {
    // Buscar ações do plano
    const { data: actions } = await supabase
      .from('plan_actions')
      .select('status, progress, cost_estimate, cost_actual, due_date, evidence_required')
      .eq('plan_id', plan.id)

    const totalActions = actions?.length || 0
    const completedActions = actions?.filter((a: any) => a.status === 'CONCLUIDA').length || 0
    const overdueActions = actions?.filter((a: any) => 
      a.due_date && 
      new Date(a.due_date) < new Date() && 
      a.status !== 'CONCLUIDA'
    ).length || 0
    
    const awaitingEvidence = actions?.filter((a: any) => 
      a.evidence_required && 
      a.status === 'AGUARDANDO_EVIDENCIA'
    ).length || 0
    
    const inValidation = actions?.filter((a: any) => a.status === 'EM_VALIDACAO').length || 0
    
    const totalCostEstimate = actions?.reduce((sum: number, a: any) => sum + (a.cost_estimate || 0), 0) || 0
    const totalCostActual = actions?.reduce((sum: number, a: any) => sum + (a.cost_actual || 0), 0) || 0

    // Calcular completion percentage
    const completionPercentage = totalActions > 0 
      ? (completedActions / totalActions) * 100 
      : 0

    // Calcular pending actions (não concluídas e não em validação)
    const pendingActions = totalActions - completedActions - inValidation

    progress.push({
      plan_id: plan.id,
      area_id: plan.area_id,
      year: plan.year,
      plan_title: plan.title || 'Plano sem título',
      plan_status: plan.status || 'RASCUNHO',
      area_name: plan.area?.name || 'Sem área',
      area_slug: plan.area?.slug || 'unknown',
      total_actions: totalActions,
      completed_actions: completedActions,
      pending_actions: pendingActions,
      overdue_actions: overdueActions,
      awaiting_evidence: awaitingEvidence,
      in_validation: inValidation,
      completion_percentage: completionPercentage,
      total_cost_estimate: totalCostEstimate,
      total_cost_actual: totalCostActual,
    })
  }

  return progress.sort((a, b) => a.area_name.localeCompare(b.area_name))
}

export async function fetchAreaPillarProgress(areaId: string, year: number): Promise<AreaPillarProgress[]> {
  // Query direta pois a view não existe
  const { data: plans, error: plansError } = await supabase
    .from('area_plans')
    .select('id')
    .eq('area_id', areaId)
    .eq('year', year)
    .single()

  if (plansError) throw plansError

  // Buscar ações agrupadas por pilar
  const { data: actions, error } = await supabase
    .from('plan_actions')
    .select(`
      status,
      progress,
      cost_estimate,
      cost_actual,
      due_date,
      pillar:pillars(code, title)
    `)
    .eq('plan_id', plans.id)
    .not('pillar_id', 'is', null)

  if (error) throw error

  // Agrupar por pilar
  const pillarMap = new Map<string, AreaPillarProgress>()
  
  for (const action of actions || []) {
    const pillar = action.pillar as any
    const pillarCode = pillar?.code || 'SEM_PILAR'
    const pillarTitle = pillar?.title || 'Sem Pilar'
    
    if (!pillarMap.has(pillarCode)) {
      pillarMap.set(pillarCode, {
        area_id: areaId,
        area_name: '', // Será preenchido depois se necessário
        year: year,
        pillar_id: '', // Não disponível nesta query
        pillar_code: pillarCode,
        pillar_title: pillarTitle,
        total_actions: 0,
        completed_actions: 0,
        completion_percentage: 0,
      })
    }
    
    const progress = pillarMap.get(pillarCode)!
    progress.total_actions++
    
    if (action.status === 'CONCLUIDA') {
      progress.completed_actions++
    }
    
    // Calcular percentual
    progress.completion_percentage = progress.total_actions > 0 
      ? (progress.completed_actions / progress.total_actions) * 100 
      : 0
  }

  return Array.from(pillarMap.values()).sort((a, b) => a.pillar_code.localeCompare(b.pillar_code))
}

export async function fetchEvidenceBacklog(): Promise<EvidenceBacklogItem[]> {
  // Query direta pois a view não existe
  const { data, error } = await supabase
    .from('action_evidences')
    .select(`
      *,
      action:plan_actions(
        title,
        plan:area_plans(
          year,
          area_id,
          area:areas(name, slug)
        )
      )
    `)
    .eq('status', 'SUBMETIDA')
    .order('submitted_at', { ascending: false })

  if (error) throw error
  
  // Transformar para o formato esperado
  return (data || []).map(evidence => {
    const action = evidence.action as any
    const plan = action?.plan as any
    const area = plan?.area as any
    
    return {
      evidence_id: evidence.id,
      action_id: evidence.action_id,
      action_title: action?.title || 'Sem título',
      filename: evidence.filename || 'arquivo.pdf',
      evidence_status: evidence.status,
      submitted_at: evidence.submitted_at,
      submitted_by: evidence.submitted_by,
      area_id: plan?.area_id || '',
      area_name: area?.name || 'Sem área',
      area_slug: area?.slug || 'unknown',
      approval_count: 0, // Calcular se necessário
      manager_approved: false, // Calcular se necessário
      direction_approved: false, // Calcular se necessário
    }
  })
}

// ============================================================
// ESTATÍSTICAS
// ============================================================

export async function fetchPlanStats(planId: string): Promise<{
  total: number
  completed: number
  inProgress: number
  pending: number
  overdue: number
  awaitingEvidence: number
  inValidation: number
  completionPercentage: number
}> {
  const { data, error } = await supabase
    .from('plan_actions')
    .select('status, due_date')
    .eq('plan_id', planId)

  if (error) throw error

  const actions: { status: string; due_date: string | null }[] = data || []
  const today = new Date().toISOString().split('T')[0]

  const stats = {
    total: actions.length,
    completed: actions.filter((a) => a.status === 'CONCLUIDA').length,
    inProgress: actions.filter((a) => a.status === 'EM_ANDAMENTO').length,
    pending: actions.filter((a) => a.status === 'PENDENTE').length,
    overdue: actions.filter((a) => 
      a.due_date && a.due_date < today && !['CONCLUIDA', 'CANCELADA'].includes(a.status)
    ).length,
    awaitingEvidence: actions.filter((a) => a.status === 'AGUARDANDO_EVIDENCIA').length,
    inValidation: actions.filter((a) => a.status === 'EM_VALIDACAO').length,
    completionPercentage: 0,
  }

  stats.completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0

  return stats
}

// ============================================================
// SUBPILARES
// ============================================================

export async function fetchSubpillars(pillarId?: string): Promise<Subpillar[]> {
  if (resolveAreaPlansSource('fetchSubpillars') === 'mock') {
    return mockApi.fetchSubpillars(pillarId)
  }

  let query = supabase.from('subpillars').select('*').order('code')
  if (pillarId) query = query.eq('pillar_id', pillarId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchSubpillarsByPillarCode(pillarCode: string): Promise<Subpillar[]> {
  if (resolveAreaPlansSource('fetchSubpillarsByPillarCode') === 'mock') {
    return mockApi.fetchSubpillarsByPillarCode(pillarCode)
  }

  const { data, error } = await supabase
    .from('subpillars')
    .select('*, pillar:pillars!inner(code)')
    .eq('pillars.code', pillarCode)
    .order('code')
  if (error) throw error
  return data || []
}

// ============================================================
// OKRs CORPORATIVOS + KEY RESULTS
// ============================================================

export async function fetchCorporateOkrs(): Promise<CorporateOkr[]> {
  if (resolveAreaPlansSource('fetchCorporateOkrs') === 'mock') {
    return mockApi.fetchCorporateOkrs()
  }

  const { data, error } = await supabase
    .from('corporate_okrs')
    .select('*, pillar:pillars(*), key_results(*)')
    .order('code')
  if (error) throw error
  return data || []
}

export async function fetchKeyResults(okrId?: string): Promise<KeyResult[]> {
  if (resolveAreaPlansSource('fetchKeyResults') === 'mock') {
    return mockApi.fetchKeyResults(okrId)
  }

  let query = supabase.from('key_results').select('*').order('code')
  if (okrId) query = query.eq('okr_id', okrId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchKeyResultByCode(code: string): Promise<KeyResult | null> {
  if (resolveAreaPlansSource('fetchKeyResultByCode') === 'mock') {
    return mockApi.fetchKeyResultByCode(code)
  }

  const { data, error } = await supabase
    .from('key_results').select('*').eq('code', code).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ============================================================
// MOTORES ESTRATÉGICOS
// ============================================================

export async function fetchMotors(): Promise<Motor[]> {
  if (resolveAreaPlansSource('fetchMotors') === 'mock') {
    return mockApi.fetchMotors()
  }

  const { data, error } = await supabase
    .from('motors').select('*').order('code')
  if (error) throw error
  return data || []
}

export async function fetchMotorByCode(code: string): Promise<Motor | null> {
  if (resolveAreaPlansSource('fetchMotorByCode') === 'mock') {
    return mockApi.fetchMotorByCode(code)
  }

  const { data, error } = await supabase
    .from('motors').select('*').eq('code', code).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ============================================================
// TEMAS ESTRATÉGICOS
// ============================================================

export async function fetchStrategicThemes(): Promise<StrategicTheme[]> {
  if (resolveAreaPlansSource('fetchStrategicThemes') === 'mock') {
    return mockApi.fetchStrategicThemes()
  }

  const { data, error } = await supabase
    .from('strategic_themes').select('*').order('priority').order('code')
  if (error) throw error
  return data || []
}

export async function fetchStrategicThemesByPillar(pillarCode: string): Promise<StrategicTheme[]> {
  if (resolveAreaPlansSource('fetchStrategicThemesByPillar') === 'mock') {
    return mockApi.fetchStrategicThemesByPillar(pillarCode)
  }

  const { data, error } = await supabase
    .from('strategic_themes').select('*').contains('pillar_codes', [pillarCode]).order('priority')
  if (error) throw error
  return data || []
}

// ============================================================
// RISCOS ESTRATÉGICOS
// ============================================================

export async function fetchStrategicRisks(severity?: string): Promise<StrategicRisk[]> {
  if (resolveAreaPlansSource('fetchStrategicRisks') === 'mock') {
    return mockApi.fetchStrategicRisks(severity)
  }

  let query = supabase.from('strategic_risks').select('*').order('severity').order('code')
  if (severity) query = query.eq('severity', severity)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchStrategicRiskByCode(code: string): Promise<StrategicRisk | null> {
  if (resolveAreaPlansSource('fetchStrategicRiskByCode') === 'mock') {
    return mockApi.fetchStrategicRiskByCode(code)
  }

  const { data, error } = await supabase
    .from('strategic_risks').select('*').eq('code', code).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ============================================================
// CENÁRIOS FINANCEIROS
// ============================================================

export async function fetchFinancialScenarios(): Promise<FinancialScenario[]> {
  if (resolveAreaPlansSource('fetchFinancialScenarios') === 'mock') {
    return mockApi.fetchFinancialScenarios()
  }

  const { data, error } = await supabase
    .from('financial_scenarios').select('*').order('probability_pct')
  if (error) throw error
  return data || []
}

export async function fetchReferenceScenario(): Promise<FinancialScenario | null> {
  if (resolveAreaPlansSource('fetchReferenceScenario') === 'mock') {
    return mockApi.fetchReferenceScenario()
  }

  const { data, error } = await supabase
    .from('financial_scenarios').select('*').eq('is_reference', true).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function fetchFinancialScenarioByCode(code: string): Promise<FinancialScenario | null> {
  if (resolveAreaPlansSource('fetchFinancialScenarioByCode') === 'mock') {
    return mockApi.fetchFinancialScenarioByCode(code)
  }

  const { data, error } = await supabase
    .from('financial_scenarios').select('*').eq('code', code).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}
