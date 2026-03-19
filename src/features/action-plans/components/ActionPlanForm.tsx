import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { actionPlanSchema, type ActionPlanFormSchema } from '../schemas'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import type { ActionPlan } from '../types'

interface ActionPlanFormProps {
  plan?: ActionPlan
  onSubmit: (data: ActionPlanFormSchema) => void
  onCancel: () => void
  loading?: boolean
}

const statusOptions = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'planned', label: 'Planejado' },
  { value: 'in_progress', label: 'Em Execução' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
]

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
]

export function ActionPlanForm({ plan, onSubmit, onCancel, loading }: ActionPlanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActionPlanFormSchema>({
    resolver: zodResolver(actionPlanSchema),
    defaultValues: plan
      ? {
          title: plan.title,
          description: plan.description || '',
          status: plan.status,
          priority: plan.priority,
          responsible: plan.responsible || '',
          due_date: plan.due_date || '',
        }
      : {
          status: 'draft',
          priority: 'medium',
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título"
        placeholder="Ex: Implementar nova funcionalidade"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Descrição
        </label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Descreva o plano de ação..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-danger-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />

        <Select
          label="Prioridade"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Responsável"
          placeholder="Nome do responsável"
          error={errors.responsible?.message}
          {...register('responsible')}
        />

        <Input
          label="Data de Vencimento"
          type="date"
          error={errors.due_date?.message}
          {...register('due_date')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {plan ? 'Salvar Alterações' : 'Criar Plano'}
        </Button>
      </div>
    </form>
  )
}
