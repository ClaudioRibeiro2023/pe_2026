import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import { usePillars, useAreaOkrs, usePlanActions } from '../../hooks'
import type { PlanActionFormData } from '../../schemas'
import type { PlanAction } from '../../types'

interface ResponsibilitySectionProps {
  planId: string
  areaId: string
  isEditing?: boolean
  actionId?: string
}

export function ResponsibilitySection({ planId, areaId, isEditing, actionId }: ResponsibilitySectionProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext<PlanActionFormData>()

  const { data: pillars, isLoading: pillarsLoading } = usePillars()
  const { data: areaOkrs, isLoading: areaOkrsLoading } = useAreaOkrs(areaId)
  const { data: actions = [] } = usePlanActions(planId)

  // Filtrar ações que podem ser pais (não pode ser a própria ação nem folhas)
  const parentOptions = actions.filter((action: PlanAction) => {
    if (isEditing && action.id === actionId) return false
    if (action.node_type === 'acao') return false
    return true
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Responsabilidade e Vinculação</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Pilar
          </label>
          <select
            {...register('pillar_id')}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
            disabled={pillarsLoading}
          >
            <option value="">Selecione um pilar...</option>
            {pillars?.map((pillar) => (
              <option key={pillar.id} value={pillar.id}>
                {pillar.code} - {pillar.title}
              </option>
            ))}
          </select>
          {errors.pillar_id && (
            <p className="text-red-500 text-sm mt-1">{errors.pillar_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            OKR da Área
          </label>
          <select
            {...register('area_okr_id')}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
            disabled={areaOkrsLoading}
          >
            <option value="">Selecione um OKR...</option>
            {areaOkrs?.map((okr) => (
              <option key={okr.id} value={okr.id}>
                {okr.objective}
              </option>
            ))}
          </select>
          {errors.area_okr_id && (
            <p className="text-red-500 text-sm mt-1">{errors.area_okr_id.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Ação Pai
          </label>
          <select
            {...register('parent_action_id')}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
          >
            <option value="">Selecione uma ação pai...</option>
            {parentOptions.map((action: PlanAction) => (
              <option key={action.id} value={action.id}>
                {action.title}
              </option>
            ))}
          </select>
          {errors.parent_action_id && (
            <p className="text-red-500 text-sm mt-1">{errors.parent_action_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Responsável
          </label>
          <Input
            {...register('responsible')}
            placeholder="Nome do responsável..."
            error={errors.responsible?.message}
          />
        </div>
      </div>
    </div>
  )
}
