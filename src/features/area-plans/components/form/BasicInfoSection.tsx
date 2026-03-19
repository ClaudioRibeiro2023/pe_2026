import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import type { PlanActionFormData } from '../../schemas'

export function BasicInfoSection() {
  const {
    register,
    formState: { errors }
  } = useFormContext<PlanActionFormData>()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Informações Básicas</h3>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Título da Ação *
        </label>
        <Input
          {...register('title')}
          placeholder="Digite o título da ação..."
          error={errors.title?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Descrição
        </label>
        <textarea
          {...register('description')}
          placeholder="Descreva detalhadamente a ação..."
          className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none bg-surface"
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Prioridade *
          </label>
          <select
            {...register('priority')}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
          >
            <option value="P0">P0 - Crítica</option>
            <option value="P1">P1 - Alta</option>
            <option value="P2">P2 - Média</option>
          </select>
          {errors.priority && (
            <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Tipo de Nó *
          </label>
          <select
            {...register('node_type')}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
          >
            <option value="macro">Macro Ação</option>
            <option value="area">Área</option>
            <option value="meta">Meta</option>
            <option value="pilar">Pilar</option>
            <option value="acao">Ação</option>
          </select>
          {errors.node_type && (
            <p className="text-red-500 text-sm mt-1">{errors.node_type.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
