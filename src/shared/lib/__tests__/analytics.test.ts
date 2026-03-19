import { describe, it, expect, vi, beforeEach } from 'vitest'

// Must mock env before importing analytics
vi.mock('@/shared/config/env', () => ({
  env: {
    analyticsId: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    appName: 'Test',
    appVersion: '1.0.0',
    sentryDsn: '',
    isDev: true,
    isProd: false,
  },
}))

describe('Analytics', () => {
  beforeEach(() => {
    vi.resetModules()
    window.dataLayer = []
    window.gtag = undefined
  })

  it('does not initialize without analyticsId', async () => {
    const { analytics } = await import('../analytics')
    analytics.init()
    // Should not have added any scripts
    expect(document.querySelectorAll('script[src*="googletagmanager"]').length).toBe(0)
  })

  it('pageView is a no-op when not initialized', async () => {
    const { analytics } = await import('../analytics')
    // Should not throw
    analytics.pageView('/test', 'Test Page')
  })

  it('event is a no-op when not initialized', async () => {
    const { analytics } = await import('../analytics')
    analytics.event({ action: 'test', category: 'test' })
  })

  it('specific event helpers are no-ops when not initialized', async () => {
    const { analytics } = await import('../analytics')
    // None of these should throw
    analytics.login('email')
    analytics.signup('email')
    analytics.createGoal()
    analytics.createIndicator()
    analytics.createActionPlan()
    analytics.exportData('pdf', 'goals')
  })
})
