import { useQuery } from '@tanstack/react-query'
import { fetchInitiativesContext } from './api'

const QUERY_KEY = ['initiatives', 'context']

export function useInitiativesContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchInitiativesContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
