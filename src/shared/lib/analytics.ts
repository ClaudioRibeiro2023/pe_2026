import { env } from '@/shared/config/env'

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

class Analytics {
  private initialized = false

  init() {
    if (this.initialized || !env.analyticsId) return

    // Google Analytics 4
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${env.analyticsId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function gtag(...args: [string, ...unknown[]]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', env.analyticsId, {
      send_page_view: false, // Controlar manualmente
    })

    this.initialized = true
  }

  pageView(path: string, title?: string) {
    if (!this.initialized) return

    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_title: title,
    })
  }

  event({ action, category, label, value }: AnalyticsEvent) {
    if (!this.initialized) return

    window.gtag?.('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }

  // Eventos específicos
  login(method: string) {
    this.event({
      action: 'login',
      category: 'engagement',
      label: method,
    })
  }

  signup(method: string) {
    this.event({
      action: 'sign_up',
      category: 'engagement',
      label: method,
    })
  }

  createGoal() {
    this.event({
      action: 'create_goal',
      category: 'goals',
    })
  }

  createIndicator() {
    this.event({
      action: 'create_indicator',
      category: 'indicators',
    })
  }

  createActionPlan() {
    this.event({
      action: 'create_action_plan',
      category: 'action_plans',
    })
  }

  exportData(type: 'pdf' | 'excel', feature: string) {
    this.event({
      action: 'export_data',
      category: 'export',
      label: `${feature}_${type}`,
    })
  }
}

export const analytics = new Analytics()

// Tipos globais para TypeScript
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: [string, ...unknown[]]) => void
  }
}
