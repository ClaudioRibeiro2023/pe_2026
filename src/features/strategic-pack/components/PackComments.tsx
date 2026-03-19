import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  MessageSquare, 
  CheckCircle, 
  Send,
  User
} from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { cn } from '@/shared/lib/cn'
import type { PackComment } from '../types'

interface PackCommentsProps {
  comments: PackComment[]
  onAddComment?: (body: string) => Promise<void>
  onResolveComment?: (commentId: string) => Promise<void>
  isAdding?: boolean
  readonly?: boolean
}

export function PackComments({ 
  comments, 
  onAddComment, 
  onResolveComment,
  isAdding,
  readonly = false 
}: PackCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [showResolved, setShowResolved] = useState(false)

  const openComments = comments.filter(c => c.status === 'open')
  const resolvedComments = comments.filter(c => c.status === 'resolved')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !onAddComment) return
    
    await onAddComment(newComment.trim())
    setNewComment('')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comentários ({openComments.length} abertos)
        </CardTitle>
        {resolvedComments.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowResolved(!showResolved)}
          >
            {showResolved ? 'Ocultar' : 'Mostrar'} resolvidos ({resolvedComments.length})
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!readonly && onAddComment && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicionar comentário..."
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Button type="submit" disabled={isAdding || !newComment.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}

        {openComments.length === 0 && resolvedComments.length === 0 ? (
          <div className="text-center py-6 text-muted">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-muted" />
            <p>Nenhum comentário ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {openComments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                onResolve={onResolveComment}
                readonly={readonly}
              />
            ))}
            
            {showResolved && resolvedComments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                readonly={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface CommentItemProps {
  comment: PackComment
  onResolve?: (commentId: string) => Promise<void>
  readonly?: boolean
}

function CommentItem({ comment, onResolve, readonly }: CommentItemProps) {
  const isResolved = comment.status === 'resolved'

  return (
    <div className={cn(
      'p-3 rounded-lg border',
      isResolved ? 'bg-accent border-border' : 'bg-surface border-border'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-muted" />
          <span className="font-medium text-foreground">
            {comment.author.split('@')[0]}
          </span>
          <span className="text-muted">•</span>
          <span className="text-muted">
            {format(new Date(comment.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
          </span>
          {isResolved && (
            <>
              <span className="text-muted">•</span>
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Resolvido
              </span>
            </>
          )}
        </div>
        {!readonly && !isResolved && onResolve && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onResolve(comment.id)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Resolver
          </Button>
        )}
      </div>
      <p className={cn(
        'mt-2 text-sm',
        isResolved ? 'text-muted' : 'text-foreground'
      )}>
        {comment.body}
      </p>
      {isResolved && comment.resolved_by && (
        <p className="mt-1 text-xs text-muted">
          Resolvido por {comment.resolved_by.split('@')[0]} em{' '}
          {comment.resolved_at && format(new Date(comment.resolved_at), "dd/MM/yyyy", { locale: ptBR })}
        </p>
      )}
    </div>
  )
}
