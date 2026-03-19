import { cn } from '@/shared/lib/cn'

export type ProgressVariant = 'default' | 'gradient' | 'segmented'
export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressStatus = 'success' | 'warning' | 'danger' | 'neutral'

export interface ProgressProps {
  value: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  status?: ProgressStatus
  showValue?: boolean
  className?: string
}

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const statusColors: Record<ProgressStatus, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  neutral: 'bg-primary-500',
}

const gradientColors: Record<ProgressStatus, string> = {
  success: 'bg-gradient-to-r from-success-400 to-success-600',
  warning: 'bg-gradient-to-r from-warning-400 to-warning-600',
  danger: 'bg-gradient-to-r from-danger-400 to-danger-600',
  neutral: 'bg-gradient-to-r from-primary-400 to-primary-600',
}

function getStatusFromValue(value: number, max: number): ProgressStatus {
  const percentage = (value / max) * 100
  if (percentage >= 100) return 'success'
  if (percentage >= 70) return 'neutral'
  if (percentage >= 40) return 'warning'
  return 'danger'
}

export function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  status,
  showValue = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const computedStatus = status || getStatusFromValue(value, max)

  const fillColor = variant === 'gradient' 
    ? gradientColors[computedStatus] 
    : statusColors[computedStatus]

  return (
    <div className={cn('w-full', className)}>
      {showValue && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-foreground">{Math.round(percentage)}%</span>
          <span className="text-xs text-muted">{value}/{max}</span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-accent overflow-hidden',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            fillColor
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  status?: ProgressStatus
  showValue?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  status,
  showValue = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const computedStatus = status || getStatusFromValue(value, max)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const strokeColors: Record<ProgressStatus, string> = {
    success: 'stroke-success-500',
    warning: 'stroke-warning-500',
    danger: 'stroke-danger-500',
    neutral: 'stroke-primary-500',
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-current text-accent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-all duration-500 ease-out', strokeColors[computedStatus])}
        />
      </svg>
      {showValue && (
        <span className="absolute text-sm font-bold font-mono text-foreground">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
