import type { ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from './icons'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryText?: string
  icon?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro ao carregar os dados. Tente novamente.',
  onRetry,
  retryText = 'Tentar novamente',
  icon,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-danger-50 text-danger-500 mb-4">
        {icon || <AlertTriangle className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          {retryText}
        </Button>
      )}
    </div>
  )
}
