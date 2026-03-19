import { useFormContext } from 'react-hook-form'
import type { PlanActionFormData } from '../../schemas'

export function OptionsSection() {
  const {
    register,
    watch
  } = useFormContext<PlanActionFormData>()

  const evidenceRequired = watch('evidence_required')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Opções Adicionais</h3>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('evidence_required')}
            className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-foreground">
            Exigir Evidências
          </span>
        </label>
        <p className="text-xs text-muted ml-7">
          Marque esta opção se a ação requer evidências documentais para comprovação.
        </p>
      </div>

      {evidenceRequired && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>Atenção:</strong> Ao marcar "Exigir Evidências", a ação só poderá ser concluída 
            após upload e aprovação das evidências necessárias.
          </p>
        </div>
      )}
    </div>
  )
}
