import { test, expect } from '@playwright/test'

test.describe('Authentication — Login Page', () => {
  test.skip(!process.env.E2E_TEST_EMAIL, 'Requires Supabase auth mode — run via: npm run test:e2e:local')
  test('should redirect root to login', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL(/\/login/)
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display login form with email and password fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/senha/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
  })

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByText(/email inválido/i)).toBeVisible()
  })

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/senha/i).fill('123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByText(/mínimo 6 caracteres/i)).toBeVisible()
  })

  test('should show password recovery form', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/esqueceu/i).click()
    await expect(page.getByText(/recuperar|redefinir/i)).toBeVisible()
  })
})
