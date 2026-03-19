import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { FinanceContext } from './types'

const FINANCE_CONTEXT_URL = '/data/finance_context.json'

export async function fetchFinanceContext(): Promise<FinanceContext> {
  return fetchContextFromStore<FinanceContext>({
    slug: 'finance',
    fallbackUrl: FINANCE_CONTEXT_URL,
    errorLabel: 'financeiro',
  })
}
