import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import { useApiPerformance } from '@/shared/hooks/useApiPerformance'
import type {
  CreateAreaPlanData,
  UpdateAreaPlanData,
  CreatePlanActionData,
  UpdatePlanActionData,
  CreateSubtaskData,
  UpdateSubtaskData,
  CreateCommentData,
  UpdateCommentData,
  CreateRiskData,
  UpdateRiskData,
  ActionFilters,
} from './types'

// ============================================================
// QUERY KEYS
// ============================================================

export const areaPlansKeys = {
  all: ['area-plans'] as const,
  areas: () => [...areaPlansKeys.all, 'areas'] as const,
  area: (slug: string) => [...areaPlansKeys.areas(), slug] as const,
  pillars: () => [...areaPlansKeys.all, 'pillars'] as const,
  initiatives: () => [...areaPlansKeys.all, 'initiatives'] as const,
  areaOkrs: (areaId: string) => [...areaPlansKeys.all, 'area-okrs', areaId] as const,
  plans: (year?: number) => [...areaPlansKeys.all, 'plans', { year }] as const,
  plan: (planId: string) => [...areaPlansKeys.all, 'plan', planId] as const,
  planByArea: (areaSlug: string, year: number) => [...areaPlansKeys.all, 'plan-by-area', areaSlug, year] as const,
  actions: (planId: string, filters?: ActionFilters) => [...areaPlansKeys.all, 'actions', planId, filters] as const,
  action: (actionId: string) => [...areaPlansKeys.all, 'action', actionId] as const,
  subtasks: (actionId: string) => [...areaPlansKeys.all, 'subtasks', actionId] as const,
  evidences: (actionId: string) => [...areaPlansKeys.all, 'evidences', actionId] as const,
  comments: (actionId: string) => [...areaPlansKeys.all, 'comments', actionId] as const,
  history: (actionId: string) => [...areaPlansKeys.all, 'history', actionId] as const,
  risks: (actionId: string) => [...areaPlansKeys.all, 'risks', actionId] as const,
  progress: (year?: number) => [...areaPlansKeys.all, 'progress', { year }] as const,
  pillarProgress: (areaId: string, year: number) => [...areaPlansKeys.all, 'pillar-progress', areaId, year] as const,
  evidenceBacklog: () => [...areaPlansKeys.all, 'evidence-backlog'] as const,
  planStats: (planId: string) => [...areaPlansKeys.all, 'plan-stats', planId] as const,
}

// ============================================================
// ÁREAS
// ============================================================

export function useAreas() {
  return useQuery({
    queryKey: areaPlansKeys.areas(),
    queryFn: api.fetchAreas,
  })
}

export function useAreaBySlug(slug: string) {
  return useQuery({
    queryKey: areaPlansKeys.area(slug),
    queryFn: () => api.fetchAreaBySlug(slug),
    enabled: !!slug,
  })
}

// ============================================================
// PILARES
// ============================================================

export function usePillars() {
  return useQuery({
    queryKey: areaPlansKeys.pillars(),
    queryFn: api.fetchPillars,
  })
}

// ============================================================
// OKRs DA ÁREA
// ============================================================

export function useAreaOkrs(areaId: string) {
  return useQuery({
    queryKey: areaPlansKeys.areaOkrs(areaId),
    queryFn: () => api.fetchAreaOkrs(areaId),
    enabled: !!areaId,
  })
}

// ============================================================
// INICIATIVAS
// ============================================================

export function useInitiatives() {
  return useQuery({
    queryKey: areaPlansKeys.initiatives(),
    queryFn: api.fetchInitiatives,
  })
}

// ============================================================
// PLANOS DE AÇÃO
// ============================================================

export function useAreaPlans(year?: number) {
  return useQuery({
    queryKey: areaPlansKeys.plans(year),
    queryFn: () => api.fetchAreaPlans(year),
  })
}

export function useAreaPlanByAreaSlug(areaSlug: string, year: number) {
  return useQuery({
    queryKey: areaPlansKeys.planByArea(areaSlug, year),
    queryFn: () => api.fetchAreaPlanByAreaSlug(areaSlug, year),
    enabled: !!areaSlug && !!year,
  })
}

export function useAreaPlan(planId: string) {
  return useQuery({
    queryKey: areaPlansKeys.plan(planId),
    queryFn: () => api.fetchAreaPlanById(planId),
    enabled: !!planId,
  })
}

export function useCreateAreaPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAreaPlanData) => api.createAreaPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

export function useUpdateAreaPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: UpdateAreaPlanData }) =>
      api.updateAreaPlan(planId, data),
    onSuccess: (_, { planId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.plan(planId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.plans() })
    },
  })
}

export function useDeleteAreaPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: string) => api.deleteAreaPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

// ============================================================
// APROVAÇÃO DE PLANOS
// ============================================================

export function useApprovePlanAsManager() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: string) => api.approvePlanAsManager(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

export function useApprovePlanAsDirection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: string) => api.approvePlanAsDirection(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

export function useRejectPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, reason }: { planId: string; reason?: string }) =>
      api.rejectPlan(planId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

// ============================================================
// AÇÕES DO PLANO
// ============================================================

export function usePlanActions(
  planId: string, 
  filters?: ActionFilters,
) {
  const { measureApiCall } = useApiPerformance({ 
    apiName: 'fetchPlanActions',
    context: `plan_${planId}`
  })

  return useQuery({
    queryKey: areaPlansKeys.actions(planId, filters),
    queryFn: async () => {
      const result = await measureApiCall(() => api.fetchPlanActions(planId, filters))
      // Retorna array direto (sem paginação)
      return Array.isArray(result) ? result : result.data
    },
    enabled: !!planId,
  })
}

// Hook específico para paginação quando necessário
export function usePlanActionsPaginated(
  planId: string, 
  filters: ActionFilters | undefined,
  pagination: { page: number; limit: number }
) {
  return useQuery({
    queryKey: [...areaPlansKeys.actions(planId, filters), pagination],
    queryFn: async () => {
      const result = await api.fetchPlanActions(planId, filters, pagination)
      // Garante retorno no formato paginado
      if (Array.isArray(result)) {
        return { data: result, total: result.length }
      }
      return result
    },
    enabled: !!planId,
    placeholderData: (previousData) => previousData,
  })
}

export function useAction(actionId: string) {
  return useQuery({
    queryKey: areaPlansKeys.action(actionId),
    queryFn: () => api.fetchActionById(actionId),
    enabled: !!actionId,
  })
}

export function useCreatePlanAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlanActionData) => api.createPlanAction(data),
    onSuccess: (_, { plan_id }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.actions(plan_id) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.planStats(plan_id) })
    },
  })
}

export function useUpdatePlanAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ actionId, data }: { actionId: string; data: UpdatePlanActionData }) =>
      api.updatePlanAction(actionId, data),
    onSuccess: (action) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(action.id) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.actions(action.plan_id) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.planStats(action.plan_id) })
    },
  })
}

export function useDeletePlanAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (actionId: string) => api.deletePlanAction(actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

export function useUpdateActionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ actionId, status }: { actionId: string; status: string }) =>
      api.updateActionStatus(actionId, status),
    onSuccess: (action) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(action.id) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.actions(action.plan_id) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.planStats(action.plan_id) })
    },
  })
}

export function useActionsByPackId(packId: string | undefined) {
  return useQuery({
    queryKey: ['actions', 'pack', packId],
    queryFn: () => api.fetchActionsByPackId(packId!),
    enabled: !!packId,
  })
}

export function usePlanByPackId(packId: string | undefined) {
  return useQuery({
    queryKey: ['plan', 'pack', packId],
    queryFn: () => api.fetchPlanByPackId(packId!),
    enabled: !!packId,
  })
}

export function useGetOrCreatePlanForPack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      areaSlug: string
      areaName: string
      year: number
      packId: string
    }) => api.getOrCreatePlanForPack(params),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
      queryClient.invalidateQueries({ queryKey: ['plan', 'pack', plan.pack_id] })
    },
  })
}

export function useActionsByProgramKey(packId: string | undefined, programKey: string | undefined) {
  return useQuery({
    queryKey: ['actions', 'pack', packId, 'program', programKey],
    queryFn: () => api.fetchActionsByProgramKey(packId!, programKey!),
    enabled: !!packId && !!programKey,
  })
}

export function useActionsByObjectiveKey(packId: string | undefined, objectiveKey: string | undefined) {
  return useQuery({
    queryKey: ['actions', 'pack', packId, 'objective', objectiveKey],
    queryFn: () => api.fetchActionsByObjectiveKey(packId!, objectiveKey!),
    enabled: !!packId && !!objectiveKey,
  })
}

// ============================================================
// SUBTAREFAS
// ============================================================

export function useSubtasks(actionId: string) {
  return useQuery({
    queryKey: areaPlansKeys.subtasks(actionId),
    queryFn: () => api.fetchSubtasks(actionId),
    enabled: !!actionId,
  })
}

export function useCreateSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubtaskData) => api.createSubtask(data),
    onSuccess: (_, { action_id }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.subtasks(action_id) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(action_id) })
    },
  })
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subtaskId, data }: { subtaskId: string; data: UpdateSubtaskData; actionId: string }) =>
      api.updateSubtask(subtaskId, data),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.subtasks(actionId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(actionId) })
    },
  })
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subtaskId }: { subtaskId: string; actionId: string }) =>
      api.deleteSubtask(subtaskId),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.subtasks(actionId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(actionId) })
    },
  })
}

export function useToggleSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subtaskId, completed }: { subtaskId: string; completed: boolean; actionId: string }) =>
      api.toggleSubtask(subtaskId, completed),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.subtasks(actionId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(actionId) })
    },
  })
}

// ============================================================
// EVIDÊNCIAS
// ============================================================

export function useEvidences(actionId: string) {
  return useQuery({
    queryKey: areaPlansKeys.evidences(actionId),
    queryFn: () => api.fetchEvidences(actionId),
    enabled: !!actionId,
  })
}

export function useUploadEvidence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ actionId, file }: { actionId: string; file: File }) =>
      api.uploadEvidence(actionId, file),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.evidences(actionId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(actionId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.evidenceBacklog() })
    },
  })
}

export function useDeleteEvidence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ evidenceId }: { evidenceId: string; actionId: string }) =>
      api.deleteEvidence(evidenceId),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.evidences(actionId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.action(actionId) })
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.evidenceBacklog() })
    },
  })
}

// ============================================================
// APROVAÇÃO DE EVIDÊNCIAS
// ============================================================

export function useApproveEvidenceAsManager() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ evidenceId, note }: { evidenceId: string; note?: string }) =>
      api.approveEvidenceAsManager(evidenceId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

export function useApproveEvidenceAsDirection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ evidenceId, note }: { evidenceId: string; note?: string }) =>
      api.approveEvidenceAsDirection(evidenceId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

export function useRejectEvidence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ evidenceId, role, reason }: { evidenceId: string; role: 'gestor' | 'direcao'; reason: string }) =>
      api.rejectEvidence(evidenceId, role, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.all })
    },
  })
}

// ============================================================
// COMENTÁRIOS
// ============================================================

export function useComments(actionId: string) {
  return useQuery({
    queryKey: areaPlansKeys.comments(actionId),
    queryFn: () => api.fetchComments(actionId),
    enabled: !!actionId,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentData) => api.createComment(data),
    onSuccess: (_, { action_id }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.comments(action_id) })
    },
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentData; actionId: string }) =>
      api.updateComment(commentId, data),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.comments(actionId) })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; actionId: string }) =>
      api.deleteComment(commentId),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.comments(actionId) })
    },
  })
}

// ============================================================
// HISTÓRICO
// ============================================================

export function useActionHistory(actionId: string) {
  return useQuery({
    queryKey: areaPlansKeys.history(actionId),
    queryFn: () => api.fetchActionHistory(actionId),
    enabled: !!actionId,
  })
}

// ============================================================
// RISCOS
// ============================================================

export function useRisks(actionId: string) {
  return useQuery({
    queryKey: areaPlansKeys.risks(actionId),
    queryFn: () => api.fetchRisks(actionId),
    enabled: !!actionId,
  })
}

export function useCreateRisk() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRiskData) => api.createRisk(data),
    onSuccess: (_, { action_id }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.risks(action_id) })
    },
  })
}

export function useUpdateRisk() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ riskId, data }: { riskId: string; data: UpdateRiskData; actionId: string }) =>
      api.updateRisk(riskId, data),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.risks(actionId) })
    },
  })
}

export function useDeleteRisk() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ riskId }: { riskId: string; actionId: string }) =>
      api.deleteRisk(riskId),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: areaPlansKeys.risks(actionId) })
    },
  })
}

// ============================================================
// VIEWS E MÉTRICAS
// ============================================================

export function useAreaPlanProgress(year?: number) {
  return useQuery({
    queryKey: areaPlansKeys.progress(year),
    queryFn: () => api.fetchAreaPlanProgress(year),
  })
}

export function useAreaPillarProgress(areaId: string, year: number) {
  return useQuery({
    queryKey: areaPlansKeys.pillarProgress(areaId, year),
    queryFn: () => api.fetchAreaPillarProgress(areaId, year),
    enabled: !!areaId && !!year,
  })
}

export function useEvidenceBacklog() {
  return useQuery({
    queryKey: areaPlansKeys.evidenceBacklog(),
    queryFn: api.fetchEvidenceBacklog,
  })
}

export function usePlanStats(planId: string) {
  return useQuery({
    queryKey: areaPlansKeys.planStats(planId),
    queryFn: () => api.fetchPlanStats(planId),
    enabled: !!planId,
  })
}
