import { describe, it, expect } from 'vitest'
import { isSupabaseConfigured, supabase } from '../supabaseClient'

describe('isSupabaseConfigured', () => {
  it('returns a boolean', () => {
    const result = isSupabaseConfigured()
    expect(typeof result).toBe('boolean')
  })

  it('reflects whether env vars are set and service is reachable', () => {
    // In the dev environment, .env has VITE_SUPABASE_URL set
    // so isSupabaseConfigured starts as true (hasEnvVars && supabaseReachable)
    // This test documents the actual behavior
    const result = isSupabaseConfigured()
    expect(result).toBe(true)
  })
})

describe('supabase client', () => {
  it('exports a supabase client instance', () => {
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
  })
})
