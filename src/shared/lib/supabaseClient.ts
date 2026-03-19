import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/shared/config/env'

const hasEnvVars = Boolean(env.supabaseUrl && env.supabaseAnonKey)

const supabaseUrl = env.supabaseUrl || 'https://placeholder.supabase.co'
const supabaseAnonKey = env.supabaseAnonKey || 'placeholder-key'
const SUPABASE_TIMEOUT_MS = 3000

// Global reachability flag — once Supabase fails with a network error,
// all subsequent calls skip the network and use mock data instantly.
let supabaseReachable = true

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
      console.warn('[Supabase] Network unreachable — switching to offline/mock mode')
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
      persistSession: hasEnvVars,
      autoRefreshToken: false,
      detectSessionInUrl: hasEnvVars,
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

// Helper to check if Supabase is properly configured AND reachable
export function isSupabaseConfigured(): boolean {
  return hasEnvVars && supabaseReachable
}
