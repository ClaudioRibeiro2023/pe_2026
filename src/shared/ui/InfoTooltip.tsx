import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Tooltip } from './Tooltip'

interface InfoTooltipProps {
  title: string
  description: ReactNode
  details?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ReactNode
  className?: string
}

export function InfoTooltip({
  title,
  description,
  details,
  side = 'top',
  children,
  className,
}: InfoTooltipProps) {
  const detailItems =
    typeof details === 'string' && details.includes('·')
      ? details
          .split('·')
          .map((item) => item.trim())
          .filter(Boolean)
      : null

  return (
    <Tooltip
      side={side}
      variant="card"
      triggerClassName={cn('block w-full', className)}
      content={
        <div className="space-y-2 text-left">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted leading-relaxed">{description}</p>
          {details && (
            <div className="pt-2 border-t border-border/60 text-xs text-muted leading-relaxed">
              {detailItems ? (
                <ul className="space-y-1 pl-4 list-disc">
                  {detailItems.map((item, index) => (
                    <li key={`${item}-${index}`} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                details
              )}
            </div>
          )}
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}
