import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-day-picker/dist/style.css'

interface CalendarEvent {
  date: Date
  title: string
  type: 'goal' | 'action_plan'
  id: string
}

interface CalendarProps {
  events?: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

export function Calendar({ events = [], onDateSelect, selectedDate }: CalendarProps) {
  const [month, setMonth] = useState<Date>(selectedDate || new Date())

  const { goalDates, planDates } = useMemo(() => {
    const goals = new Set<string>()
    const plans = new Set<string>()

    events.forEach((event) => {
      const key = event.date.toDateString()
      if (event.type === 'goal') {
        goals.add(key)
      } else {
        plans.add(key)
      }
    })

    return { goalDates: goals, planDates: plans }
  }, [events])

  const modifiers = {
    hasGoal: (date: Date) => goalDates.has(date.toDateString()),
    hasPlan: (date: Date) => planDates.has(date.toDateString()),
  }

  const modifiersClassNames = {
    hasGoal: 'calendar-day-goal',
    hasPlan: 'calendar-day-plan',
  }

  return (
    <div className="space-y-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect?.(date)}
        month={month}
        onMonthChange={setMonth}
        locale={ptBR}
        showOutsideDays
        fixedWeeks
        weekStartsOn={1}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className="calendar-custom"
      />

      {events.length > 0 && (
        <div className="rounded-2xl border border-border bg-accent/40 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-primary-600" />
              <span>Metas estratégicas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-success-600" />
              <span>Planos de ação</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
