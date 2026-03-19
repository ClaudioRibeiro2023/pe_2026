import { useQuery } from '@tanstack/react-query'
import { fetchFinanceContext } from './api'

const QUERY_KEY = ['finance', 'context']

export function useFinanceContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchFinanceContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
