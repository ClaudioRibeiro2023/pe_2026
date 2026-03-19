import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { indicatorSchema, type IndicatorFormSchema } from '../schemas'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import type { Indicator } from '../types'

interface IndicatorFormProps {
  indicator?: Indicator
  onSubmit: (data: IndicatorFormSchema) => void
  onCancel: () => void
  loading?: boolean
}

const trendOptions = [
  { value: 'up', label: 'Crescimento' },
  { value: 'down', label: 'Queda' },
  { value: 'stable', label: 'Estável' },
]

export function IndicatorForm({ indicator, onSubmit, onCancel, loading }: IndicatorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IndicatorFormSchema>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: indicator
      ? {
          name: indicator.name,
          description: indicator.description || '',
          value: indicator.value,
          previous_value: indicator.previous_value || 0,
          unit: indicator.unit,
          category: indicator.category,
          trend: indicator.trend || 'stable',
          date: indicator.date,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          trend: 'stable',
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome do Indicador"
        placeholder="Ex: NPS, Ticket Médio..."
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Descrição
        </label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={2}
          placeholder="Descrição do indicador..."
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
          error={errors.value?.message}
          {...register('value')}
        />

        <Input
          label="Valor Anterior"
          type="number"
          step="0.01"
          placeholder="0"
          error={errors.previous_value?.message}
          {...register('previous_value')}
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
          placeholder="vendas, satisfação, produção..."
          error={errors.category?.message}
          {...register('category')}
        />

        <Select
          label="Tendência"
          options={trendOptions}
          error={errors.trend?.message}
          {...register('trend')}
        />
      </div>

      <Input
        label="Data"
        type="date"
        error={errors.date?.message}
        {...register('date')}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {indicator ? 'Salvar Alterações' : 'Criar Indicador'}
        </Button>
      </div>
    </form>
  )
}
