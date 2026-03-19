import { cn } from '@/shared/lib/cn'
import {
  ActionStatus,
  ACTION_STATUS_LABELS,
  ACTION_STATUS_COLORS,
  AreaPlanStatus,
  PLAN_STATUS_LABELS,
  PLAN_STATUS_COLORS,
  EvidenceStatus,
  EVIDENCE_STATUS_LABELS,
  EVIDENCE_STATUS_COLORS,
  ActionPriority,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  RiskLevel,
  RISK_LEVEL_LABELS,
  RISK_LEVEL_COLORS,
} from '../types'

interface ActionStatusBadgeProps {
  status: ActionStatus
  className?: string
}

export function ActionStatusBadge({ status, className }: ActionStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        ACTION_STATUS_COLORS[status],
        className
      )}
    >
      {ACTION_STATUS_LABELS[status]}
    </span>
  )
}

interface PlanStatusBadgeProps {
  status: AreaPlanStatus
  className?: string
}

export function PlanStatusBadge({ status, className }: PlanStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        PLAN_STATUS_COLORS[status],
        className
      )}
    >
      {PLAN_STATUS_LABELS[status]}
    </span>
  )
}

interface EvidenceStatusBadgeProps {
  status: EvidenceStatus
  className?: string
}

export function EvidenceStatusBadge({ status, className }: EvidenceStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        EVIDENCE_STATUS_COLORS[status],
        className
      )}
    >
      {EVIDENCE_STATUS_LABELS[status]}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: ActionPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border',
        PRIORITY_COLORS[priority],
        className
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  )
}

interface RiskLevelBadgeProps {
  level: RiskLevel
  className?: string
}

export function RiskLevelBadge({ level, className }: RiskLevelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        RISK_LEVEL_COLORS[level],
        className
      )}
    >
      {RISK_LEVEL_LABELS[level]}
    </span>
  )
}
