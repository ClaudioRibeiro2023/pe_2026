import { TrendingUp, TrendingDown, Minus, Edit2, Trash2 } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { formatCurrency, formatNumber, formatDate } from '@/shared/lib/format'
import type { Indicator } from '../types'

interface IndicatorCardProps {
  indicator: Indicator
  onEdit: (indicator: Indicator) => void
  onDelete: (indicator: Indicator) => void
}

const trendIcons = {
  up: <TrendingUp className="h-5 w-5 text-success-600" />,
  down: <TrendingDown className="h-5 w-5 text-danger-600" />,
  stable: <Minus className="h-5 w-5 text-muted" />,
}

const trendLabels = {
  up: 'Em alta',
  down: 'Em baixa',
  stable: 'Estável',
}

const trendPillStyles = {
  up: 'border-success-100 bg-success-50 text-success-700',
  down: 'border-danger-100 bg-danger-50 text-danger-700',
  stable: 'border-border bg-surface text-muted',
}

export function IndicatorCard({ indicator, onEdit, onDelete }: IndicatorCardProps) {
  const formatValue = (value: number) => {
    if (indicator.unit === 'R$') return formatCurrency(value)
    if (indicator.unit === '%') return `${formatNumber(value)}%`
    return `${formatNumber(value)} ${indicator.unit}`
  }

  const hasPrevious = indicator.previous_value !== null
  const previousValue = indicator.previous_value ?? 0
  const canComputeVariation = hasPrevious && previousValue !== 0
  const variation = canComputeVariation
    ? ((indicator.value - previousValue) / previousValue) * 100
    : null
  const variationLabel = variation === null
    ? '—'
    : `${variation > 0 ? '+' : ''}${formatNumber(variation, 1)}%`
  const variationTone = variation === null
    ? 'text-muted'
    : variation > 0
    ? 'text-success-600'
    : variation < 0
    ? 'text-danger-600'
    : 'text-muted'

  return (
    <Card className="border-border/60">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {indicator.name}
              </h3>
              {indicator.trend && (
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${trendPillStyles[indicator.trend]}`}
                >
                  {trendLabels[indicator.trend]}
                </span>
              )}
            </div>
            {indicator.description && (
              <p className="text-sm text-muted mt-1">{indicator.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(indicator)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(indicator)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-3xl font-semibold text-foreground">
            {formatValue(indicator.value)}
          </p>
          {indicator.trend && trendIcons[indicator.trend]}
        </div>

        {hasPrevious && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">vs anterior:</span>
            <span className={`font-semibold ${variationTone}`}>{variationLabel}</span>
            <span className="text-muted">({formatValue(indicator.previous_value || 0)})</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            {indicator.category}
          </span>
          <span className="text-xs text-muted">
            {formatDate(indicator.date)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
