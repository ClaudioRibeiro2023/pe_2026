/**
 * Calendar Theme — semantic token map for calendar event status.
 * Tokens-only: no raw colors allowed.
 */

export type CalendarEventStatus =
  | 'default'
  | 'overdue'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'awaiting'

/** Pill classes per status (background + text, light & dark) */
export const EVENT_STATUS_TOKENS: Record<CalendarEventStatus, string> = {
  default:     'bg-info-100 text-info-700 dark:bg-info-500/20 dark:text-info-400',
  overdue:     'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400',
  in_progress: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400',
  completed:   'bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-400',
  blocked:     'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400',
  awaiting:    'bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400',
}

/** In-progress dot fill colors (for small indicators) */
export const EVENT_STATUS_DOT: Record<CalendarEventStatus, string> = {
  default:     'bg-info-500',
  overdue:     'bg-danger-500',
  in_progress: 'bg-primary-500',
  completed:   'bg-success-500',
  blocked:     'bg-danger-500',
  awaiting:    'bg-warning-500',
}

/** Calendar grid tokens */
export const CAL = {
  // Grid structure
  grid:        'grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden',
  weekHeader:  'bg-accent p-2 text-center text-sm font-medium text-muted',

  // Day cell base
  dayBase:     'bg-surface p-2 min-h-[80px] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
  dayOutside:  'bg-accent/50 text-muted',
  dayToday:    'ring-2 ring-primary-500 ring-inset',
  daySelected: 'ring-2 ring-primary-400 bg-primary-50 dark:bg-primary-500/10',

  // Overflow indicator
  overflow:    'text-xs text-muted font-medium',

  // Mobile agenda mode
  agendaItem:  'flex items-start gap-3 p-3 border-b border-border last:border-b-0',
  agendaDate:  'text-sm font-semibold text-foreground',
  agendaEmpty: 'text-sm text-muted py-8 text-center',

  // Skeleton
  skeleton:    'animate-pulse bg-accent rounded',
} as const

/** Map ActionStatus → CalendarEventStatus */
export function mapActionStatus(status: string): CalendarEventStatus {
  switch (status) {
    case 'CONCLUIDA':              return 'completed'
    case 'EM_ANDAMENTO':           return 'in_progress'
    case 'BLOQUEADA':              return 'blocked'
    case 'AGUARDANDO_EVIDENCIA':
    case 'EM_VALIDACAO':           return 'awaiting'
    case 'CANCELADA':              return 'default'
    default:                       return 'default'
  }
}
