import { cn } from '@/shared/lib/cn'

interface LogoProps {
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Ícone do logo */}
      <div className="relative w-9 h-9 flex-shrink-0">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0052A3"/>
              <stop offset="100%" stopColor="#0066CC"/>
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)"/>
          <path d="M8 28 L16 20 L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <g transform="translate(21, 10) rotate(-35)">
            <path d="M0 5 L12 5 L15 3 L12 1 L0 1 Z" fill="white"/>
            <path d="M3 1 L5 -2 L7 1" fill="white"/>
            <path d="M9 5 L11 8 L13 5" fill="white"/>
          </g>
        </svg>
      </div>
      
      {/* Texto do logo */}
      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-foreground leading-tight">
              Estratégico
            </span>
            <span className="text-base font-bold text-primary-600 leading-tight">
              Aero
            </span>
          </div>
          <span className="text-[9px] text-muted uppercase tracking-wider">
            Planejamento que decola
          </span>
        </div>
      )}
    </div>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-9 h-9', className)}>
      <defs>
        <linearGradient id="logoMarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0052A3"/>
          <stop offset="100%" stopColor="#0066CC"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#logoMarkGradient)"/>
      <path d="M8 28 L16 20 L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <g transform="translate(21, 10) rotate(-35)">
        <path d="M0 5 L12 5 L15 3 L12 1 L0 1 Z" fill="white"/>
        <path d="M3 1 L5 -2 L7 1" fill="white"/>
        <path d="M9 5 L11 8 L13 5" fill="white"/>
      </g>
    </svg>
  )
}
