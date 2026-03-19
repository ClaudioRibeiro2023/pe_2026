import type { ReactNode } from 'react'

interface FilterBarProps {
  /** Filter controls (selects, inputs, chips) — rendered on the left */
  children: ReactNode
  /** Action buttons (export, clear, etc.) — rendered on the right */
  actions?: ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * FilterBar — Reusable filter bar with left (filters) and right (actions) slots.
 * Tokens-only styling, responsive with vertical wrap on small screens.
 */
export function FilterBar({ children, actions, className = '' }: FilterBarProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-surface border border-border rounded-lg ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3">{children}</div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

/* ---- Helper sub-components ---- */

interface FilterFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
}

export function FilterField({ label, htmlFor, children }: FilterFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-muted whitespace-nowrap"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export const filterSelectClass =
  'h-8 px-3 pr-8 text-sm rounded-lg border border-border bg-surface text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500'

export const filterInputClass =
  'h-8 px-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500'
