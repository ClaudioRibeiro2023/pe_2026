/**
 * Playwright config para testes autenticados contra o Supabase local (Docker).
 *
 * Pré-requisitos:
 *   1. Supabase local rodando (docker ps | grep supabase_kong_PE_2026)
 *   2. .env.development.local com VITE_SUPABASE_URL=http://127.0.0.1:54321
 *   3. Seed 10 aplicado: admin@pe2026.local / pe2026@admin
 *
 * Execução:
 *   npx playwright test --config=playwright.local.config.ts
 *   npm run test:e2e:local
 */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 45_000,

  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium-local',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx vite dev --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: false,
    timeout: 90_000,
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
    },
  },
})
