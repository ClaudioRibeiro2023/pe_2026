import { useQuery } from '@tanstack/react-query'
import { fetchOkrsContext } from './api'

const QUERY_KEY = ['okrs', 'context']

export function useOkrsContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchOkrsContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
