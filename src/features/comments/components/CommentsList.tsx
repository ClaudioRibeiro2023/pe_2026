import { useState } from 'react'
import { MessageSquare, Trash2, Edit2, Check, X } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'
import { useComments, useUpdateComment, useDeleteComment } from '../hooks'
import { useRealtimeComments } from '@/shared/hooks/useRealtimeSubscription'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { ptBR } from 'date-fns/locale/pt-BR'

interface CommentsListProps {
  actionPlanId: string
}

export function CommentsList({ actionPlanId }: CommentsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const { addToast } = useToast()

  const { data: comments, isLoading } = useComments(actionPlanId)
  const updateMutation = useUpdateComment()
  const deleteMutation = useDeleteComment()
  
  // Subscrever a mudanças em tempo real
  useRealtimeComments(actionPlanId)


  const handleEdit = (id: string, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }

  const handleSaveEdit = async (id: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: { content: editContent } })
      setEditingId(null)
      addToast({
        type: 'success',
        title: 'Comentário atualizado',
        message: 'O comentário foi atualizado com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o comentário.',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return

    try {
      await deleteMutation.mutateAsync({ id, actionPlanId })
      addToast({
        type: 'success',
        title: 'Comentário excluído',
        message: 'O comentário foi excluído com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível excluir o comentário.',
      })
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted">Carregando comentários...</div>
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhum comentário ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-accent rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {comment.user_email || 'Usuário'}
              </p>
              <p className="text-xs text-muted">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
            <div className="flex gap-1">
              {editingId !== comment.id && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(comment.id, comment.content)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-3 w-3 text-danger-600" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {editingId === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit(comment.id)}
                  loading={updateMutation.isPending}
                >
                  <Check className="h-3 w-3" />
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-3 w-3" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
