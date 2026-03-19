import { Calendar, User, Edit2, Trash2 } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { formatDate } from '@/shared/lib/format'
import type { ActionPlan } from '../types'

interface ActionPlanCardProps {
  plan: ActionPlan
  onEdit: (plan: ActionPlan) => void
  onDelete: (plan: ActionPlan) => void
  onView?: (plan: ActionPlan) => void
}

const statusColors: Record<string, string> = {
  draft: 'bg-accent text-muted',
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-primary-100 text-primary-700',
  blocked: 'bg-warning-100 text-warning-700',
  completed: 'bg-success-100 text-success-700',
  cancelled: 'bg-danger-100 text-danger-700',
}

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  planned: 'Planejado',
  in_progress: 'Em Execução',
  blocked: 'Bloqueado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

const priorityColors: Record<string, string> = {
  low: 'bg-accent text-muted',
  medium: 'bg-warning-100 text-warning-700',
  high: 'bg-danger-100 text-danger-700',
  critical: 'bg-danger-600 text-white',
}

const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
}

export function ActionPlanCard({ plan, onEdit, onDelete, onView }: ActionPlanCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onView?.(plan)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  statusColors[plan.status]
                }`}
              >
                {statusLabels[plan.status]}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  priorityColors[plan.priority]
                }`}
              >
                {priorityLabels[plan.priority]}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-1">
              {plan.title}
            </h3>

            {plan.description && (
              <p className="text-sm text-muted mb-3 line-clamp-2">
                {plan.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              {plan.responsible && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{plan.responsible}</span>
                </div>
              )}
              {plan.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(plan.due_date)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(plan)
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(plan)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
