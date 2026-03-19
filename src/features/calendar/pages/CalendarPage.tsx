import { useState, useMemo } from 'react'
import {
  Activity,
  Calendar as CalendarIcon,
  ClipboardList,
  Target,
  TrendingUp,
} from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { formatDate, formatNumber } from '@/shared/lib/format'
import { Calendar } from '@/shared/components/calendar/Calendar'
import { useGoals } from '@/features/goals/hooks'
import { useActionPlans } from '@/features/action-plans/hooks'
import { PageLoader } from '@/shared/ui/Loader'
import { format } from 'date-fns/format'
import { ptBR } from 'date-fns/locale/pt-BR'

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { data: goals, isLoading: goalsLoading } = useGoals()
  const { data: plans, isLoading: plansLoading } = useActionPlans()

  const events = useMemo(() => {
    const allEvents: Array<{
      date: Date
      title: string
      type: 'goal' | 'action_plan'
      id: string
    }> = []

    if (goals) {
      goals.forEach(goal => {
        if (goal.end_date) {
          allEvents.push({
            date: new Date(goal.end_date),
            title: goal.title,
            type: 'goal' as const,
            id: goal.id,
          })
        }
      })
    }

    if (plans) {
      plans.forEach(plan => {
        if (plan.due_date) {
          allEvents.push({
            date: new Date(plan.due_date),
            title: plan.title,
            type: 'action_plan' as const,
            id: plan.id,
          })
        }
      })
    }

    return allEvents
  }, [goals, plans])

  const today = useMemo(() => {
    const base = new Date()
    base.setHours(0, 0, 0, 0)
    return base
  }, [])

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return events.filter(event => event.date.toDateString() === selectedDate.toDateString())
  }, [events, selectedDate])

  const upcomingEvents = useMemo(() => {
    const windowMs = 14 * 24 * 60 * 60 * 1000
    const start = today.getTime()
    const end = start + windowMs

    return events
      .filter(event => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        const time = eventDate.getTime()
        return time >= start && time <= end
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6)
  }, [events, today])

  const calendarStats = useMemo(() => {
    const goalsCount = events.filter(event => event.type === 'goal').length
    const plansCount = events.filter(event => event.type === 'action_plan').length

    return {
      total: events.length,
      goals: goalsCount,
      plans: plansCount,
      upcoming: upcomingEvents.length,
    }
  }, [events, upcomingEvents.length])

  const statCards = [
    {
      label: 'Eventos no calendário',
      value: formatNumber(calendarStats.total),
      helper: 'Visão consolidada do portfólio',
      icon: Activity,
      tone: 'border-primary-100 bg-primary-50 text-primary-700',
    },
    {
      label: 'Metas com prazo',
      value: formatNumber(calendarStats.goals),
      helper: 'Entrega estratégica',
      icon: Target,
      tone: 'border-warning-100 bg-warning-50 text-warning-700',
    },
    {
      label: 'Planos de ação',
      value: formatNumber(calendarStats.plans),
      helper: 'Iniciativas em andamento',
      icon: ClipboardList,
      tone: 'border-success-100 bg-success-50 text-success-700',
    },
    {
      label: 'Próximos 14 dias',
      value: formatNumber(calendarStats.upcoming),
      helper: 'Alertas imediatos',
      icon: TrendingUp,
      tone: 'border-border bg-accent text-foreground',
    },
  ]

  if (goalsLoading || plansLoading) {
    return <PageLoader text="Carregando calendário..." />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">
            Linha do tempo estratégica
          </p>
          <h1 className="text-3xl font-semibold text-foreground mt-2">Calendário</h1>
          <p className="text-muted mt-2 max-w-2xl">
            Acompanhe entregas estratégicas, marcos críticos e evolução dos planos em uma visão integrada.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2 text-sm text-muted">
          <CalendarIcon className="h-5 w-5 text-primary-600" />
          Atualizado em tempo real
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-2">{stat.value}</p>
                    <p className="text-xs text-muted mt-1">{stat.helper}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${stat.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Card className="border-border/60 shadow-soft">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Visão mensal</CardTitle>
              <p className="text-sm text-muted mt-1">Selecione uma data para detalhar os compromissos.</p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {format(today, "MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </CardHeader>
          <CardContent>
            <Calendar
              events={events}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Agenda do dia</CardTitle>
              <p className="text-xs text-muted mt-1">
                {selectedDate
                  ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
                  : 'Selecione uma data para visualizar'}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                    <div
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${
                        event.type === 'goal' ? 'bg-primary-600' : 'bg-success-600'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="text-xs text-muted mt-1">
                        {event.type === 'goal' ? 'Meta estratégica' : 'Plano de ação'} ·{' '}
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
                  Nenhum evento cadastrado para esta data.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Próximos 14 dias</CardTitle>
              <p className="text-xs text-muted mt-1">Priorize os marcos com vencimento próximo.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="text-xs text-muted mt-1">
                        {event.type === 'goal' ? 'Meta estratégica' : 'Plano de ação'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {format(event.date, 'dd MMM', { locale: ptBR })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
                  Nenhum evento previsto nas próximas semanas.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
