import { useState, useMemo, useCallback, useRef, type KeyboardEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Calendar, ChevronLeft, ChevronRight } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useAreaBySlug } from '@/features/areas/hooks'
import { useAreaPlanByAreaSlug, usePlanActions } from '@/features/area-plans/hooks'
import { type PlanAction } from '@/features/area-plans/types'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isWithinInterval,
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  isToday as dateIsToday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EVENT_STATUS_TOKENS, EVENT_STATUS_DOT, CAL, mapActionStatus } from '@/shared/lib/calendarTheme'

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/* ── CalendarLegend ── */
function AreaCalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted mt-3">
      <div className="flex items-center gap-1.5">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${EVENT_STATUS_DOT.in_progress}`} />
        Em andamento
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${EVENT_STATUS_DOT.completed}`} />
        Concluída
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${EVENT_STATUS_DOT.overdue}`} />
        Bloqueada
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${EVENT_STATUS_DOT.awaiting}`} />
        Aguardando
      </div>
    </div>
  )
}

/* ── CalendarSkeleton ── */
function AreaCalendarSkeleton() {
  return (
    <div className={CAL.grid} aria-hidden="true">
      {WEEK_DAYS.map((d) => (
        <div key={d} className={CAL.weekHeader}>{d}</div>
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className={`${CAL.skeleton} min-h-[80px]`} />
      ))}
    </div>
  )
}

/* ── AgendaMode (mobile) ── */
function AreaAgendaMode({ days, getActionsForDay, onSelect }: {
  days: Date[]
  getActionsForDay: (day: Date) => PlanAction[]
  onSelect: (day: Date) => void
}) {
  const daysWithActions = days.filter((d) => getActionsForDay(d).length > 0)

  if (daysWithActions.length === 0) {
    return <p className={CAL.agendaEmpty}>Nenhuma ação neste mês.</p>
  }

  return (
    <div role="list" aria-label="Agenda de ações do mês">
      {daysWithActions.map((day) => {
        const dayActions = getActionsForDay(day)
        return (
          <button
            key={day.toISOString()}
            role="listitem"
            className={`${CAL.agendaItem} w-full text-left hover:bg-accent transition-colors`}
            onClick={() => onSelect(day)}
          >
            <div className="flex-shrink-0 w-14 text-center">
              <div className={CAL.agendaDate}>{format(day, 'd')}</div>
              <div className="text-xs text-muted">{format(day, 'EEE', { locale: ptBR })}</div>
            </div>
            <div className="flex-1 space-y-1">
              {dayActions.slice(0, 3).map((action) => (
                <div
                  key={action.id}
                  className={`text-xs p-1.5 rounded truncate ${EVENT_STATUS_TOKENS[mapActionStatus(action.status)]}`}
                >
                  {action.title}
                </div>
              ))}
              {dayActions.length > 3 && (
                <span className={CAL.overflow}>+{dayActions.length - 3} mais</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ── Main Page ── */
export function PlanningAreaCalendarPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [focusedDay, setFocusedDay] = useState<Date>(new Date())
  const gridRef = useRef<HTMLDivElement>(null)

  const { data: area, isLoading: areaLoading } = useAreaBySlug(areaSlug)
  const { data: plan } = useAreaPlanByAreaSlug(areaSlug || '', currentYear)
  const { data: actions = [], isLoading: actionsLoading } = usePlanActions(plan?.id || '')

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { locale: ptBR })
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR })
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const calendarDays = useMemo(() => 
    eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    [calendarStart, calendarEnd]
  )

  const getActionsForDay = useCallback((day: Date): PlanAction[] => {
    return actions.filter((action) => {
      if (!action.due_date) return false
      const dueDate = parseISO(action.due_date)
      return isSameDay(dueDate, day)
    })
  }, [actions])

  const getActionsInProgress = useCallback((day: Date): PlanAction[] => {
    return actions.filter((action) => {
      if (!action.start_date || !action.due_date) return false
      const start = parseISO(action.start_date)
      const end = parseISO(action.due_date)
      return isWithinInterval(day, { start, end })
    })
  }, [actions])

  const selectedDayActions = selectedDate ? getActionsForDay(selectedDate) : []
  const selectedDayInProgress = selectedDate ? getActionsInProgress(selectedDate) : []

  const handlePrevMonth = useCallback(() => setCurrentMonth((m) => subMonths(m, 1)), [])
  const handleNextMonth = useCallback(() => setCurrentMonth((m) => addMonths(m, 1)), [])

  /* Keyboard navigation (roving tabindex) */
  const handleGridKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null
    switch (e.key) {
      case 'ArrowRight': next = addDays(focusedDay, 1); break
      case 'ArrowLeft':  next = subDays(focusedDay, 1); break
      case 'ArrowDown':  next = addDays(focusedDay, 7); break
      case 'ArrowUp':    next = subDays(focusedDay, 7); break
      case 'Home':       next = startOfWeek(focusedDay, { locale: ptBR }); break
      case 'End':        next = endOfWeek(focusedDay, { locale: ptBR }); break
      case 'PageDown':   e.preventDefault(); handleNextMonth(); return
      case 'PageUp':     e.preventDefault(); handlePrevMonth(); return
      case 'Enter':
      case ' ':          e.preventDefault(); setSelectedDate(focusedDay); return
      default: return
    }
    if (next) {
      e.preventDefault()
      setFocusedDay(next)
      const cell = gridRef.current?.querySelector(`[data-date="${format(next, 'yyyy-MM-dd')}"]`) as HTMLElement
      cell?.focus()
    }
  }, [focusedDay, handleNextMonth, handlePrevMonth])

  if (areaLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!area) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Área não encontrada</h3>
        <p className="text-muted mb-4">A área "{areaSlug}" não foi encontrada.</p>
        <Button onClick={() => navigate('/planning/calendar')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Calendário
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/planning/calendar')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendário - {area.name}</h1>
          <p className="text-muted">{area.focus}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="capitalize">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</span>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth} aria-label="Mês anterior">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth} aria-label="Próximo mês">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {actionsLoading ? (
              <AreaCalendarSkeleton />
            ) : (
              <>
                {/* Desktop: grid 7-col */}
                <div
                  ref={gridRef}
                  className="hidden md:grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden"
                  role="grid"
                  aria-label={`Calendário ${area.name} — ${format(currentMonth, 'MMMM yyyy', { locale: ptBR })}`}
                  onKeyDown={handleGridKeyDown}
                >
                  <div role="row" className="contents">
                    {WEEK_DAYS.map((d) => (
                      <div key={d} role="columnheader" className={CAL.weekHeader}>{d}</div>
                    ))}
                  </div>
                  {calendarDays.map((day) => {
                    const dayKey = format(day, 'yyyy-MM-dd')
                    const dayActions = getActionsForDay(day)
                    const inProgressActions = getActionsInProgress(day)
                    const isCurrentMonth = isSameMonth(day, currentMonth)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const today = dateIsToday(day)
                    const focused = isSameDay(day, focusedDay)
                    const hasActions = dayActions.length > 0 || inProgressActions.length > 0
                    const totalEvents = dayActions.length + (dayActions.length === 0 ? inProgressActions.length : 0)

                    return (
                      <div
                        key={dayKey}
                        role="gridcell"
                        data-date={dayKey}
                        tabIndex={focused ? 0 : -1}
                        aria-label={`${format(day, "d 'de' MMMM yyyy", { locale: ptBR })}${totalEvents > 0 ? `, ${totalEvents} ação${totalEvents > 1 ? 'ões' : ''}` : ''}`}
                        onClick={() => setSelectedDate(day)}
                        onFocus={() => setFocusedDay(day)}
                        className={[
                          CAL.dayBase,
                          'min-h-[80px] cursor-pointer',
                          !isCurrentMonth ? CAL.dayOutside : '',
                          today ? CAL.dayToday : '',
                          isSelected ? CAL.daySelected : '',
                        ].filter(Boolean).join(' ')}
                      >
                        <span className={`text-sm font-medium ${today ? 'text-primary-600' : ''}`}>
                          {format(day, 'd')}
                        </span>
                        {hasActions && (
                          <div className="mt-1 space-y-0.5">
                            {dayActions.slice(0, 2).map((action) => (
                              <div
                                key={action.id}
                                className={`text-xs truncate px-1 py-0.5 rounded ${EVENT_STATUS_TOKENS[mapActionStatus(action.status)]}`}
                                title={action.title}
                              >
                                {action.title}
                              </div>
                            ))}
                            {dayActions.length > 2 && (
                              <button
                                className={`${CAL.overflow} px-1`}
                                aria-label={`Mais ${dayActions.length - 2} ações`}
                              >
                                +{dayActions.length - 2} mais
                              </button>
                            )}
                            {inProgressActions.length > 0 && dayActions.length === 0 && (
                              <div className="flex gap-0.5 px-1">
                                {inProgressActions.slice(0, 3).map((action) => (
                                  <span
                                    key={action.id}
                                    className={`inline-block w-2 h-2 rounded-full ${EVENT_STATUS_DOT[mapActionStatus(action.status)]}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Mobile: agenda mode */}
                <div className="md:hidden">
                  <AreaAgendaMode days={monthDays} getActionsForDay={getActionsForDay} onSelect={setSelectedDate} />
                </div>

                <AreaCalendarLegend />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                : 'Selecione uma data'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-muted text-sm">Clique em uma data para ver as ações.</p>
            ) : selectedDayActions.length === 0 && selectedDayInProgress.length === 0 ? (
              <p className="text-muted text-sm">Nenhuma ação nesta data.</p>
            ) : (
              <div className="space-y-4">
                {selectedDayActions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Vence nesta data</h4>
                    <div className="space-y-2">
                      {selectedDayActions.map((action) => (
                        <div 
                          key={action.id} 
                          className={`p-2 rounded-lg border border-border ${EVENT_STATUS_TOKENS[mapActionStatus(action.status)]}`}
                        >
                          <p className="font-medium text-sm">{action.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-accent text-foreground">
                              {action.priority}
                            </span>
                            {action.responsible && (
                              <span className="text-xs text-muted">{action.responsible}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDayInProgress.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Em andamento</h4>
                    <div className="space-y-2">
                      {selectedDayInProgress.filter(a => !selectedDayActions.includes(a)).map((action) => (
                        <div 
                          key={action.id} 
                          className="p-2 rounded-lg border border-border bg-accent"
                        >
                          <p className="font-medium text-sm text-foreground">{action.title}</p>
                          <p className="text-xs text-muted mt-1">
                            {action.start_date && format(parseISO(action.start_date), 'dd/MM')} - {action.due_date && format(parseISO(action.due_date), 'dd/MM')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
