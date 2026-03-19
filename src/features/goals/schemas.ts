import { z } from 'zod'

export const goalSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(100, 'Título muito longo'),
  description: z.string().optional().or(z.literal('')),
  target_value: z.coerce.number().min(0, 'Valor meta deve ser maior ou igual a zero'),
  current_value: z.coerce.number().min(0, 'Valor atual deve ser maior ou igual a zero'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().min(1, 'Data de término é obrigatória'),
  status: z.enum(['active', 'paused', 'completed', 'cancelled']),
})

export type GoalFormSchema = z.infer<typeof goalSchema>
