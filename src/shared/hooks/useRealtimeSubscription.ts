import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeSubscriptionOptions {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  queryKey: string[]
  enabled?: boolean
}

/**
 * Hook para subscrever a mudanças em tempo real no Supabase
 * Invalida automaticamente as queries do React Query quando há mudanças
 */
export function useRealtimeSubscription({
  table,
  event = '*',
  filter,
  queryKey,
  enabled = true,
}: UseRealtimeSubscriptionOptions) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured()) return

    const channel: RealtimeChannel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          ...(filter ? { filter } : {}),
        } as any,
        (_payload: RealtimePostgresChangesPayload<any>) => {
          queryClient.invalidateQueries({ queryKey })
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        void supabase.removeChannel(channel).catch((err: unknown) => {
          if ((err as any)?.name !== 'AbortError') {
            console.error('Erro ao remover canal realtime:', err)
          }
        })
      }
    }
  }, [table, event, filter, queryKey, enabled, queryClient])
}

/**
 * Hook específico para comentários em tempo real
 */
export function useRealtimeComments(actionPlanId: string, enabled = true) {
  return useRealtimeSubscription({
    table: 'comments',
    filter: `action_plan_id=eq.${actionPlanId}`,
    queryKey: ['comments', actionPlanId],
    enabled,
  })
}

/**
 * Hook específico para anexos em tempo real
 */
export function useRealtimeAttachments(actionPlanId: string, enabled = true) {
  return useRealtimeSubscription({
    table: 'attachments',
    filter: `action_plan_id=eq.${actionPlanId}`,
    queryKey: ['attachments', actionPlanId],
    enabled,
  })
}

/**
 * Hook específico para metas em tempo real
 */
export function useRealtimeGoals(enabled = true) {
  return useRealtimeSubscription({
    table: 'goals',
    queryKey: ['goals'],
    enabled,
  })
}

/**
 * Hook específico para indicadores em tempo real
 */
export function useRealtimeIndicators(enabled = true) {
  return useRealtimeSubscription({
    table: 'indicators',
    queryKey: ['indicators'],
    enabled,
  })
}

/**
 * Hook específico para planos de ação em tempo real
 */
export function useRealtimeActionPlans(enabled = true) {
  return useRealtimeSubscription({
    table: 'action_plans',
    queryKey: ['action-plans'],
    enabled,
  })
}
