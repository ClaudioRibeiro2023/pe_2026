import { fetchContextFromStore } from '@/shared/lib/contextStore'
import { applyEngineToContext } from './engine'
import type { ScoreboardContext } from './types'

const SCOREBOARD_CONTEXT_URL = '/data/scoreboard_context.json'

export async function fetchScoreboardContext(): Promise<ScoreboardContext> {
  const raw = await fetchContextFromStore<ScoreboardContext>({
    slug: 'scoreboard',
    fallbackUrl: SCOREBOARD_CONTEXT_URL,
    errorLabel: 'placar',
  })
  return applyEngineToContext(raw)
}
