/**
 * Mapa canônico de cores por pilar PE2026 (P1–P5)
 * Usa classes Tailwind semânticas e variantes dark nativas.
 * Importar em qualquer componente que precise colorir pilares.
 */

export interface PillarColorConfig {
  bg: string
  text: string
  light: string
  border: string
  gradient: string
}

export const PILLAR_COLORS: Record<string, PillarColorConfig> = {
  P1: {
    bg: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    light: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500 to-blue-600',
  },
  P2: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    light: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  P3: {
    bg: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    light: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    gradient: 'from-amber-500 to-amber-600',
  },
  P4: {
    bg: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    light: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
    gradient: 'from-violet-500 to-violet-600',
  },
  P5: {
    bg: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    light: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    gradient: 'from-rose-500 to-rose-600',
  },
}

export function getPillarColors(pillarKey: string): PillarColorConfig {
  return PILLAR_COLORS[pillarKey] ?? PILLAR_COLORS['P1']
}
