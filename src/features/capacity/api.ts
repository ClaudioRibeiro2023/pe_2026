import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { CapacityContext } from './types'

const CAPACITY_CONTEXT_URL = '/data/capacity_context.json'

export async function fetchCapacityContext(): Promise<CapacityContext> {
  return fetchContextFromStore<CapacityContext>({
    slug: 'capacity',
    fallbackUrl: CAPACITY_CONTEXT_URL,
    errorLabel: 'capacidade',
  })
}
