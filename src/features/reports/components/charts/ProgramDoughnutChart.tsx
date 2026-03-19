import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ProgramBreakdown } from '../../hooks'

ChartJS.register(ArcElement, Tooltip, Legend)

const PROGRAM_LABELS: Record<string, string> = {
  CON: 'Contratacao',
  DES: 'Desenvolvimento',
  REC: 'Reconhecimento',
  INO: 'Inovacao',
  SEM_PROGRAMA: 'Sem Programa',
}

const PROGRAM_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#22c55e', // green
  '#94a3b8', // slate
]

interface ProgramDoughnutChartProps {
  programBreakdown: ProgramBreakdown[]
}

export default function ProgramDoughnutChart({ programBreakdown }: ProgramDoughnutChartProps) {
  const data = useMemo(() => ({
    labels: programBreakdown.map(p => PROGRAM_LABELS[p.programKey] || p.programKey),
    datasets: [{
      data: programBreakdown.map(p => p.total),
      backgroundColor: programBreakdown.map((_, i) => PROGRAM_COLORS[i % PROGRAM_COLORS.length]),
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.8)',
      hoverOffset: 6,
    }],
  }), [programBreakdown])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148,163,184,0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => {
            const prog = programBreakdown[ctx.dataIndex]
            return ` ${ctx.label}: ${prog.total} acoes (${prog.completionRate}% concluidas)`
          },
        },
      },
    },
  }), [programBreakdown])

  return <Doughnut data={data} options={options} />
}
