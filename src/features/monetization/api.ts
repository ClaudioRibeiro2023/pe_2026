import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { MonetizationContext } from './types'

const MONETIZATION_CONTEXT_URL = '/data/monetization_context.json'

export async function fetchMonetizationContext(): Promise<MonetizationContext> {
  return fetchContextFromStore<MonetizationContext>({
    slug: 'monetization',
    fallbackUrl: MONETIZATION_CONTEXT_URL,
    errorLabel: 'monetizacao',
  })
}
