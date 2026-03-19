import { useQuery } from '@tanstack/react-query'
import { fetchCapacityContext } from './api'

const QUERY_KEY = ['capacity', 'context']

export function useCapacityContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchCapacityContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
