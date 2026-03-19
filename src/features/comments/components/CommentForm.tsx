import { useState } from 'react'
import { Send } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'
import { useCreateComment } from '../hooks'

interface CommentFormProps {
  actionPlanId: string
}

export function CommentForm({ actionPlanId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const { addToast } = useToast()
  const createMutation = useCreateComment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'O comentário não pode estar vazio.',
      })
      return
    }

    try {
      await createMutation.mutateAsync({
        content: content.trim(),
        action_plan_id: actionPlanId,
      })
      
      setContent('')
      addToast({
        type: 'success',
        title: 'Comentário adicionado',
        message: 'Seu comentário foi adicionado com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível adicionar o comentário.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva um comentário..."
        className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        rows={3}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          loading={createMutation.isPending}
          disabled={!content.trim()}
        >
          <Send className="h-4 w-4" />
          Enviar Comentário
        </Button>
      </div>
    </form>
  )
}
