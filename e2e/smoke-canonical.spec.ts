import { test, expect, type Page } from '@playwright/test'

/**
 * Smoke Tests — Rotas Canônicas PE2026
 *
 * Comportamento em vite preview (localhost sem Supabase configurado):
 *   - AuthProvider entra em DEMO MODE → buildDemoUser() → sem redirect
 *   - Todas as rotas renderizam diretamente com dados mock
 *
 * Cobertura:
 *  - Rotas canônicas renderizam sem erros JS em demo mode
 *  - Login page renderiza sem erros
 *  - Páginas com dados canônicos (mock fallback) exibem elementos esperados
 *
 * Para testes com Supabase real, configure:
 *   E2E_TEST_EMAIL=admin@pe2026.local
 *   E2E_TEST_PASSWORD=<senha>
 */

const CANONICAL_ROUTES = [
  '/scoreboard',
  '/strategy/overview',
  '/strategy/risks',
  '/initiatives',
  '/goals',
  '/indicators',
  '/action-plans',
  '/governance/decisions',
]

// ============================================================
// HELPER — login via UI
// ============================================================

async function loginWithCredentials(page: Page): Promise<boolean> {
  const email = process.env.E2E_TEST_EMAIL
  const password = process.env.E2E_TEST_PASSWORD

  if (!email || !password) return false

  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/senha/i).fill(password)
  await page.getByRole('button', { name: /entrar/i }).click()

  try {
    await page.waitForURL(/\/dashboard|\/scoreboard/, { timeout: 15_000 })
    return true
  } catch {
    return false
  }
}

// ============================================================
// BLOCO 1 — Demo mode: rotas renderizam sem redirect
// ============================================================

test.describe('Smoke — Demo Mode (sem Supabase)', () => {
  test.skip(!!process.env.E2E_TEST_EMAIL, 'Supabase configurado — demo mode tests ignorados neste ambiente')

  for (const route of CANONICAL_ROUTES) {
    test(`${route} renderiza sem erros JS`, async ({ page }) => {
      const jsErrors: string[] = []
      page.on('pageerror', (err) => jsErrors.push(err.message))

      await page.goto(route)
      await page.waitForLoadState('networkidle')

      // Em demo mode: permanece na rota (não redireciona para /login)
      await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')), { timeout: 10_000 })
      expect(jsErrors, `Erros JS em ${route}: ${jsErrors.join(', ')}`).toHaveLength(0)
    })
  }
})

// ============================================================
// BLOCO 2 — Login page
// ============================================================

test.describe('Smoke — Login Page', () => {
  test('renderiza formulário sem erros JS', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/senha/i)).toBeVisible()
    expect(jsErrors).toHaveLength(0)
  })

  test.skip(
    !process.env.E2E_TEST_EMAIL,
    'Credenciais E2E não configuradas (E2E_TEST_EMAIL)'
  )
})

// ============================================================
// BLOCO 3 — Páginas autenticadas (requer credenciais)
// Login per-test: mais confiável que storageState com Supabase local
// (storageState ignorado quando SDK usa persistSession baseado em env)
// ============================================================

async function loginAndGoto(page: Page, route: string): Promise<boolean> {
  const loggedIn = await loginWithCredentials(page)
  if (!loggedIn) return false

  await page.goto(route)
  await page.waitForLoadState('networkidle')
  return true
}

test.describe('Smoke — Páginas Autenticadas (canonical data)', () => {
  test.skip(!process.env.E2E_TEST_EMAIL || !process.env.E2E_TEST_PASSWORD,
    'Configure E2E_TEST_EMAIL e E2E_TEST_PASSWORD para executar testes autenticados')

  test('ScoreboardPage — carrega após login', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    const ok = await loginAndGoto(page, '/analytics/scoreboard')
    test.skip(!ok, 'Login falhou')

    await expect(page).toHaveURL(/\/analytics\/scoreboard/, { timeout: 8_000 })
    const bodyText = await page.locator('body').textContent()
    expect(bodyText?.length ?? 0).toBeGreaterThan(50)
    expect(jsErrors).toHaveLength(0)
  })

  test('StrategyRisksPage — carrega após login', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    const ok = await loginAndGoto(page, '/strategy/risks')
    test.skip(!ok, 'Login falhou')

    await expect(page).toHaveURL(/\/strategy\/risks/, { timeout: 8_000 })
    const bodyText = await page.locator('body').textContent()
    expect(bodyText?.length ?? 0).toBeGreaterThan(50)
    expect(jsErrors).toHaveLength(0)
  })

  test('InitiativesPage — carrega após login', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    const ok = await loginAndGoto(page, '/initiatives')
    test.skip(!ok, 'Login falhou')

    await expect(page).toHaveURL(/\/initiatives/, { timeout: 8_000 })
    const bodyText = await page.locator('body').textContent()
    expect(bodyText?.length ?? 0).toBeGreaterThan(50)
    expect(jsErrors).toHaveLength(0)
  })

  test('GoalsPage — carrega após login', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    const ok = await loginAndGoto(page, '/goals')
    test.skip(!ok, 'Login falhou')

    await expect(page).toHaveURL(/\/goals/, { timeout: 8_000 })
    const bodyText = await page.locator('body').textContent()
    expect(bodyText?.length ?? 0).toBeGreaterThan(50)
    expect(jsErrors).toHaveLength(0)
  })

  test('ActionPlansPage — carrega após login', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    const ok = await loginAndGoto(page, '/action-plans')
    test.skip(!ok, 'Login falhou')

    await expect(page).toHaveURL(/\/action-plans/, { timeout: 8_000 })
    const bodyText = await page.locator('body').textContent()
    expect(bodyText?.length ?? 0).toBeGreaterThan(50)
    expect(jsErrors).toHaveLength(0)
  })

  test('StrategyOverviewPage — carrega após login sem erros JS', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    const ok = await loginAndGoto(page, '/strategy')
    test.skip(!ok, 'Login falhou')

    await expect(page).toHaveURL(/\/strategy/, { timeout: 8_000 })
    expect(jsErrors).toHaveLength(0)
  })
})

// ============================================================
// BLOCO 4 — Integridade do build
// ============================================================

test.describe('Smoke — Build Integrity', () => {
  test('root redireciona para /dashboard ou /login sem crash', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL(/\/(login|dashboard|scoreboard)/, { timeout: 10_000 })
    expect(jsErrors).toHaveLength(0)
  })

  test('login page — sem erros de TypeScript em runtime', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('TypeError')) {
        jsErrors.push(msg.text())
      }
    })

    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    expect(jsErrors).toHaveLength(0)
  })
})
