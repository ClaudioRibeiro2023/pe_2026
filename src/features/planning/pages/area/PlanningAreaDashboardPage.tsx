import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, LayoutGrid, Calendar, ListIcon, FileCheck, Shield, Target } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent } from '@/shared/ui/Card'
import { PageLoader } from '@/shared/ui/Loader'
import { useAreaBySlug } from '@/features/areas/hooks'
import { AreaPlanPage } from '@/features/area-plans/pages/AreaPlanPage'
import { useLastArea } from '../../hooks/useLastArea'
import { useEffect } from 'react'


interface QuickLinkProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color: string
}

function QuickLink({ icon, title, description, href, color }: QuickLinkProps) {
  const navigate = useNavigate()
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary-300"
      onClick={() => navigate(href)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PlanningAreaDashboardPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const navigate = useNavigate()
  const { data: area, isLoading: areaLoading } = useAreaBySlug(areaSlug)
  const { setLastArea } = useLastArea()

  // Salvar área atual no localStorage
  useEffect(() => {
    if (areaSlug) {
      setLastArea(areaSlug)
    }
  }, [areaSlug, setLastArea])

  if (areaLoading) {
    return <PageLoader text="Carregando área..." />
  }

  if (!area) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Área não encontrada</h3>
        <p className="text-muted mb-4">A área "{areaSlug}" não foi encontrada.</p>
        <Button onClick={() => navigate('/planning')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Planejamento
        </Button>
      </div>
    )
  }

  const quickLinks: QuickLinkProps[] = [
    {
      icon: <LayoutGrid className="w-5 h-5 text-primary-600" />,
      title: 'Kanban',
      description: 'Visualize ações em quadro',
      href: `/planning/${areaSlug}/kanban`,
      color: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      icon: <Calendar className="w-5 h-5 text-info-600" />,
      title: 'Timeline',
      description: 'Linha do tempo das ações',
      href: `/planning/${areaSlug}/timeline`,
      color: 'bg-info-100 dark:bg-info-500/20',
    },
    {
      icon: <ListIcon className="w-5 h-5 text-success-600" />,
      title: 'Gerenciar Planos',
      description: 'Lista de planos da área',
      href: `/planning/actions/manage?areaSlug=${areaSlug}`,
      color: 'bg-success-100 dark:bg-success-500/20',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-warning-600" />,
      title: 'Evidências',
      description: 'Backlog de evidências',
      href: `/planning/actions/evidences?areaSlug=${areaSlug}`,
      color: 'bg-warning-100 dark:bg-warning-500/20',
    },
    {
      icon: <Shield className="w-5 h-5 text-danger-600" />,
      title: 'Aprovações',
      description: 'Aprovar evidências',
      href: `/planning/actions/approvals?areaSlug=${areaSlug}`,
      color: 'bg-danger-100 dark:bg-danger-500/20',
    },
    {
      icon: <Target className="w-5 h-5 text-primary-600" />,
      title: 'Pacote Estratégico',
      description: 'PE 2026 da área',
      href: `/planning/${areaSlug}/pe-2026`,
      color: 'bg-primary-100 dark:bg-primary-900/30',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-medium text-muted mb-3">Acesso rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <QuickLink key={link.title} {...link} />
          ))}
        </div>
      </div>

      {/* Conteúdo original */}
      <AreaPlanPage />
    </div>
  )
}
