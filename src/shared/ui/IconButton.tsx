import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Size = 'xs' | 'sm' | 'md' | 'lg'
type Variant = 'ghost' | 'subtle' | 'solid' | 'danger'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  /** Texto acessível obrigatório — usado em aria-label e tooltip */
  label: string
  size?: Size
  variant?: Variant
}

const SIZE: Record<Size, string> = {
  xs: 'h-7 w-7 [&>*]:h-3.5 [&>*]:w-3.5',
  sm: 'h-8 w-8 [&>*]:h-4 [&>*]:w-4',
  md: 'h-9 w-9 [&>*]:h-[18px] [&>*]:w-[18px]',
  lg: 'h-10 w-10 [&>*]:h-5 [&>*]:w-5',
}

const VARIANT: Record<Variant, string> = {
  ghost:
    'text-muted hover:text-foreground hover:bg-accent',
  subtle:
    'text-muted hover:text-foreground bg-accent/50 hover:bg-accent',
  solid:
    'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
  danger:
    'text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-900/20',
}

/**
 * IconButton — botão de ícone com tamanho de clique adequado (≥28–40px),
 * aria-label obrigatório e tooltip via `title`.
 * Usar em toolbars, ações inline de tabela/card, toggles etc.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = 'sm', variant = 'ghost', className, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60',
        SIZE[size],
        VARIANT[variant],
        className
      )}
      {...rest}
    >
      {icon}
    </button>
  )
)

IconButton.displayName = 'IconButton'
