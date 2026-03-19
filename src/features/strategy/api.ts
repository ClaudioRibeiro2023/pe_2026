import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { StrategicContext } from './types'

const STRATEGIC_CONTEXT_URL = '/data/strategic_context.json'

export async function fetchStrategicContext(): Promise<StrategicContext> {
  return fetchContextFromStore<StrategicContext>({
    slug: 'strategic',
    fallbackUrl: STRATEGIC_CONTEXT_URL,
    errorLabel: 'contexto estratégico',
  })
}
