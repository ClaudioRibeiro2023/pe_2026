import { useState, useEffect } from 'react'
import { FileText, Filter, Search } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useEvidenceBacklog } from '@/features/area-plans/hooks'
import { EvidenceBacklogList } from '@/features/area-plans/components/ApprovalPanel'
import { useAuth } from '@/features/auth/AuthProvider'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

export function ActionsEvidencesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { data: backlog = [], isLoading } = useEvidenceBacklog()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Suporte a ?tab=pending para filtrar por status PENDENTE (GAP-001)
  const tabParam = searchParams.get('tab')
  const areaSlugParam = searchParams.get('areaSlug')
  const packIdParam = searchParams.get('packId')
  const initialFilter = tabParam === 'pending' ? 'PENDENTE' : 'all'
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter)
  
  // Atualizar filtro quando query param mudar
  useEffect(() => {
    if (tabParam === 'pending') {
      setStatusFilter('PENDENTE')
    }
  }, [tabParam])

  const userRole = user?.profile?.role || 'colaborador'
  const canViewBacklog = userRole === 'admin' || userRole === 'gestor' || userRole === 'direcao'

  const filteredBacklog = backlog.filter((item) => {
    const matchesSearch =
      item.action_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.area_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.evidence_status === statusFilter
    // Filtro por área se areaSlugParam estiver definido
    const matchesArea = !areaSlugParam || item.area_slug === areaSlugParam
    // Filtro por packId (para futuro uso quando evidências tiverem pack_id)
    // const matchesPack = !packIdParam || item.pack_id === packIdParam
    return matchesSearch && matchesStatus && matchesArea
  })

  // packIdParam disponível para uso futuro quando evidências tiverem pack_id
  void packIdParam

  const mappedBacklog = filteredBacklog.map((item) => ({
    evidence_id: item.evidence_id,
    action_id: item.action_id,
    action_title: item.action_title,
    area_name: item.area_name,
    filename: item.filename,
    status: item.evidence_status,
    submitted_at: item.submitted_at,
    submitted_by_email: item.submitted_by || '',
  }))

  const handleSelectEvidence = (evidenceId: string) => {
    navigate(`${ROUTES.PLANNING_ACTIONS_APPROVALS}?evidence=${evidenceId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Backlog de Evidências</h1>
          <p className="text-muted">Visualize todas as evidências pendentes de aprovação</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Evidências ({filteredBacklog.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">Todos os status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADA_GESTOR">Aprovada Gestor</option>
                <option value="APROVADA">Aprovada</option>
                <option value="REJEITADA">Rejeitada</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : canViewBacklog ? (
            <EvidenceBacklogList
              evidences={mappedBacklog}
              userRole={userRole}
              onSelectEvidence={handleSelectEvidence}
            />
          ) : (
            <div className="text-center py-12 text-muted">
              <FileText className="w-12 h-12 mx-auto mb-3 text-muted" />
              <p>Você não tem permissão para visualizar o backlog de evidências.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
