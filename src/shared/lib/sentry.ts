import * as Sentry from '@sentry/react'
import { env } from '@/shared/config/env'

export function initSentry() {
  // Só inicializar em produção e se DSN estiver configurado
  if (import.meta.env.PROD && env.sentryDsn) {
    Sentry.init({
      dsn: env.sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // Environment
      environment: import.meta.env.MODE,
      // Release tracking
      release: env.appVersion,
    })
  }
}

export { Sentry }
