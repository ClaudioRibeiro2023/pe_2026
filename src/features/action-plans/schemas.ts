import { z } from 'zod'

// Schema básico (compatibilidade)
export const actionPlanBasicSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(100, 'Título muito longo'),
  description: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'planned', 'in_progress', 'blocked', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  responsible: z.string().optional().or(z.literal('')),
  due_date: z.string().optional().or(z.literal('')),
})

// Schema completo com 5W2H
export const actionPlanSchema = z.object({
  // Informações básicas
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(100, 'Título muito longo'),
  description: z.string().optional().or(z.literal('')),
  
  // Vinculações
  area_id: z.string().optional().or(z.literal('')),
  parent_plan_id: z.string().optional().or(z.literal('')),
  linked_kpis: z.array(z.string()).optional().default([]),
  linked_goals: z.array(z.string()).optional().default([]),
  
  // Status
  status: z.enum(['draft', 'planned', 'in_progress', 'blocked', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  health: z.enum(['on_track', 'at_risk', 'off_track']).optional().default('on_track'),
  
  // PDCA
  pdca_phase: z.enum(['plan', 'do', 'check', 'act']).optional().default('plan'),
  
  // 5W2H
  what: z.string().optional().or(z.literal('')),
  why: z.string().optional().or(z.literal('')),
  where: z.string().optional().or(z.literal('')),
  when_start: z.string().optional().or(z.literal('')),
  when_end: z.string().optional().or(z.literal('')),
  who_responsible: z.string().optional().or(z.literal('')),
  who_team: z.array(z.string()).optional().default([]),
  how: z.string().optional().or(z.literal('')),
  how_much: z.number().optional().default(0),
  
  // Riscos
  risk_level: z.enum(['low', 'medium', 'high']).optional().default('low'),
  risk_description: z.string().optional().or(z.literal('')),
  mitigation_plan: z.string().optional().or(z.literal('')),
  
  // Legado (compatibilidade)
  responsible: z.string().optional().or(z.literal('')),
  due_date: z.string().optional().or(z.literal('')),
})

// Schema para entrada PDCA
export const pdcaEntrySchema = z.object({
  phase: z.enum(['plan', 'do', 'check', 'act']),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  findings: z.string().optional().or(z.literal('')),
  actions_taken: z.string().optional().or(z.literal('')),
})

// Schema para milestone
export const milestoneSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  due_date: z.string().min(1, 'Data é obrigatória'),
})

// Schema para tarefa
export const taskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  status: z.enum(['todo', 'doing', 'done']),
  assignee_id: z.string().optional().or(z.literal('')),
  due_date: z.string().optional().or(z.literal('')),
})

export type ActionPlanFormSchema = z.infer<typeof actionPlanSchema>
export type ActionPlanBasicFormSchema = z.infer<typeof actionPlanBasicSchema>
export type PDCAEntryFormSchema = z.infer<typeof pdcaEntrySchema>
export type MilestoneFormSchema = z.infer<typeof milestoneSchema>
export type TaskFormSchema = z.infer<typeof taskSchema>
