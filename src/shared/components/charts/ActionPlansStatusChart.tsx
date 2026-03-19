import { lazy, Suspense } from 'react'
import type { ChartOptions } from 'chart.js'
import type { ActionPlan } from '@/features/action-plans/types'

const PieChart = lazy(() =>
  Promise.all([import('react-chartjs-2'), import('chart.js')]).then(
    ([chartjs2, chartjs]) => {
      const { Chart: ChartJS, ArcElement, Tooltip, Legend } = chartjs
      ChartJS.register(ArcElement, Tooltip, Legend)
      return { default: chartjs2.Pie }
    }
  )
)

interface ActionPlansStatusChartProps {
  actionPlans: ActionPlan[]
}

export function ActionPlansStatusChart({ actionPlans }: ActionPlansStatusChartProps) {
  const statusCount = {
    draft: actionPlans.filter(ap => ap.status === 'draft').length,
    planned: actionPlans.filter(ap => ap.status === 'planned').length,
    in_progress: actionPlans.filter(ap => ap.status === 'in_progress').length,
    blocked: actionPlans.filter(ap => ap.status === 'blocked').length,
    completed: actionPlans.filter(ap => ap.status === 'completed').length,
    cancelled: actionPlans.filter(ap => ap.status === 'cancelled').length,
  }

  const palette = {
    draft: '#9ca3af',
    planned: '#3b82f6',
    inProgress: '#0066cc',
    blocked: '#ca8a04',
    completed: '#16a34a',
    cancelled: '#dc2626',
    surface: 'rgb(var(--surface))',
  }

  const chartData = [
    { name: 'Rascunho', value: statusCount.draft, color: palette.draft },
    { name: 'Planejado', value: statusCount.planned, color: palette.planned },
    { name: 'Em Execução', value: statusCount.in_progress, color: palette.inProgress },
    { name: 'Bloqueado', value: statusCount.blocked, color: palette.blocked },
    { name: 'Concluído', value: statusCount.completed, color: palette.completed },
    { name: 'Cancelado', value: statusCount.cancelled, color: palette.cancelled },
  ].filter(item => item.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted">
        <p>Nenhum plano de ação cadastrado</p>
      </div>
    )
  }

  // Total para referência futura
  // const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const data = {
    labels: chartData.map((i) => i.name),
    datasets: [
      {
        data: chartData.map((i) => i.value),
        backgroundColor: chartData.map((i) => i.color),
        borderWidth: 1,
        borderColor: palette.surface,
      },
    ],
  }

  const options: ChartOptions<'pie'> = {
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
          label: (context) => {
            const value = context.parsed
            const label = context.label || ''
            return `${label}: ${value} planos`
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px]">
      <Suspense fallback={<div className="h-full w-full rounded-lg skeleton" />}>
        <PieChart data={data} options={options} />
      </Suspense>
    </div>
  )
}
