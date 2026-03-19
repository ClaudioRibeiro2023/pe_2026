import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import type { PlanActionFormData } from '../../schemas'

export function TimelineSection() {
  const {
    register,
    formState: { errors }
  } = useFormContext<PlanActionFormData>()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Timeline</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Data de Início
          </label>
          <Input
            type="date"
            {...register('start_date')}
            error={errors.start_date?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Data de Término
          </label>
          <Input
            type="date"
            {...register('due_date')}
            error={errors.due_date?.message}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Defina as datas de início e término para a ação. O progresso será calculado automaticamente 
          com base no status e nas subtarefas concluídas.
        </p>
      </div>
    </div>
  )
}
