import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import type { PlanActionFormData } from '../../schemas'

export function CostSection() {
  const {
    register,
    formState: { errors }
  } = useFormContext<PlanActionFormData>()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Custos</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Custo Estimado (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...register('cost_estimate', { valueAsNumber: true })}
            placeholder="0,00"
            error={errors.cost_estimate?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Tipo de Custo
          </label>
          <select
            {...register('cost_type')}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
          >
            <option value="">Selecione...</option>
            <option value="CAPEX">CAPEX - Capital</option>
            <option value="OPEX">OPEX - Operacional</option>
          </select>
          {errors.cost_type && (
            <p className="text-red-500 text-sm mt-1">{errors.cost_type.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>CAPEX:</strong> Investimentos em ativos permanentes (equipamentos, software, etc.)<br/>
          <strong>OPEX:</strong> Custos operacionais do dia a dia (salários, aluguel, etc.)
        </p>
      </div>
    </div>
  )
}
