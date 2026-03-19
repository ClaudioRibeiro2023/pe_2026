import { Calendar, TrendingUp, Edit2, Trash2, Target } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { formatDate, formatCurrency, formatNumber } from '@/shared/lib/format'
import type { Goal } from '../types'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (goal: Goal) => void
}

const statusColors = {
  active: 'bg-primary-100 text-primary-700',
  paused: 'bg-warning-100 text-warning-700',
  completed: 'bg-success-100 text-success-700',
  cancelled: 'bg-danger-100 text-danger-700',
}

const statusLabels = {
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Concluída',
  cancelled: 'Cancelada',
}

const periodLabels = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0
  const progressClamped = Math.min(Math.max(progress, 0), 100)

  const formatValue = (value: number) => {
    if (goal.unit === 'R$') return formatCurrency(value)
    if (goal.unit === '%') return `${formatNumber(value)}%`
    return `${formatNumber(value)} ${goal.unit}`
  }

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  statusColors[goal.status]
                }`}
              >
                {statusLabels[goal.status]}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded bg-accent text-muted">
                {periodLabels[goal.period]}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-1">
              {goal.title}
            </h3>

            {goal.description && (
              <p className="text-sm text-muted mb-3">
                {goal.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(goal)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted" />
              <span className="text-sm font-medium text-foreground">
                Progresso
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {formatNumber(progressClamped, 1)}%
            </span>
          </div>
          <div className="w-full bg-accent rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                progressClamped >= 100
                  ? 'bg-success-500'
                  : progressClamped >= 75
                  ? 'bg-primary-500'
                  : progressClamped >= 50
                  ? 'bg-warning-500'
                  : 'bg-danger-500'
              }`}
              style={{ width: `${progressClamped}%` }}
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-muted mb-1">Atual</p>
            <p className="text-lg font-bold text-foreground">
              {formatValue(goal.current_value)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Meta</p>
            <p className="text-lg font-bold text-foreground">
              {formatValue(goal.target_value)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-muted pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(goal.start_date)} - {formatDate(goal.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="capitalize">{goal.category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
