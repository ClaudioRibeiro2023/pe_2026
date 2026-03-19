import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { InitiativesContext } from './types'

const INITIATIVES_CONTEXT_URL = '/data/initiatives_context.json'

export async function fetchInitiativesContext(): Promise<InitiativesContext> {
  return fetchContextFromStore<InitiativesContext>({
    slug: 'initiatives',
    fallbackUrl: INITIATIVES_CONTEXT_URL,
    errorLabel: 'iniciativas',
  })
}
