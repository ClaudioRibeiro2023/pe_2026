import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield
} from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { 
  useApproveEvidenceAsManager, 
  useApproveEvidenceAsDirection, 
  useRejectEvidence 
} from '../hooks'
import type { ActionEvidence, EvidenceApproval } from '../types'

interface ApprovalPanelProps {
  evidence: ActionEvidence
  userRole: 'admin' | 'gestor' | 'direcao' | 'colaborador'
  onClose?: () => void
}

export function ApprovalPanel({ evidence, userRole, onClose }: ApprovalPanelProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [approvalNote, setApprovalNote] = useState('')

  const approveAsManager = useApproveEvidenceAsManager()
  const approveAsDirection = useApproveEvidenceAsDirection()
  const rejectEvidence = useRejectEvidence()

  // Admin pode aprovar em qualquer etapa
  const canApproveAsManager = (userRole === 'gestor' || userRole === 'admin') && evidence.status === 'PENDENTE'
  const canApproveAsDirection = (userRole === 'direcao' || userRole === 'admin') && evidence.status === 'APROVADA_GESTOR'
  const canReject = (userRole === 'gestor' || userRole === 'direcao' || userRole === 'admin') && 
    ['PENDENTE', 'APROVADA_GESTOR'].includes(evidence.status)

  const handleApprove = async () => {
    try {
      if (userRole === 'gestor' || (userRole === 'admin' && evidence.status === 'PENDENTE')) {
        await approveAsManager.mutateAsync({ 
          evidenceId: evidence.id, 
          note: approvalNote || undefined 
        })
      } else if (userRole === 'direcao' || userRole === 'admin') {
        await approveAsDirection.mutateAsync({ 
          evidenceId: evidence.id, 
          note: approvalNote || undefined 
        })
      }
      onClose?.()
    } catch (error) {
      console.error('Erro ao aprovar:', error)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Informe o motivo da rejeição')
      return
    }

    try {
      await rejectEvidence.mutateAsync({ 
        evidenceId: evidence.id, 
        role: userRole as 'gestor' | 'direcao',
        reason: rejectReason 
      })
      onClose?.()
    } catch (error) {
      console.error('Erro ao rejeitar:', error)
    }
  }

  const getStatusInfo = () => {
    switch (evidence.status) {
      case 'PENDENTE':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bg: 'bg-yellow-50',
          label: 'Aguardando aprovação do gestor',
        }
      case 'APROVADA_GESTOR':
        return {
          icon: Shield,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          label: 'Aprovada pelo gestor, aguardando direção',
        }
      case 'APROVADA':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bg: 'bg-green-50',
          label: 'Aprovada',
        }
      case 'REJEITADA':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'bg-red-50',
          label: 'Rejeitada',
        }
      default:
        return {
          icon: Clock,
          color: 'text-muted',
          bg: 'bg-accent',
          label: evidence.status,
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Aprovação de Evidência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn('p-4 rounded-lg flex items-center gap-3', statusInfo.bg)}>
          <StatusIcon className={cn('w-6 h-6', statusInfo.color)} />
          <div>
            <p className="font-medium text-foreground">{statusInfo.label}</p>
            <p className="text-sm text-muted">{evidence.filename}</p>
          </div>
        </div>

        {evidence.approvals && evidence.approvals.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Histórico de Aprovações</p>
            {evidence.approvals.map((approval: EvidenceApproval) => (
              <div 
                key={approval.id} 
                className="flex items-start gap-3 p-3 bg-accent rounded-lg"
              >
                <div className={cn(
                  'p-1.5 rounded-full',
                  approval.decision === 'APROVADO' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {approval.decision === 'APROVADO' 
                    ? <CheckCircle className="w-4 h-4 text-green-600" />
                    : <XCircle className="w-4 h-4 text-red-600" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {approval.role === 'gestor' ? 'Gestor' : 'Direção'}
                    </span>
                    <span className="text-xs text-muted">
                      {format(new Date(approval.decided_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  {approval.note && (
                    <p className="text-sm text-muted mt-1">{approval.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {(canApproveAsManager || canApproveAsDirection) && !showRejectForm && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Observação (opcional)
              </label>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Adicione uma observação..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none bg-surface"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleApprove}
                disabled={approveAsManager.isPending || approveAsDirection.isPending}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRejectForm(true)}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          </div>
        )}

        {showRejectForm && canReject && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Motivo da Rejeição *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Informe o motivo da rejeição..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none bg-surface"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={rejectEvidence.isPending || !rejectReason.trim()}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirmar Rejeição
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectForm(false)
                  setRejectReason('')
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {!canApproveAsManager && !canApproveAsDirection && !canReject && (
          <div className="text-center py-4 text-muted text-sm">
            {evidence.status === 'APROVADA' && 'Esta evidência já foi aprovada.'}
            {evidence.status === 'REJEITADA' && 'Esta evidência foi rejeitada.'}
            {userRole === 'colaborador' && evidence.status === 'PENDENTE' && 
              'Aguardando aprovação do gestor.'}
            {userRole === 'colaborador' && evidence.status === 'APROVADA_GESTOR' && 
              'Aguardando aprovação da direção.'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface EvidenceBacklogListProps {
  evidences: Array<{
    evidence_id: string
    action_id: string
    action_title: string
    area_name: string
    filename: string
    status: string
    submitted_at: string
    submitted_by_email: string
  }>
  userRole: 'admin' | 'gestor' | 'direcao'
  onSelectEvidence: (evidenceId: string) => void
}

export function EvidenceBacklogList({ 
  evidences, 
  userRole, 
  onSelectEvidence 
}: EvidenceBacklogListProps) {
  const filteredEvidences = evidences.filter(e => {
    // Admin vê todas as evidências pendentes ou aguardando direção
    if (userRole === 'admin') return ['PENDENTE', 'APROVADA_GESTOR'].includes(e.status)
    if (userRole === 'gestor') return e.status === 'PENDENTE'
    if (userRole === 'direcao') return e.status === 'APROVADA_GESTOR'
    return false
  })

  if (filteredEvidences.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
        <p className="font-medium">Nenhuma evidência pendente</p>
        <p className="text-sm">Todas as evidências foram processadas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {filteredEvidences.map((evidence) => (
        <div
          key={evidence.evidence_id}
          onClick={() => onSelectEvidence(evidence.evidence_id)}
          className="p-4 bg-surface border border-border rounded-lg hover:border-primary-300 hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{evidence.action_title}</p>
              <p className="text-sm text-muted">{evidence.area_name}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                <span>{evidence.filename}</span>
                <span>•</span>
                <span>
                  {format(new Date(evidence.submitted_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
            <div className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              evidence.status === 'PENDENTE' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-blue-100 text-blue-700'
            )}>
              {evidence.status === 'PENDENTE' ? 'Aguardando Gestor' : 'Aguardando Direção'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
