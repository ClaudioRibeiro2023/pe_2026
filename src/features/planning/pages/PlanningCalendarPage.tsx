import { useState, useMemo, useCallback, useRef, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronLeft, ChevronRight, Filter } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import type { Crumb } from '@/shared/ui/Breadcrumbs'
import { useAreaPlanProgress } from '@/features/area-plans/hooks'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isSameDay, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EVENT_STATUS_TOKENS, CAL } from '@/shared/lib/calendarTheme'

const breadcrumbs: Crumb[] = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Planejamento', href: '/planning' },
  { label: 'Calendário' },
]

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

interface CalEvent {
  id: string
  date: Date
  title: string
  area: string
  type: 'overdue' | 'default'
}

/* ── CalendarLegend ── */
function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted mt-3">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-danger-500" />
        Atrasadas
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-info-500" />
        Padrão
      </div>
    </div>
  )
}

/* ── CalendarSkeleton ── */
function CalendarSkeleton() {
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
function AgendaMode({ days, events, navigate }: {
  days: Date[]
  events: CalEvent[]
  navigate: (path: string) => void
}) {
  const daysWithEvents = days.filter((d) =>
    events.some((e) => isSameDay(e.date, d))
  )

  if (daysWithEvents.length === 0) {
    return <p className={CAL.agendaEmpty}>Nenhum evento neste mês.</p>
  }

  return (
    <div role="list" aria-label="Agenda do mês">
      {daysWithEvents.map((day) => {
        const dayEvts = events.filter((e) => isSameDay(e.date, day))
        return (
          <div key={day.toISOString()} role="listitem" className={CAL.agendaItem}>
            <div className="flex-shrink-0 w-14 text-center">
              <div className={CAL.agendaDate}>{format(day, 'd')}</div>
              <div className="text-xs text-muted">{format(day, 'EEE', { locale: ptBR })}</div>
            </div>
            <div className="flex-1 space-y-1">
              {dayEvts.map((evt) => (
                <button
                  key={evt.id}
                  className={`w-full text-left text-xs p-1.5 rounded truncate ${EVENT_STATUS_TOKENS[evt.type === 'overdue' ? 'overdue' : 'default']}`}
                  onClick={() => navigate(`/planning/${evt.area.toLowerCase()}`)}
                >
                  {evt.title}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Main Page ── */
export function PlanningCalendarPage() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [focusedDay, setFocusedDay] = useState<Date>(new Date())
  const { data: planProgress = [], isLoading } = useAreaPlanProgress(currentYear)
  const gridRef = useRef<HTMLDivElement>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { locale: ptBR })
  const calEnd = endOfWeek(monthEnd, { locale: ptBR })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const events: CalEvent[] = useMemo(() => {
    return planProgress.flatMap((plan) => {
      const evts: CalEvent[] = []
      if (plan.overdue_actions > 0) {
        evts.push({
          id: `overdue-${plan.plan_id}`,
          date: new Date(),
          title: `${plan.overdue_actions} ações atrasadas`,
          area: plan.area_name,
          type: 'overdue',
        })
      }
      return evts
    })
  }, [planProgress])

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

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
      default: return
    }
    if (next) {
      e.preventDefault()
      setFocusedDay(next)
      // Focus the cell in DOM
      const cell = gridRef.current?.querySelector(`[data-date="${format(next, 'yyyy-MM-dd')}"]`) as HTMLElement
      cell?.focus()
    }
  }, [focusedDay, handleNextMonth, handlePrevMonth])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendário de Planos"
        description="Visualize prazos e marcos dos planos de ação"
        breadcrumbs={breadcrumbs}
        actions={
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="capitalize">{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth} aria-label="Mês anterior">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth} aria-label="Próximo mês">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CalendarSkeleton />
          ) : (
            <>
              {/* Desktop: grid 7-col */}
              <div
                ref={gridRef}
                className="hidden md:grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden"
                role="grid"
                aria-label={`Calendário ${format(currentDate, 'MMMM yyyy', { locale: ptBR })}`}
                onKeyDown={handleGridKeyDown}
              >
                {/* Week header */}
                <div role="row" className="contents">
                  {WEEK_DAYS.map((d) => (
                    <div key={d} role="columnheader" className={CAL.weekHeader}>{d}</div>
                  ))}
                </div>
                {/* Day cells */}
                {days.map((day) => {
                  const dayKey = format(day, 'yyyy-MM-dd')
                  const dayEvents = events.filter((e) => format(e.date, 'yyyy-MM-dd') === dayKey)
                  const outside = !isSameMonth(day, currentDate)
                  const today = isToday(day)
                  const focused = isSameDay(day, focusedDay)

                  return (
                    <div
                      key={dayKey}
                      role="gridcell"
                      data-date={dayKey}
                      tabIndex={focused ? 0 : -1}
                      aria-label={`${format(day, "d 'de' MMMM yyyy", { locale: ptBR })}${dayEvents.length > 0 ? `, ${dayEvents.length} evento${dayEvents.length > 1 ? 's' : ''}` : ''}`}
                      className={[
                        CAL.dayBase,
                        'min-h-[100px]',
                        outside ? CAL.dayOutside : '',
                        today ? CAL.dayToday : '',
                      ].filter(Boolean).join(' ')}
                      onFocus={() => setFocusedDay(day)}
                    >
                      <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((evt) => (
                          <button
                            key={evt.id}
                            className={`w-full text-left text-xs p-1 rounded truncate cursor-pointer ${
                              EVENT_STATUS_TOKENS[evt.type === 'overdue' ? 'overdue' : 'default']
                            }`}
                            onClick={() => navigate(`/planning/${evt.area.toLowerCase()}`)}
                          >
                            {evt.title}
                          </button>
                        ))}
                        {dayEvents.length > 3 && (
                          <button
                            className={CAL.overflow}
                            aria-label={`Mais ${dayEvents.length - 3} eventos`}
                          >
                            +{dayEvents.length - 3} mais
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile: agenda mode */}
              <div className="md:hidden">
                <AgendaMode days={monthDays} events={events} navigate={navigate} />
              </div>

              <CalendarLegend />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
