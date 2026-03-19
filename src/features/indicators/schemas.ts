import { z } from 'zod'

export const indicatorSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  description: z.string().optional().or(z.literal('')),
  value: z.coerce.number(),
  previous_value: z.coerce.number().optional().or(z.literal('')),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  trend: z.enum(['up', 'down', 'stable']).optional(),
  date: z.string().min(1, 'Data é obrigatória'),
})

export type IndicatorFormSchema = z.infer<typeof indicatorSchema>
