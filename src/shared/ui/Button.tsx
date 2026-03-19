import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from './icons'
import { cn } from '@/shared/lib/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      secondary:
        'bg-accent text-foreground hover:bg-accent/80 focus-visible:ring-primary-400',
      outline:
        'border border-border bg-surface text-foreground hover:bg-accent focus-visible:ring-primary-400',
      ghost:
        'bg-transparent text-muted hover:bg-accent hover:text-foreground focus-visible:ring-primary-400',
      danger:
        'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-10 px-5 text-base gap-2',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <><Loader2 className="h-4 w-4 animate-spin" /><span className="sr-only">Carregando...</span></>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
