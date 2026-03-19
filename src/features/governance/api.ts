import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { GovernanceContext } from './types'

const GOVERNANCE_CONTEXT_URL = '/data/governance_context.json'

export async function fetchGovernanceContext(): Promise<GovernanceContext> {
  return fetchContextFromStore<GovernanceContext>({
    slug: 'governance',
    fallbackUrl: GOVERNANCE_CONTEXT_URL,
    errorLabel: 'governanca',
  })
}
