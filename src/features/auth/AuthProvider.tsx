import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { ROUTES } from '@/shared/config/routes'
import type { AuthUser, UserProfile, UserRole } from '@/shared/types'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>
  signOut: () => Promise<void>
  roleOverride: UserRole | null
  setRoleOverride: (role: UserRole | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

const buildDemoUser = (email = 'demo@example.com'): AuthUser => ({
  id: 'demo-user',
  email,
  profile: {
    id: 'demo-profile',
    user_id: 'demo-user',
    role: 'admin',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
})

function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError && err.message === 'Failed to fetch') return true
  if (err && typeof err === 'object' && 'name' in err) {
    const name = (err as { name: string }).name
    if (name === 'AuthRetryableFetchError') return true
  }
  return false
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [roleOverride, setRoleOverride] = useState<UserRole | null>(() => {
    if (!import.meta.env.DEV) return null
    if (typeof window === 'undefined') return null
    return (window.localStorage.getItem('pe2026-role-override') as UserRole) || null
  })

  const handleSetRoleOverride = useCallback((role: UserRole | null) => {
    if (!import.meta.env.DEV) return
    setRoleOverride(role)
    if (role) {
      window.localStorage.setItem('pe2026-role-override', role)
    } else {
      window.localStorage.removeItem('pe2026-role-override')
    }
  }, [])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const lastPrefetchedUserId = useRef<string | null>(null)

  const prefetchCoreData = useCallback(
    async (userId: string) => {
      if (lastPrefetchedUserId.current === userId) return
      lastPrefetchedUserId.current = userId

      const [goalsModule, indicatorsModule, actionPlansModule, strategyModule] = await Promise.all([
        import('@/features/goals/api'),
        import('@/features/indicators/api'),
        import('@/features/action-plans/api'),
        import('@/features/strategy/api'),
      ])

      void queryClient.prefetchQuery({
        queryKey: ['goals'],
        queryFn: goalsModule.fetchGoals,
      })
      void queryClient.prefetchQuery({
        queryKey: ['indicators'],
        queryFn: indicatorsModule.fetchIndicators,
      })
      void queryClient.prefetchQuery({
        queryKey: ['action-plans'],
        queryFn: actionPlansModule.fetchActionPlans,
      })
      void queryClient.prefetchQuery({
        queryKey: ['strategy', 'context'],
        queryFn: strategyModule.fetchStrategicContext,
      })
    },
    [queryClient]
  )

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | undefined> => {
    if (!isSupabaseConfigured()) return undefined

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return undefined
    return data || undefined
  }, [])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const buildUser = (
      sessionUser: { id: string; email?: string | null },
      profile?: UserProfile
    ) => ({
      id: sessionUser.id,
      email: sessionUser.email || '',
      profile,
    })

    const finalizeLoading = () => {
      if (!mounted) return
      setLoading(false)
    }

    const loadingTimeout = window.setTimeout(() => {
      finalizeLoading()
    }, 8000)

    // Demo mode (no Supabase configured)
    if (!isSupabaseConfigured()) {
      setUser(buildDemoUser())
      window.clearTimeout(loadingTimeout)
      finalizeLoading()
      return () => {
        mounted = false
        window.clearTimeout(loadingTimeout)
      }
    }

    const loadSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error
        if (!mounted) return

        if (session?.user) {
          const baseUser = buildUser(session.user)
          setUser(baseUser)
          window.clearTimeout(loadingTimeout)
          finalizeLoading()

          void prefetchCoreData(session.user.id)

          void fetchProfile(session.user.id)
            .then((profile) => {
              if (!mounted || !profile) return
              setUser(buildUser(session.user, profile))
            })
            .catch(() => {})

          return
        }

        if (!mounted) return
        if (!session?.user) {
          setUser(null)
        }
      } catch (err: unknown) {
        if (!mounted) return
        if (isNetworkError(err)) {
          console.warn('[Auth] Supabase unreachable — falling back to demo mode')
          setUser(buildDemoUser())
        } else {
          setUser(null)
        }
      } finally {
        window.clearTimeout(loadingTimeout)
        finalizeLoading()
      }
    }

    void loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (!mounted) return

        if (
          event === 'SIGNED_IN' ||
          event === 'SIGNED_OUT' ||
          event === 'USER_UPDATED'
        ) {
          setLoading(true)
        }

        if (event === 'INITIAL_SESSION') {
          window.clearTimeout(loadingTimeout)
          finalizeLoading()
        }

        if (session?.user) {
          const baseUser = buildUser(session.user)
          setUser(baseUser)

          void prefetchCoreData(session.user.id)

          void fetchProfile(session.user.id)
            .then((profile) => {
              if (!mounted || !profile) return
              setUser(buildUser(session.user, profile))
            })
            .catch(() => {})
        } else {
          setUser(null)
        }
      } catch {
        if (!mounted) return
        setUser(null)
        window.clearTimeout(loadingTimeout)
        finalizeLoading()
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      window.clearTimeout(loadingTimeout)
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProfile])

  const signIn = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ error: string | null; needsEmailConfirmation?: boolean }> => {
      if (!isSupabaseConfigured()) {
        setUser(buildDemoUser(email))
        return { error: null, needsEmailConfirmation: false }
      }

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          if (isNetworkError(error)) {
            console.warn('[Auth] Supabase unreachable on signIn — falling back to demo mode')
            setUser(buildDemoUser(email))
            return { error: null, needsEmailConfirmation: false }
          }
          const needsEmailConfirmation =
            error.message.toLowerCase().includes('email not confirmed') ||
            error.message.toLowerCase().includes('not confirmed')
          return { error: error.message, needsEmailConfirmation }
        }

        return { error: null, needsEmailConfirmation: false }
      } catch (err: unknown) {
        if (isNetworkError(err)) {
          console.warn('[Auth] Supabase unreachable on signIn — falling back to demo mode')
          setUser(buildDemoUser(email))
          return { error: null, needsEmailConfirmation: false }
        }
        return { error: 'Erro de rede. Tente novamente.', needsEmailConfirmation: false }
      }
    },
    []
  )

  const signUp = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ error: string | null; needsEmailConfirmation?: boolean }> => {
      if (!isSupabaseConfigured()) {
        setUser(buildDemoUser(email))
        return { error: null, needsEmailConfirmation: false }
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          if (isNetworkError(error)) {
            console.warn('[Auth] Supabase unreachable on signUp — falling back to demo mode')
            setUser(buildDemoUser(email))
            return { error: null, needsEmailConfirmation: false }
          }
          return { error: error.message, needsEmailConfirmation: false }
        }

        const needsEmailConfirmation = !data.session
        return { error: null, needsEmailConfirmation }
      } catch (err: unknown) {
        if (isNetworkError(err)) {
          console.warn('[Auth] Supabase unreachable on signUp — falling back to demo mode')
          setUser(buildDemoUser(email))
          return { error: null, needsEmailConfirmation: false }
        }
        return { error: 'Erro de rede. Tente novamente.', needsEmailConfirmation: false }
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    setUser(null)
    navigate(ROUTES.LOGIN)
  }, [navigate])

  // Build effective user with role override applied
  const effectiveUser = user && roleOverride && user.profile
    ? { ...user, profile: { ...user.profile, role: roleOverride } }
    : user

  return (
    <AuthContext.Provider value={{ user: effectiveUser, loading, signIn, signUp, signOut, roleOverride, setRoleOverride: handleSetRoleOverride }}>
      {children}
    </AuthContext.Provider>
  )
}
