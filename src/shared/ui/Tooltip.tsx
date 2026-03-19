import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
  variant?: 'default' | 'card'
  className?: string
  triggerClassName?: string
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 300,
  variant = 'default',
  className,
  triggerClassName,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    let top = 0
    let left = 0

    switch (side) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.right + 8
        break
      case 'bottom':
        top = triggerRect.bottom + 8
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.left - tooltipRect.width - 8
        break
    }

    setPosition({ top, left })
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className={cn('inline-block', triggerClassName)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'fixed z-[100] px-3 py-2 text-xs font-medium rounded-lg shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-none',
            variant === 'card'
              ? 'bg-surface/95 text-foreground border border-border/70 shadow-2xl max-w-sm rounded-xl px-4 py-3 backdrop-blur'
              : 'text-white bg-foreground',
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 rotate-45',
              variant === 'card'
                ? 'bg-surface/95 border border-border/70 shadow-md'
                : 'bg-foreground',
              side === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
              side === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
              side === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
              side === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2'
            )}
          />
        </div>
      )}
    </>
  )
}
