import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { StatusDistribution } from '../../hooks'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  BLOQUEADA: 'Bloqueada',
  AGUARDANDO_EVIDENCIA: 'Aguard. Evid.',
  EM_VALIDACAO: 'Validacao',
  CONCLUIDA: 'Concluida',
  CANCELADA: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: '#94a3b8',
  EM_ANDAMENTO: '#3b82f6',
  BLOQUEADA: '#ef4444',
  AGUARDANDO_EVIDENCIA: '#f59e0b',
  EM_VALIDACAO: '#06b6d4',
  CONCLUIDA: '#22c55e',
  CANCELADA: '#6b7280',
}

interface StatusBarChartProps {
  statusDistribution: StatusDistribution[]
}

export default function StatusBarChart({ statusDistribution }: StatusBarChartProps) {
  const data = useMemo(() => ({
    labels: statusDistribution.map(s => STATUS_LABELS[s.status] || s.status),
    datasets: [{
      label: 'Acoes',
      data: statusDistribution.map(s => s.count),
      backgroundColor: statusDistribution.map(s => STATUS_COLORS[s.status] || '#94a3b8'),
      borderRadius: 6,
      maxBarThickness: 48,
    }],
  }), [statusDistribution])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148,163,184,0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148,163,184,0.15)' },
        ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 5 },
      },
    },
  }), [])

  return <Bar data={data} options={options} />
}
