import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { cn } from '@/shared/lib/cn'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  actions?: ReactNode
  rightSlot?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  rightSlot,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-2" />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-sm text-muted mt-0.5">{description}</p>
          )}
        </div>
        {(actions || rightSlot) && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}
