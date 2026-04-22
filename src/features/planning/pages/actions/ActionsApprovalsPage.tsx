import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileCheck, Shield, CheckCircle } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useEvidenceBacklog } from '@/features/area-plans/hooks'
import { EvidenceBacklogList, ApprovalPanel } from '@/features/area-plans/components/ApprovalPanel'
import { useAuth } from '@/features/auth/AuthProvider'

export function ActionsApprovalsPage() {
  const [searchParams] = useSearchParams()
  const areaSlugParam = searchParams.get('areaSlug')
  const packIdParam = searchParams.get('packId')
  const { user } = useAuth()
  const { data: backlog = [], isLoading } = useEvidenceBacklog()
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)

  const userRole = user?.profile?.role || 'colaborador'
  const canApprove = userRole === 'admin' || userRole === 'gestor' || userRole === 'direcao'

  // Filtra por área e packId se definidos
  const filteredBacklog = backlog.filter((item) => {
    const matchesArea = !areaSlugParam || item.area_slug === areaSlugParam
    // packId filter preparado para uso futuro
    const _matchesPack = !packIdParam // || item.pack_id === packIdParam
    return matchesArea && _matchesPack
  })

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

  const selectedEvidence = filteredBacklog.find((e) => e.evidence_id === selectedEvidenceId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aprovações</h1>
          <p className="text-muted">Gerencie aprovações de evidências dos planos de ação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Evidências Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
              </div>
            ) : canApprove ? (
              <EvidenceBacklogList
                evidences={mappedBacklog}
                userRole={userRole as 'admin' | 'gestor' | 'direcao'}
                onSelectEvidence={setSelectedEvidenceId}
              />
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
                  status: selectedEvidence.evidence_status,
                }}
                userRole={userRole as 'admin' | 'gestor' | 'direcao' | 'colaborador'}
                onClose={() => setSelectedEvidenceId(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning-500 flex items-center justify-center ring-2 ring-surface animate-pulse">
                    <span className="text-[11px] font-bold text-white">{mappedBacklog.length || 0}</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Nenhuma evidência selecionada
                </h3>
                <p className="text-xs text-muted max-w-[260px] mb-5">
                  {mappedBacklog.length > 0
                    ? `${mappedBacklog.length} evidência${mappedBacklog.length > 1 ? 's' : ''} aguardando sua aprovação. Selecione uma à esquerda para revisar.`
                    : 'Tudo em dia! Não há evidências pendentes no momento.'}
                </p>
                {mappedBacklog.length > 0 && (
                  <div className="w-full max-w-[280px] text-left space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                      Como aprovar
                    </p>
                    {[
                      'Clique na evidência desejada',
                      'Revise o anexo e comente se necessário',
                      'Aprove ou rejeite com justificativa',
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-foreground">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
                {mappedBacklog.length === 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-success-600 dark:text-success-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="font-medium">Backlog limpo</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
