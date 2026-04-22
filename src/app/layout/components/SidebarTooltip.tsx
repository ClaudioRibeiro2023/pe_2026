import { cn } from '@/shared/lib/cn'

interface SidebarTooltipProps {
  label: string
  badge?: string
  notificationCount?: number
  visible: boolean
}

const BADGE_CLASS: Record<string, string> = {
  BETA: 'bg-warning-500/20 text-warning-400',
  DEV: 'bg-primary-500/20 text-primary-400',
  NEW: 'bg-success-500/20 text-success-400',
}

/**
 * SidebarTooltip — tooltip customizado para sidebar colapsada.
 * Posicionado absoluto à direita do item pai (que deve ser `relative`).
 */
export function SidebarTooltip({ label, badge, notificationCount, visible }: SidebarTooltipProps) {
  if (!visible) return null
  return (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 pointer-events-none animate-fade-in">
      <div className="px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-800 border border-white/10 shadow-xl whitespace-nowrap flex items-center gap-2">
        <span className="text-xs font-medium text-white">{label}</span>
        {badge && (
          <span
            className={cn(
              'text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full tracking-wide',
              BADGE_CLASS[badge] || 'bg-white/10 text-white/60'
            )}
          >
            {badge}
          </span>
        )}
        {notificationCount != null && notificationCount > 0 && (
          <span className="min-w-[16px] h-4 flex items-center justify-center rounded-full bg-danger-500 text-white text-[9px] font-bold px-1">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </div>
    </div>
  )
}
