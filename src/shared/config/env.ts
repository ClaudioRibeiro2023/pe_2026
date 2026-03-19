export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  appName: import.meta.env.VITE_APP_NAME || 'Template App',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN as string,
  analyticsId: import.meta.env.VITE_ANALYTICS_ID as string,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

// Validate required env vars
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase environment variables not set. Check your .env file.'
  )
}
