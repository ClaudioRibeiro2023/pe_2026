import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileCheck, Shield, Building2 } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { useAreaBySlug } from '@/features/areas/hooks'
import { useEvidenceBacklog } from '../hooks'
import { EvidenceBacklogList, ApprovalPanel } from '../components/ApprovalPanel'
import { useAuth } from '@/features/auth/AuthProvider'

export function AreaPlanApprovalsPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: area, isLoading: areaLoading } = useAreaBySlug(areaSlug)
  const { data: backlog = [], isLoading: backlogLoading } = useEvidenceBacklog()
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)

  const userRole = user?.profile?.role || 'colaborador'
  const canApprove = userRole === 'admin' || userRole === 'gestor' || userRole === 'direcao'

  // Filter backlog by area
  const areaBacklog = backlog.filter((item) => item.area_slug === areaSlug)

  const mappedBacklog = areaBacklog.map((item) => ({
    evidence_id: item.evidence_id,
    action_id: item.action_id,
    action_title: item.action_title,
    area_name: item.area_name,
    filename: item.filename,
    status: item.evidence_status,
    submitted_at: item.submitted_at,
    submitted_by_email: item.submitted_by || '',
  }))

  const selectedEvidence = backlog.find((e) => e.evidence_id === selectedEvidenceId)

  if (areaLoading) {
    return <PageLoader text="Carregando área..." />
  }

  if (!area) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Área não encontrada</h3>
        <p className="text-muted mb-4">A área "{areaSlug}" não foi encontrada.</p>
        <Button onClick={() => navigate('/area-plans')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Planos
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(`/planning/${areaSlug}/dashboard`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aprovações - {area.name}</h1>
          <p className="text-muted">Gerencie aprovações de evidências desta área</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Evidências Pendentes ({mappedBacklog.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {backlogLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : canApprove ? (
              mappedBacklog.length > 0 ? (
                <EvidenceBacklogList
                  evidences={mappedBacklog}
                  userRole={userRole as 'admin' | 'gestor' | 'direcao'}
                  onSelectEvidence={setSelectedEvidenceId}
                />
              ) : (
                <div className="text-center py-12 text-muted">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 text-muted" />
                  <p>Nenhuma evidência pendente para esta área.</p>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-muted">
                <Shield className="w-12 h-12 mx-auto mb-3 text-muted" />
                <p>Você não tem permissão para aprovar evidências.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Detalhes da Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvidence ? (
              <ApprovalPanel
                evidence={{
                  id: selectedEvidence.evidence_id,
                  action_id: selectedEvidence.action_id,
                  filename: selectedEvidence.filename,
                  storage_path: '',
                  file_size: 0,
                  mime_type: '',
                  submitted_by: selectedEvidence.submitted_by,
                  submitted_at: selectedEvidence.submitted_at,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  status: selectedEvidence.evidence_status as any,
                }}
                userRole={userRole as 'admin' | 'gestor' | 'direcao' | 'colaborador'}
                onClose={() => setSelectedEvidenceId(null)}
              />
            ) : (
              <div className="text-center py-12 text-muted">
                <FileCheck className="w-12 h-12 mx-auto mb-3 text-muted" />
                <p>Selecione uma evidência para ver os detalhes.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
