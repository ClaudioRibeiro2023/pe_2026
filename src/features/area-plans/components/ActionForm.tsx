import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Loader } from '@/shared/ui/Loader'
import { Loader2 } from '@/shared/ui/icons'
import { planActionSchema, type PlanActionFormData } from '../schemas'
import { usePillars, useAreaOkrs, useInitiatives, useCreatePlanAction, useUpdatePlanAction, usePlanActions } from '../hooks'
import type { PlanAction, Pillar, AreaOkr, Initiative, NodeType } from '../types'
import { NODE_TYPE_LABELS } from '@/features/plan-templates/types'

interface ActionFormProps {
  planId: string
  areaId: string
  action?: PlanAction
  parentActionId?: string
  defaultNodeType?: NodeType
  onSuccess?: () => void
  onCancel?: () => void
}

export function ActionForm({ planId, areaId, action, parentActionId, defaultNodeType = 'acao', onSuccess, onCancel }: ActionFormProps) {
  const isEditing = !!action

  const { data: pillars, isLoading: pillarsLoading } = usePillars()
  const { data: areaOkrs, isLoading: areaOkrsLoading } = useAreaOkrs(areaId)
  const { data: initiatives, isLoading: initiativesLoading } = useInitiatives()
  const { data: allActions = [], isLoading: actionsLoading } = usePlanActions(planId)

  // usePlanActions agora sempre retorna array
  const actionsArray = allActions

  // Filtrar ações que podem ser pais (não pode ser a própria ação nem filhas dela)
  const parentOptions = actionsArray.filter((a: PlanAction) => {
    if (isEditing && a.id === action?.id) return false
    if (a.node_type === 'acao') return false // Ações folha não podem ser pais
    return true
  })

  const createAction = useCreatePlanAction()
  const updateAction = useUpdatePlanAction()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanActionFormData>({
    resolver: zodResolver(planActionSchema),
    defaultValues: {
      plan_id: planId,
      pillar_id: action?.pillar_id ?? undefined,
      area_okr_id: action?.area_okr_id ?? undefined,
      initiative_id: action?.initiative_id ?? undefined,
      parent_action_id: action?.parent_action_id ?? parentActionId ?? undefined,
      node_type: action?.node_type ?? defaultNodeType,
      title: action?.title || '',
      description: action?.description ?? undefined,
      priority: action?.priority || 'P1',
      responsible: action?.responsible ?? undefined,
      start_date: action?.start_date ?? undefined,
      due_date: action?.due_date ?? undefined,
      evidence_required: action?.evidence_required ?? true,
      cost_estimate: action?.cost_estimate ?? undefined,
      cost_type: action?.cost_type ?? undefined,
    },
  })

  // Loading state para dados do formulário
  const isLoadingData = pillarsLoading || areaOkrsLoading || initiativesLoading || actionsLoading
  const isSaving = isSubmitting || createAction.isPending || updateAction.isPending

  const onSubmit = async (data: PlanActionFormData) => {
    try {
      const cleanData = {
        ...data,
        pillar_id: data.pillar_id || undefined,
        area_okr_id: data.area_okr_id || undefined,
        initiative_id: data.initiative_id || undefined,
        parent_action_id: data.parent_action_id || undefined,
        node_type: data.node_type || 'acao',
        description: data.description || undefined,
        responsible: data.responsible || undefined,
        start_date: data.start_date || undefined,
        due_date: data.due_date || undefined,
        cost_estimate: data.cost_estimate || undefined,
        cost_type: data.cost_type || undefined,
        assigned_to: undefined,
      }

      if (isEditing && action) {
        await updateAction.mutateAsync({
          actionId: action.id,
          data: cleanData,
        })
      } else {
        await createAction.mutateAsync(cleanData)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao salvar ação:', error)
    }
  }

  // Se está carregando dados essenciais, mostrar loader
  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="p-8">
          <Loader size="md" text="Carregando dados do formulário..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Ação' : 'Nova Ação'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('plan_id')} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Tipo de Nó *
              </label>
              <select
                {...register('node_type')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
              >
                <option value="macro">Macro</option>
                <option value="area">Área</option>
                <option value="meta">Meta</option>
                <option value="pilar">Pilar</option>
                <option value="acao">Ação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Ação Pai
              </label>
              <select
                {...register('parent_action_id')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
              >
                <option value="">Nenhuma (nível raiz)</option>
                {parentOptions.map((parent: PlanAction) => (
                  <option key={parent.id} value={parent.id}>
                    [{NODE_TYPE_LABELS[parent.node_type as NodeType] || parent.node_type}] {parent.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Título *
            </label>
            <Input
              {...register('title')}
              placeholder="Título da ação"
              error={errors.title?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Descrição
            </label>
            <textarea
              {...register('description')}
              placeholder="Descrição detalhada da ação..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Pilar Estratégico
              </label>
              <select
                {...register('pillar_id')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
              >
                <option value="">Selecione...</option>
                {pillars?.map((pillar: Pillar) => (
                  <option key={pillar.id} value={pillar.id}>
                    {pillar.code} - {pillar.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                OKR da Área
              </label>
              <select
                {...register('area_okr_id')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
              >
                <option value="">Selecione...</option>
                {areaOkrs?.map((okr: AreaOkr) => (
                  <option key={okr.id} value={okr.id}>
                    {okr.objective}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Iniciativa Vinculada
            </label>
            <select
              {...register('initiative_id')}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
            >
              <option value="">Selecione...</option>
              {initiatives?.map((initiative: Initiative) => (
                <option key={initiative.id} value={initiative.id}>
                  {initiative.code} - {initiative.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                <option value="P2">P2 - Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Responsável
              </label>
              <Input
                {...register('responsible')}
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Evidência Obrigatória
              </label>
              <select
                {...register('evidence_required')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Data de Início
              </label>
              <Input
                type="date"
                {...register('start_date')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Data de Entrega
              </label>
              <Input
                type="date"
                {...register('due_date')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Custo Estimado (R$)
              </label>
              <Input
                type="number"
                step="0.01"
                {...register('cost_estimate', { valueAsNumber: true })}
                placeholder="0,00"
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
                <option value="CAPEX">CAPEX</option>
                <option value="OPEX">OPEX</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                <>
                  {isEditing ? 'Salvar Alterações' : 'Criar Ação'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
