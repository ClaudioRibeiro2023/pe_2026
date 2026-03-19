import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'

type ContextStoreOptions = {
  slug: string
  fallbackUrl: string
  errorLabel: string
}

const CONTEXT_TABLE = 'context_store'
let contextStoreUnavailable = false

async function fetchFallback<T>(fallbackUrl: string, errorLabel: string, reason?: string): Promise<T> {
  if (reason) {
    console.warn(`[context_store] Fallback ativado (${errorLabel}): ${reason}`)
  }

  const response = await fetch(fallbackUrl)

  if (!response.ok) {
    throw new Error(`Falha ao carregar ${errorLabel} (${response.status})`)
  }

  return (await response.json()) as T
}

function shouldMarkUnavailable(error: { status?: number; code?: string } | null) {
  return error?.status === 404 || error?.code === '42P01'
}

export async function fetchContextFromStore<T>({
  slug,
  fallbackUrl,
  errorLabel,
}: ContextStoreOptions): Promise<T> {
  if (!isSupabaseConfigured() || contextStoreUnavailable) {
    return fetchFallback<T>(
      fallbackUrl,
      errorLabel,
      contextStoreUnavailable ? 'context_store indisponível no Supabase' : undefined
    )
  }

  const { data, error } = await supabase
    .from(CONTEXT_TABLE)
    .select('data')
    .eq('slug', slug)

  if (error || !data || (Array.isArray(data) && data.length === 0)) {
    if (shouldMarkUnavailable(error)) {
      contextStoreUnavailable = true
    }

    return fetchFallback<T>(
      fallbackUrl,
      errorLabel,
      error?.message || 'Contexto não encontrado no Supabase'
    )
  }

  const record = Array.isArray(data) ? data[0] : data

  if (!record?.data) {
    return fetchFallback<T>(fallbackUrl, errorLabel, 'Contexto vazio no Supabase')
  }

  return record.data as T
}
