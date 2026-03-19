import { fetchContextFromStore } from '@/shared/lib/contextStore'
import type { OkrsContext } from './types'

const OKRS_CONTEXT_URL = '/data/okrs_context.json'

export async function fetchOkrsContext(): Promise<OkrsContext> {
  return fetchContextFromStore<OkrsContext>({
    slug: 'okrs',
    fallbackUrl: OKRS_CONTEXT_URL,
    errorLabel: 'OKRs',
  })
}
