import { useState, useEffect } from 'react'
import { X, Calendar, User, Flag, MessageSquare, Paperclip } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { CommentsList } from '@/features/comments/components/CommentsList'
import { CommentForm } from '@/features/comments/components/CommentForm'
import { FileUpload } from '@/shared/components/upload/FileUpload'
import { useToast } from '@/shared/ui/Toast'
import { getErrorMessage } from '@/shared/lib/errorUtils'
import { supabase } from '@/shared/lib/supabaseClient'
import type { ActionPlan } from '../types'
import { format } from 'date-fns/format'
import { ptBR } from 'date-fns/locale/pt-BR'

interface ActionPlanDetailsProps {
  plan: ActionPlan
  open: boolean
  onClose: () => void
}

interface Attachment {
  id: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  created_at: string
}

export function ActionPlanDetails({ plan, open, onClose }: ActionPlanDetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'attachments'>('details')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loadingAttachments, setLoadingAttachments] = useState(false)
  const { addToast } = useToast()

  const loadAttachments = async () => {
    setLoadingAttachments(true)
    try {
      const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('action_plan_id', plan.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAttachments(data || [])
    } catch (error) {
      console.error('Erro ao carregar anexos:', error)
    } finally {
      setLoadingAttachments(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const filePath = `${user.id}/${plan.id}/${Date.now()}_${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('attachments')
        .insert({
          action_plan_id: plan.id,
          filename: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          user_id: user.id,
        })

      if (dbError) throw dbError

      addToast({
        type: 'success',
        title: 'Arquivo enviado',
        message: 'O arquivo foi enviado com sucesso.',
      })

      loadAttachments()
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error))
    }
  }

  const handleDownload = async (attachment: Attachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(attachment.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (_error) {
      addToast({
        type: 'error',
        title: 'Erro ao baixar',
        message: 'Não foi possível baixar o arquivo.',
      })
    }
  }

  const handleDeleteAttachment = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anexo?')) return

    try {
      const { error } = await supabase
        .from('attachments')
        .delete()
        .eq('id', id)

      if (error) throw error

      addToast({
        type: 'success',
        title: 'Anexo excluído',
        message: 'O anexo foi excluído com sucesso.',
      })

      loadAttachments()
    } catch (_error) {
      addToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o anexo.',
      })
    }
  }

  useEffect(() => {
    if (open && activeTab === 'attachments') {
      loadAttachments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab])

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-accent text-muted',
      in_progress: 'bg-primary-100 text-primary-700',
      completed: 'bg-success-100 text-success-700',
      cancelled: 'bg-danger-100 text-danger-700',
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-accent text-muted',
      medium: 'bg-primary-100 text-primary-700',
      high: 'bg-warning-100 text-warning-700',
      urgent: 'bg-danger-100 text-danger-700',
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Modal open={open} onClose={onClose} title={plan.title} size="xl">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors inline-flex items-center gap-2 ${
                activeTab === 'comments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Comentários
            </button>
            <button
              onClick={() => setActiveTab('attachments')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors inline-flex items-center gap-2 ${
                activeTab === 'attachments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              <Paperclip className="h-4 w-4" />
              Anexos
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted mb-2">Descrição</h3>
              <p className="text-foreground whitespace-pre-wrap">
                {plan.description || 'Sem descrição'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted mb-2">Status</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted mb-2">Prioridade</h3>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(plan.priority)}`}>
                  <Flag className="h-3 w-3" />
                  {plan.priority}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted mb-2">Responsável</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted" />
                  <span className="text-foreground">{plan.responsible}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted mb-2">Prazo</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted" />
                  <span className="text-foreground">
                    {plan.due_date ? format(new Date(plan.due_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Sem prazo'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            <CommentForm actionPlanId={plan.id} />
            <div className="border-t border-border pt-4">
              <CommentsList actionPlanId={plan.id} />
            </div>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="space-y-4">
            <FileUpload
              onUpload={handleFileUpload}
              accept="*"
              maxSize={10 * 1024 * 1024}
            />

            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Arquivos Anexados ({attachments.length})
              </h3>

              {loadingAttachments ? (
                <div className="text-center py-8 text-muted">
                  Carregando anexos...
                </div>
              ) : attachments.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum arquivo anexado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Paperclip className="h-5 w-5 text-muted flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {attachment.filename}
                          </p>
                          <p className="text-xs text-muted">
                            {formatFileSize(attachment.file_size)} • {format(new Date(attachment.created_at), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(attachment)}
                        >
                          Baixar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
