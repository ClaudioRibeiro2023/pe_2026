import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabaseClient'
import type { Comment, CreateCommentData, UpdateCommentData } from './types'

export function useComments(actionPlanId: string) {
  return useQuery({
    queryKey: ['comments', actionPlanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments_with_user')
        .select('*')
        .eq('action_plan_id', actionPlanId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Comment[]
    },
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          ...data,
          user_id: user.user.id,
        })
        .select()
        .single()

      if (error) throw error
      return comment
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.action_plan_id] })
    },
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCommentData }) => {
      const { data: comment, error } = await supabase
        .from('comments')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return comment
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.action_plan_id] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, actionPlanId }: { id: string; actionPlanId: string }) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { id, actionPlanId }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.actionPlanId] })
    },
  })
}
