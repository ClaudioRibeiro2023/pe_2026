import { useMemo } from 'react'
import { format, differenceInDays, isAfter, isBefore, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/shared/lib/cn'
import { ActionStatusBadge, PriorityBadge } from './StatusBadge'
import type { PlanAction } from '../types'

interface ActionTimelineProps {
  actions: PlanAction[]
  onActionClick?: (action: PlanAction) => void
}

export function ActionTimeline({ actions, onActionClick }: ActionTimelineProps) {
  const today = new Date()
  
  const { startDate, endDate, months } = useMemo(() => {
    const dates = actions
      .filter(a => a.start_date || a.due_date)
      .flatMap(a => [a.start_date, a.due_date].filter(Boolean) as string[])
      .map(d => new Date(d))

    if (dates.length === 0) {
      const start = startOfMonth(today)
      const end = endOfMonth(new Date(today.getFullYear(), today.getMonth() + 2))
      return { startDate: start, endDate: end, months: [] }
    }

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
    
    const start = startOfMonth(minDate)
    const end = endOfMonth(maxDate)

    const monthsList: { month: Date; days: Date[] }[] = []
    let currentMonth = start
    while (isBefore(currentMonth, end) || currentMonth.getMonth() === end.getMonth()) {
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(currentMonth)
      monthsList.push({
        month: monthStart,
        days: eachDayOfInterval({ start: monthStart, end: monthEnd }),
      })
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    }

    return { startDate: start, endDate: end, months: monthsList }
  }, [actions, today])

  const totalDays = differenceInDays(endDate, startDate) + 1

  const getActionPosition = (action: PlanAction) => {
    const actionStart = action.start_date ? new Date(action.start_date) : today
    const actionEnd = action.due_date ? new Date(action.due_date) : actionStart

    const startOffset = Math.max(0, differenceInDays(actionStart, startDate))
    const duration = Math.max(1, differenceInDays(actionEnd, actionStart) + 1)

    const left = (startOffset / totalDays) * 100
    const width = (duration / totalDays) * 100

    return { left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }
  }

  const isOverdue = (action: PlanAction) => {
    return action.due_date && 
      isAfter(today, new Date(action.due_date)) && 
      !['CONCLUIDA', 'CANCELADA'].includes(action.status)
  }

  const sortedActions = [...actions].sort((a, b) => {
    const aStart = a.start_date ? new Date(a.start_date).getTime() : Infinity
    const bStart = b.start_date ? new Date(b.start_date).getTime() : Infinity
    return aStart - bStart
  })

  if (actions.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        Nenhuma ação com datas definidas para exibir na timeline.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex border-b border-border mb-2">
          {months.map((m, idx) => (
            <div
              key={idx}
              className="text-center text-sm font-medium text-muted py-2 border-r border-border/50 last:border-r-0"
              style={{ width: `${(m.days.length / totalDays) * 100}%` }}
            >
              {format(m.month, 'MMMM yyyy', { locale: ptBR })}
            </div>
          ))}
        </div>

        <div className="relative">
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
            style={{ left: `${(differenceInDays(today, startDate) / totalDays) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-red-400 rounded-full" />
          </div>

          <div className="space-y-2">
            {sortedActions.map((action) => {
              const position = getActionPosition(action)
              const overdue = isOverdue(action)

              return (
                <div
                  key={action.id}
                  className="relative h-12 group"
                  onClick={() => onActionClick?.(action)}
                >
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                    <div className="w-48 flex-shrink-0 pr-2 truncate">
                      <span className="text-sm font-medium text-foreground truncate">
                        {action.title}
                      </span>
                    </div>
                    
                    <div className="flex-1 relative h-8">
                      <div
                        className={cn(
                          'absolute h-full rounded cursor-pointer transition-all',
                          'hover:shadow-md hover:scale-y-110',
                          action.status === 'CONCLUIDA' && 'bg-green-400',
                          action.status === 'EM_ANDAMENTO' && 'bg-blue-400',
                          action.status === 'BLOQUEADA' && 'bg-red-400',
                          action.status === 'AGUARDANDO_EVIDENCIA' && 'bg-yellow-400',
                          action.status === 'EM_VALIDACAO' && 'bg-purple-400',
                          action.status === 'PENDENTE' && 'bg-muted',
                          action.status === 'CANCELADA' && 'bg-accent',
                          overdue && 'ring-2 ring-red-500 ring-offset-1'
                        )}
                        style={position}
                      >
                        <div className="absolute inset-0 flex items-center px-2 overflow-hidden">
                          <span className="text-xs text-white font-medium truncate">
                            {action.progress > 0 && `${action.progress}%`}
                          </span>
                        </div>

                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                          <div className="bg-surface shadow-lg rounded-lg p-3 border border-border min-w-[200px]">
                            <p className="font-medium text-sm text-foreground mb-1">{action.title}</p>
                            <div className="flex items-center gap-2 mb-1">
                              <PriorityBadge priority={action.priority} />
                              <ActionStatusBadge status={action.status} />
                            </div>
                            <p className="text-xs text-muted">
                              {action.start_date && format(new Date(action.start_date), 'dd/MM/yyyy')}
                              {action.start_date && action.due_date && ' → '}
                              {action.due_date && format(new Date(action.due_date), 'dd/MM/yyyy')}
                            </p>
                            {action.responsible && (
                              <p className="text-xs text-muted mt-1">
                                Responsável: {action.responsible}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-muted" />
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-400" />
            <span>Em Andamento</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-400" />
            <span>Aguardando Evidência</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-400" />
            <span>Em Validação</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-400" />
            <span>Concluída</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-400" />
            <span>Bloqueada</span>
          </div>
        </div>
      </div>
    </div>
  )
}
