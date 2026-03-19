import { useQuery } from '@tanstack/react-query'
import { fetchMonetizationContext } from './api'

const QUERY_KEY = ['monetization', 'context']

export function useMonetizationContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchMonetizationContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
