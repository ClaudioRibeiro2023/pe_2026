import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/shared/config/env'

const hasEnvVars = Boolean(env.supabaseUrl && env.supabaseAnonKey)
const isLocalPreviewHost =
  import.meta.env.PROD &&
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)

const supabaseUrl = env.supabaseUrl || 'https://placeholder.supabase.co'
const supabaseAnonKey = env.supabaseAnonKey || 'placeholder-key'
const SUPABASE_TIMEOUT_MS = 3000

export type SupabaseRuntimeState = {
  hasEnvVars: boolean
  isReachable: boolean
  isConfigured: boolean
  shouldUseSupabase: boolean
  canUseMockFallback: boolean
  environment: 'development' | 'production'
}

// Global reachability flag — once Supabase fails with a network error,
// all subsequent calls skip the network and use mock data instantly.
let supabaseReachable = !isLocalPreviewHost

const baseFetch = globalThis.fetch.bind(globalThis)

const isElectron =
  typeof window !== 'undefined' &&
  (window.electronAPI !== undefined || window.location.protocol === 'file:')

const fetchWithTimeout: typeof fetch = async (input, init = {}) => {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort(new DOMException('Timeout', 'TimeoutError'))
  }, SUPABASE_TIMEOUT_MS)

  let abortListener: (() => void) | undefined

  if (init.signal) {
    if (init.signal.aborted) {
      controller.abort(init.signal.reason)
    } else {
      abortListener = () => controller.abort(init.signal?.reason)
      init.signal.addEventListener('abort', abortListener, { once: true })
    }
  }

  try {
    const response = await baseFetch(input, { ...init, signal: controller.signal })
    supabaseReachable = true
    return response
  } catch (err) {
    if (
      err instanceof TypeError ||
      (err instanceof DOMException && err.name === 'AbortError')
    ) {
      supabaseReachable = false
      console.warn('[Supabase] Network unreachable — live data requests may fail outside DEV')
    }
    throw err
  } finally {
    if (abortListener) {
      init.signal?.removeEventListener('abort', abortListener)
    }
    globalThis.clearTimeout(timeoutId)
  }
}

const createSupabaseClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: hasEnvVars && !isLocalPreviewHost,
      autoRefreshToken: false,
      detectSessionInUrl: hasEnvVars && !isLocalPreviewHost,
    },
    global: {
      fetch: isElectron ? baseFetch : fetchWithTimeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    },
    db: {
      schema: 'public'
    }
  })

const globalForSupabase = globalThis as unknown as {
  __supabase?: SupabaseClient
}

export const supabase = globalForSupabase.__supabase ?? createSupabaseClient()

if (import.meta.env.DEV) {
  globalForSupabase.__supabase = supabase
}

export function getSupabaseRuntimeState(): SupabaseRuntimeState {
  const shouldUseSupabase = hasEnvVars && supabaseReachable && !isLocalPreviewHost
  const isProd = !env.isDev && !isLocalPreviewHost

  // Em PROD com vars configuradas mas Supabase inacessível: nunca usar mock silenciosamente
  if (isProd && hasEnvVars && !supabaseReachable) {
    console.error(
      '[Supabase] PROD: Supabase configurado mas inacessível. ' +
      'Mock fallback BLOQUEADO em produção. Verifique conectividade e variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.'
    )
  }

  return {
    hasEnvVars,
    isReachable: supabaseReachable,
    isConfigured: hasEnvVars,
    shouldUseSupabase,
    // Mock só permitido em DEV ou local preview — NUNCA em produção com vars configuradas
    canUseMockFallback: (env.isDev || isLocalPreviewHost) && !shouldUseSupabase,
    environment: env.isDev ? 'development' : 'production',
  }
}

// Helper to check if Supabase is properly configured AND reachable
export function isSupabaseConfigured(): boolean {
  return hasEnvVars && supabaseReachable && !isLocalPreviewHost
}

export function canUseSupabaseMockFallback(): boolean {
  return getSupabaseRuntimeState().canUseMockFallback
}

/**
 * Em PROD, verifica se a operação pode prosseguir.
 * Lança erro explícito se Supabase não está disponível e mock não é permitido.
 */
export function assertSupabaseAvailableForProd(operation: string): void {
  const state = getSupabaseRuntimeState()
  if (state.environment === 'production' && !state.shouldUseSupabase && !state.canUseMockFallback) {
    throw new Error(
      `[PROD] Operação "${operation}" bloqueada: Supabase indisponível e mock não permitido em produção. ` +
      `Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.`
    )
  }
}
