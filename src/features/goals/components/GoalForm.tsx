import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { goalSchema, type GoalFormSchema } from '../schemas'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import type { Goal } from '../types'

interface GoalFormProps {
  goal?: Goal
  onSubmit: (data: GoalFormSchema) => void
  onCancel: () => void
  loading?: boolean
}

const statusOptions = [
  { value: 'active', label: 'Ativa' },
  { value: 'paused', label: 'Pausada' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' },
]

const periodOptions = [
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
]

export function GoalForm({ goal, onSubmit, onCancel, loading }: GoalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormSchema>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal
      ? {
          title: goal.title,
          description: goal.description || '',
          target_value: goal.target_value,
          current_value: goal.current_value,
          unit: goal.unit,
          category: goal.category,
          period: goal.period,
          start_date: goal.start_date,
          end_date: goal.end_date,
          status: goal.status,
        }
      : {
          status: 'active',
          period: 'monthly',
          current_value: 0,
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título"
        placeholder="Ex: Receita Mensal"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Descrição
        </label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Descreva a meta..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-danger-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Valor Atual"
          type="number"
          step="0.01"
          placeholder="0"
          error={errors.current_value?.message}
          {...register('current_value')}
        />

        <Input
          label="Valor Meta"
          type="number"
          step="0.01"
          placeholder="0"
          error={errors.target_value?.message}
          {...register('target_value')}
        />

        <Input
          label="Unidade"
          placeholder="R$, %, unidades..."
          error={errors.unit?.message}
          {...register('unit')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Categoria"
          placeholder="vendas, produção, qualidade..."
          error={errors.category?.message}
          {...register('category')}
        />

        <Select
          label="Período"
          options={periodOptions}
          error={errors.period?.message}
          {...register('period')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Data de Início"
          type="date"
          error={errors.start_date?.message}
          {...register('start_date')}
        />

        <Input
          label="Data de Término"
          type="date"
          error={errors.end_date?.message}
          {...register('end_date')}
        />
      </div>

      <Select
        label="Status"
        options={statusOptions}
        error={errors.status?.message}
        {...register('status')}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {goal ? 'Salvar Alterações' : 'Criar Meta'}
        </Button>
      </div>
    </form>
  )
}
