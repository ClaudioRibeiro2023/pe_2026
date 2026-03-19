import { lazy, Suspense } from 'react'
import type { ChartOptions } from 'chart.js'
import type { Indicator } from '@/features/indicators/types'

const BarChart = lazy(() =>
  Promise.all([import('react-chartjs-2'), import('chart.js')]).then(
    ([chartjs2, chartjs]) => {
      const { Chart: ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } = chartjs
      ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)
      return { default: chartjs2.Bar }
    }
  )
)

interface IndicatorsTrendChartProps {
  indicators: Indicator[]
}

export function IndicatorsTrendChart({ indicators }: IndicatorsTrendChartProps) {
  const palette = {
    success: 'rgb(var(--success-600))',
    danger: 'rgb(var(--danger-600))',
    muted: 'rgb(var(--muted))',
    border: 'rgb(var(--border))',
  }

  const chartData = indicators
    .filter(i => i.trend)
    .map(indicator => {
      const variation = indicator.previous_value 
        ? ((indicator.value - indicator.previous_value) / indicator.previous_value * 100)
        : 0
      
      return {
        name: indicator.name.length > 15 ? indicator.name.substring(0, 15) + '...' : indicator.name,
        valor: indicator.value,
        anterior: indicator.previous_value || 0,
        variacao: Math.round(variation),
        trend: indicator.trend,
      }
    })
    .slice(0, 6)

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted">
        <p>Nenhum indicador com tendência para exibir</p>
      </div>
    )
  }

  const getBarColor = (trend: string | null) => {
    if (trend === 'up') return palette.success
    if (trend === 'down') return palette.danger
    return palette.muted
  }

  const data = {
    labels: chartData.map((d) => d.name),
    datasets: [
      {
        label: 'Valor Atual',
        data: chartData.map((d) => d.valor),
        backgroundColor: chartData.map((d) => getBarColor(d.trend)),
        borderRadius: 8,
      },
      {
        label: 'Valor Anterior',
        data: chartData.map((d) => d.anterior),
        backgroundColor: palette.border,
        borderRadius: 8,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          afterBody: (items) => {
            const idx = items[0]?.dataIndex
            if (idx === undefined) return []
            const v = chartData[idx]?.variacao
            return [`Variação: ${v}%`]
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: palette.muted,
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: palette.muted,
          font: { size: 12 },
        },
        grid: {
          color: palette.border,
        },
      },
    },
  }

  return (
    <div className="h-[300px]">
      <Suspense fallback={<div className="h-full w-full rounded-lg skeleton" />}>
        <BarChart data={data} options={options} />
      </Suspense>
    </div>
  )
}
