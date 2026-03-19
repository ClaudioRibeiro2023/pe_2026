import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, GripVertical, AlertTriangle, Clock, User } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAreaPlanByAreaSlug, fetchPlanActions, updateActionStatus } from '../api'
import { normalizeActionsData } from '../utils/dataNormalization'
import { KANBAN_COLUMNS, PRIORITY_COLORS, PRIORITY_LABELS } from '../types'
import type { PlanAction, ActionStatus } from '../types'

export function AreaPlansKanban() {
  const navigate = useNavigate()
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const queryClient = useQueryClient()
  const currentYear = new Date().getFullYear()
  const [draggedAction, setDraggedAction] = useState<PlanAction | null>(null)

  const {
    data: plan,
    isLoading: planLoading,
    isError: planError,
    error: planErrorMsg,
    refetch: refetchPlan,
  } = useQuery({
    queryKey: ['area-plan', areaSlug, currentYear],
    queryFn: () => fetchAreaPlanByAreaSlug(areaSlug!, currentYear),
    enabled: !!areaSlug,
  })

  const {
    data: actionsData,
    isLoading: actionsLoading,
    refetch: refetchActions,
  } = useQuery({
    queryKey: ['plan-actions', plan?.id],
    queryFn: () => fetchPlanActions(plan!.id),
    enabled: !!plan?.id,
  })

  const actions = normalizeActionsData(actionsData)

  const updateStatusMutation = useMutation({
    mutationFn: ({ actionId, status }: { actionId: string; status: string }) =>
      updateActionStatus(actionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-actions', plan?.id] })
    },
  })

  const columns = useMemo(() => {
    return KANBAN_COLUMNS.map((col) => ({
      ...col,
      actions: actions.filter((a) => a.status === col.id),
    }))
  }, [actions])

  const handleDragStart = (action: PlanAction) => {
    setDraggedAction(action)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (newStatus: ActionStatus) => {
    if (draggedAction && draggedAction.status !== newStatus) {
      updateStatusMutation.mutate({
        actionId: draggedAction.id,
        status: newStatus,
      })
    }
    setDraggedAction(null)
  }

  const isLoading = planLoading || actionsLoading

  if (isLoading) {
    return <PageLoader text="Carregando kanban..." />
  }

  if (planError) {
    return (
      <ErrorState
        title="Erro ao carregar plano"
        message={planErrorMsg instanceof Error ? planErrorMsg.message : undefined}
        onRetry={() => {
          refetchPlan()
          refetchActions()
        }}
      />
    )
  }

  if (!plan) {
    return (
      <EmptyState
        title="Plano não encontrado"
        description="O plano de ação solicitado não foi encontrado."
        action={
          <Button onClick={() => navigate('/planning')}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para lista
          </Button>
        }
      />
    )
  }

  const isOverdue = (action: PlanAction) => {
    if (!action.due_date) return false
    return new Date(action.due_date) < new Date() && !['CONCLUIDA', 'CANCELADA'].includes(action.status)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Kanban - {plan.area?.name}</h1>
          <p className="text-muted mt-1">{plan.title}</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <Card className={`${column.color} border-t-4`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {column.title}
                  <span className="bg-white/80 px-2 py-0.5 rounded-full text-xs">
                    {column.actions.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[400px]">
                {column.actions.map((action) => (
                  <div
                    key={action.id}
                    draggable
                    onDragStart={() => handleDragStart(action)}
                    className={`bg-white rounded-lg border border-border p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-shadow ${
                      draggedAction?.id === action.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {action.title}
                        </h4>
                        {action.description && (
                          <p className="text-xs text-muted mt-1 line-clamp-2">
                            {action.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                              PRIORITY_COLORS[action.priority]
                            }`}
                          >
                            {PRIORITY_LABELS[action.priority]}
                          </span>

                          {isOverdue(action) && (
                            <span className="flex items-center gap-1 text-xs text-danger-600">
                              <AlertTriangle className="h-3 w-3" />
                              Atrasada
                            </span>
                          )}

                          {action.due_date && (
                            <span className="flex items-center gap-1 text-xs text-muted">
                              <Clock className="h-3 w-3" />
                              {new Date(action.due_date).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>

                        {action.responsible && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted">
                            <User className="h-3 w-3" />
                            {action.responsible}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {column.actions.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center">
                    <p className="text-xs text-muted">Solte aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
