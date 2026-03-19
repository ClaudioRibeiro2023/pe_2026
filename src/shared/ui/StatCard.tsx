import type { ReactNode } from 'react'
import { Card } from './Card'
import { TrendingUp, TrendingDown, Minus } from './icons'
import { cn } from '@/shared/lib/cn'

export interface StatCardProps {
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  icon?: ReactNode
  status?: 'success' | 'warning' | 'danger' | 'neutral'
  description?: string
  className?: string
}

const statusColors = {
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
  neutral: 'text-muted',
}

const trendColors = {
  up: 'text-success-600',
  down: 'text-danger-600',
  stable: 'text-muted',
}

const TrendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

export function StatCard({
  title,
  value,
  trend,
  trendValue,
  icon,
  status = 'neutral',
  description,
  className,
}: StatCardProps) {
  const Icon = trend ? TrendIcon[trend] : null

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className={cn('text-3xl font-bold font-mono tracking-tight', statusColors[status])}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30">
            {icon}
          </div>
        )}
      </div>
      
      {(trend || description) && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', trendColors[trend])}>
              {Icon && <Icon className="h-4 w-4" />}
              <span>{trendValue}</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted">{description}</p>
          )}
        </div>
      )}
    </Card>
  )
}
