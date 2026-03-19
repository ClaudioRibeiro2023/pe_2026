import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MessageSquare, Send, Trash2, Edit2 } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks'
import type { ActionComment } from '../types'

interface CommentsListProps {
  actionId: string
  readonly?: boolean
}

export function CommentsList({ actionId, readonly = false }: CommentsListProps) {
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const { data: comments, isLoading } = useComments(actionId)
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await createComment.mutateAsync({
        action_id: actionId,
        content: newComment.trim(),
      })
      setNewComment('')
    } catch (error) {
      console.error('Erro ao criar comentário:', error)
    }
  }

  const handleEdit = (comment: ActionComment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editContent.trim()) return

    try {
      await updateComment.mutateAsync({
        commentId: editingId,
        data: { content: editContent.trim() },
        actionId,
      })
      setEditingId(null)
      setEditContent('')
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return

    try {
      await deleteComment.mutateAsync({ commentId, actionId })
    } catch (error) {
      console.error('Erro ao excluir comentário:', error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted">
          Carregando comentários...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comentários
          {comments && comments.length > 0 && (
            <span className="text-sm font-normal text-muted">
              ({comments.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readonly && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button
              type="submit"
              disabled={!newComment.trim() || createComment.isPending}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}

        {comments && comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment: ActionComment) => (
              <div
                key={comment.id}
                className="p-3 bg-accent rounded-lg group"
              >
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none bg-surface"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={!editContent.trim() || updateComment.isPending}
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null)
                          setEditContent('')
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{comment.content}</p>
                        <p className="text-xs text-muted mt-1">
                          {format(new Date(comment.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          {comment.updated_at !== comment.created_at && ' (editado)'}
                        </p>
                      </div>
                      {!readonly && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(comment)}
                            className="p-1 text-muted hover:text-primary-500 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={deleteComment.isPending}
                            className="p-1 text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted" />
            <p className="text-sm">Nenhum comentário ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
