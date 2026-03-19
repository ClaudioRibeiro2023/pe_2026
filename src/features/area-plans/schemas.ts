import { z } from 'zod'

// ============================================================
// SCHEMAS DE VALIDAÇÃO
// ============================================================

export const nodeTypeSchema = z.enum(['macro', 'area', 'meta', 'pilar', 'acao'])

export const areaPlanSchema = z.object({
  area_id: z.string().uuid('ID da área inválido'),
  year: z.number().int().min(2020).max(2100),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  description: z.string().max(2000).optional(),
  template_id: z.string().uuid().optional().nullable(),
})

export const updateAreaPlanSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200).optional(),
  description: z.string().max(2000).optional(),
})

export const planActionSchema = z.object({
  plan_id: z.string().uuid('ID do plano inválido'),
  pillar_id: z.string().uuid().optional().nullable(),
  area_okr_id: z.string().uuid().optional().nullable(),
  initiative_id: z.string().uuid().optional().nullable(),
  parent_action_id: z.string().uuid().optional().nullable(),
  pack_id: z.string().optional().nullable(),
  program_key: z.string().optional().nullable(),
  objective_key: z.string().optional().nullable(),
  section_id: z.string().uuid().optional().nullable(),
  node_type: nodeTypeSchema.default('acao'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(300),
  description: z.string().max(2000).optional(),
  priority: z.enum(['P0', 'P1', 'P2']).default('P1'),
  responsible: z.string().max(100).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  start_date: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  evidence_required: z.boolean().default(true),
  cost_estimate: z.number().min(0).optional().nullable(),
  cost_type: z.enum(['CAPEX', 'OPEX']).optional().nullable(),
})

export const updatePlanActionSchema = z.object({
  pillar_id: z.string().uuid().optional().nullable(),
  area_okr_id: z.string().uuid().optional().nullable(),
  initiative_id: z.string().uuid().optional().nullable(),
  parent_action_id: z.string().uuid().optional().nullable(),
  pack_id: z.string().optional().nullable(),
  program_key: z.string().optional().nullable(),
  objective_key: z.string().optional().nullable(),
  section_id: z.string().uuid().optional().nullable(),
  node_type: nodeTypeSchema.optional(),
  title: z.string().min(3).max(300).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum([
    'PENDENTE',
    'EM_ANDAMENTO',
    'BLOQUEADA',
    'AGUARDANDO_EVIDENCIA',
    'EM_VALIDACAO',
    'CONCLUIDA',
    'CANCELADA',
  ]).optional(),
  priority: z.enum(['P0', 'P1', 'P2']).optional(),
  responsible: z.string().max(100).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  start_date: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  evidence_required: z.boolean().optional(),
  notes: z.string().max(5000).optional(),
  cost_estimate: z.number().min(0).optional().nullable(),
  cost_actual: z.number().min(0).optional().nullable(),
  cost_type: z.enum(['CAPEX', 'OPEX']).optional().nullable(),
})

export const subtaskSchema = z.object({
  action_id: z.string().uuid('ID da ação inválido'),
  title: z.string().min(1, 'Título é obrigatório').max(200),
  sort_order: z.number().int().min(0).optional(),
})

export const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  completed: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
})

export const commentSchema = z.object({
  action_id: z.string().uuid('ID da ação inválido'),
  content: z.string().min(1, 'Comentário é obrigatório').max(5000),
})

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comentário é obrigatório').max(5000),
})

export const riskSchema = z.object({
  action_id: z.string().uuid('ID da ação inválido'),
  risk_label: z.string().min(3, 'Descrição do risco é obrigatória').max(300),
  risk_level: z.enum(['BAIXO', 'MEDIO', 'ALTO', 'CRITICO']).default('MEDIO'),
  mitigation: z.string().max(2000).optional(),
})

export const updateRiskSchema = z.object({
  risk_label: z.string().min(3).max(300).optional(),
  risk_level: z.enum(['BAIXO', 'MEDIO', 'ALTO', 'CRITICO']).optional(),
  mitigation: z.string().max(2000).optional(),
})

export const approvalNoteSchema = z.object({
  note: z.string().max(1000).optional(),
})

export const rejectionSchema = z.object({
  reason: z.string().min(10, 'Motivo deve ter pelo menos 10 caracteres').max(1000),
})

// ============================================================
// TIPOS INFERIDOS
// ============================================================

export type AreaPlanFormData = z.infer<typeof areaPlanSchema>
export type UpdateAreaPlanFormData = z.infer<typeof updateAreaPlanSchema>
export type PlanActionFormData = z.infer<typeof planActionSchema>
export type UpdatePlanActionFormData = z.infer<typeof updatePlanActionSchema>
export type SubtaskFormData = z.infer<typeof subtaskSchema>
export type UpdateSubtaskFormData = z.infer<typeof updateSubtaskSchema>
export type CommentFormData = z.infer<typeof commentSchema>
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>
export type RiskFormData = z.infer<typeof riskSchema>
export type UpdateRiskFormData = z.infer<typeof updateRiskSchema>
export type ApprovalNoteFormData = z.infer<typeof approvalNoteSchema>
export type RejectionFormData = z.infer<typeof rejectionSchema>
