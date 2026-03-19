import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { getColorClasses } from '@/shared/design/utils'
import type { ActionPriority, NodeType } from '@/features/area-plans/types'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  pulse?: boolean
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-accent text-muted',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-success-100 text-success-700 dark:bg-success-200/20 dark:text-success-500',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-100/20 dark:text-warning-500',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-100/20 dark:text-danger-500',
  info: 'bg-info-100 text-info-700 dark:bg-info-100/20 dark:text-info-500',
}

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full tracking-wide relative',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span
          className={cn(
            'absolute -left-0.5 -top-0.5 w-2 h-2 rounded-full animate-ping',
            variant === 'danger' && 'bg-danger-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'success' && 'bg-success-500',
            variant === 'primary' && 'bg-primary-500',
            variant === 'info' && 'bg-info-500',
            variant === 'default' && 'bg-muted'
          )}
        />
      )}
      {children}
    </span>
  )
}

// Badges específicos para o módulo de planejamento
export function PriorityBadge({ priority }: { priority: ActionPriority }) {
  const colors = getColorClasses.priority(priority)
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
      colors.bg, colors.text, colors.border
    )}>
      {colors.label}
    </span>
  )
}

export function NodeTypeBadge({ type }: { type: NodeType }) {
  const colors = getColorClasses.nodeType(type)
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
      colors.bg, colors.text, colors.border
    )}>
      {colors.label}
    </span>
  )
}
