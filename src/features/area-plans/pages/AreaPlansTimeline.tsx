import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, ChevronLeft, ChevronRight } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { useQuery } from '@tanstack/react-query'
import { fetchAreaPlanByAreaSlug, fetchPlanActions } from '../api'
import { ACTION_STATUS_COLORS, PRIORITY_COLORS } from '../types'
import { normalizeActionsData } from '../utils/dataNormalization'
import type { PlanAction } from '../types'
import { addMonths, format, differenceInDays, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type ZoomLevel = 'month' | 'quarter' | 'year'

export function AreaPlansTimeline() {
  const navigate = useNavigate()
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const currentYear = new Date().getFullYear()
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('quarter')
  const [viewStart, setViewStart] = useState(() => startOfMonth(new Date()))

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

  const zoomConfig = {
    month: { months: 1, dayWidth: 30 },
    quarter: { months: 3, dayWidth: 10 },
    year: { months: 12, dayWidth: 3 },
  }

  const config = zoomConfig[zoomLevel]

  const viewEnd = useMemo(() => endOfMonth(addMonths(viewStart, config.months - 1)), [viewStart, config.months])

  const months = useMemo(
    () => eachMonthOfInterval({ start: viewStart, end: viewEnd }),
    [viewStart, viewEnd]
  )

  const totalDays = differenceInDays(viewEnd, viewStart) + 1

  const getBarPosition = (action: PlanAction) => {
    if (!action.start_date || !action.due_date) return null

    const start = new Date(action.start_date)
    const end = new Date(action.due_date)

    if (end < viewStart || start > viewEnd) return null

    const effectiveStart = start < viewStart ? viewStart : start
    const effectiveEnd = end > viewEnd ? viewEnd : end

    const startOffset = differenceInDays(effectiveStart, viewStart)
    const duration = differenceInDays(effectiveEnd, effectiveStart) + 1

    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    }
  }

  const handlePrevious = () => {
    setViewStart((prev) => addMonths(prev, -config.months))
  }

  const handleNext = () => {
    setViewStart((prev) => addMonths(prev, config.months))
  }

  const handleZoomIn = () => {
    if (zoomLevel === 'year') setZoomLevel('quarter')
    else if (zoomLevel === 'quarter') setZoomLevel('month')
  }

  const handleZoomOut = () => {
    if (zoomLevel === 'month') setZoomLevel('quarter')
    else if (zoomLevel === 'quarter') setZoomLevel('year')
  }

  const isLoading = planLoading || actionsLoading

  if (isLoading) {
    return <PageLoader text="Carregando timeline..." />
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

  const actionsWithDates = actions.filter((a) => a.start_date && a.due_date)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Timeline - {plan.area?.name}</h1>
          <p className="text-muted mt-1">{plan.title}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted min-w-[150px] text-center">
            {format(viewStart, 'MMM yyyy', { locale: ptBR })} -{' '}
            {format(viewEnd, 'MMM yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel === 'month'}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel === 'year'}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cronograma de Ações</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Month Headers */}
          <div className="flex border-b border-border mb-4">
            {months.map((month) => (
              <div
                key={month.toISOString()}
                className="flex-1 text-center text-xs font-medium text-muted py-2 border-r border-border last:border-r-0"
              >
                {format(month, 'MMM yyyy', { locale: ptBR })}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {actionsWithDates.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>Nenhuma ação com datas definidas neste período.</p>
              </div>
            ) : (
              actionsWithDates.map((action) => {
                const position = getBarPosition(action)
                if (!position) return null

                return (
                  <div key={action.id} className="relative h-10 flex items-center">
                    <div className="absolute left-0 w-48 pr-2 text-xs text-foreground truncate">
                      {action.title}
                    </div>
                    <div className="ml-48 flex-1 relative h-6">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex">
                        {months.map((_, idx) => (
                          <div
                            key={idx}
                            className="flex-1 border-r border-border/30 last:border-r-0"
                          />
                        ))}
                      </div>

                      {/* Bar */}
                      <div
                        className={`absolute top-0 h-full rounded ${
                          ACTION_STATUS_COLORS[action.status].split(' ')[0]
                        } border ${PRIORITY_COLORS[action.priority].split(' ')[2] || 'border-gray-300'}`}
                        style={position}
                        title={`${action.title}\n${action.start_date} → ${action.due_date}`}
                      >
                        <div className="h-full flex items-center px-2">
                          <span className="text-xs font-medium truncate">
                            {action.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
          <span>Pendente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
          <span>Em Andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
          <span>Concluída</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
          <span>Bloqueada</span>
        </div>
      </div>
    </div>
  )
}
