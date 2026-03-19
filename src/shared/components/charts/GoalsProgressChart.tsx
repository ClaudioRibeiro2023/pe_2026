import { lazy, Suspense } from 'react'
import type { ChartOptions } from 'chart.js'
import type { Goal } from '@/features/goals/types'

const LineChart = lazy(() =>
  Promise.all([import('react-chartjs-2'), import('chart.js')]).then(
    ([chartjs2, chartjs]) => {
      const {
        Chart: ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend,
      } = chartjs
      ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)
      return { default: chartjs2.Line }
    }
  )
)

interface GoalsProgressChartProps {
  goals: Goal[]
}

export function GoalsProgressChart({ goals }: GoalsProgressChartProps) {
  const palette = {
    primary: 'rgb(var(--primary-600))',
    primaryMuted: 'rgb(var(--primary-600) / 0.2)',
    success: 'rgb(var(--success-600))',
    muted: 'rgb(var(--muted))',
    border: 'rgb(var(--border))',
  }

  // Agrupar metas por período e calcular progresso médio
  const chartData = goals
    .filter(g => g.status === 'active')
    .map(goal => {
      const progress = Math.round((goal.current_value / goal.target_value) * 100)
      return {
        name: goal.title.length > 20 ? goal.title.substring(0, 20) + '...' : goal.title,
        progresso: progress,
        meta: 100,
        atual: goal.current_value,
        alvo: goal.target_value,
      }
    })
    .slice(0, 5) // Mostrar apenas 5 metas

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted">
        <p>Nenhuma meta ativa para exibir</p>
      </div>
    )
  }

  const data = {
    labels: chartData.map((d) => d.name),
    datasets: [
      {
        label: 'Progresso Atual',
        data: chartData.map((d) => d.progresso),
        borderColor: palette.primary,
        backgroundColor: palette.primaryMuted,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
      {
        label: 'Meta (100%)',
        data: chartData.map((d) => d.meta),
        borderColor: palette.success,
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          color: palette.muted,
          font: { size: 12 },
        },
        grid: {
          color: palette.border,
        },
      },
      x: {
        ticks: {
          color: palette.muted,
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
    },
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
          label: (context) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return `${label}: ${value}%`
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px]">
      <Suspense fallback={<div className="h-full w-full rounded-lg skeleton" />}>
        <LineChart data={data} options={options} />
      </Suspense>
    </div>
  )
}
