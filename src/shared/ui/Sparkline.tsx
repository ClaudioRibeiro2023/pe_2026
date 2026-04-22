import { useMemo } from 'react'
import { cn } from '@/shared/lib/cn'

type SparkTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

interface SparklineProps {
  /** Série de valores numéricos (mínimo 2 pontos). */
  data: number[]
  /** Largura do SVG em pixels. Default 96. */
  width?: number
  /** Altura do SVG em pixels. Default 28. */
  height?: number
  /** Cor/tom. Default primary. */
  tone?: SparkTone
  /** Se true, renderiza uma área preenchida abaixo da linha. */
  area?: boolean
  /** Mostra marcador no último ponto. Default true. */
  endpointDot?: boolean
  /** Espessura da linha. Default 1.5. */
  strokeWidth?: number
  /** Classe extra para o SVG wrapper. */
  className?: string
  /** Label acessível (aria-label). */
  label?: string
}

/**
 * Usa `currentColor` via classe `text-*` no SVG pai — evita dependência de
 * classes `stroke-*` / `fill-*` Tailwind que não existem para cores
 * customizadas do tema por default.
 */
const TONE_COLOR: Record<SparkTone, string> = {
  primary: 'text-primary-500 dark:text-primary-400',
  success: 'text-success-500 dark:text-success-400',
  warning: 'text-warning-500 dark:text-warning-400',
  danger: 'text-danger-500 dark:text-danger-400',
  neutral: 'text-muted',
}

/**
 * Sparkline — minigráfico inline em SVG puro.
 * - Sem dependências externas (recharts, etc.)
 * - Responsivo (preserveAspectRatio="none")
 * - Usa tons do design system via Tailwind stroke/fill
 *
 * Exemplo:
 *   <Sparkline data={[10, 12, 8, 15, 20, 18, 22]} tone="success" area />
 */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  tone = 'primary',
  area = true,
  endpointDot = true,
  strokeWidth = 1.5,
  className,
  label,
}: SparklineProps) {
  const path = useMemo(() => buildPath(data, width, height), [data, width, height])

  if (!path) return null

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn('overflow-visible', TONE_COLOR[tone], className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {area && (
        <path
          d={`${path.line} L ${width} ${height} L 0 ${height} Z`}
          fill="currentColor"
          fillOpacity={0.12}
          stroke="none"
        />
      )}
      <path
        d={path.line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {endpointDot && (
        <circle
          cx={path.lastX}
          cy={path.lastY}
          r={2.2}
          fill="currentColor"
        />
      )}
    </svg>
  )
}

function buildPath(data: number[], w: number, h: number) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = w / (data.length - 1)
  // Margem superior/inferior (2px) para o dot não cortar nas bordas
  const padY = 2.5
  const innerH = h - padY * 2

  const points = data.map((v, i) => {
    const x = i * stepX
    const y = padY + innerH - ((v - min) / range) * innerH
    return [x, y] as const
  })

  const line =
    'M ' + points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')

  const [lastX, lastY] = points[points.length - 1]
  return { line, lastX, lastY }
}
