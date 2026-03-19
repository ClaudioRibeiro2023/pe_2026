import { test, expect } from '@playwright/test'

/**
 * Smoke tests — Navigation & Route Guards
 *
 * Without Supabase configured, protected routes redirect to /login.
 * These tests verify the redirect behavior and that pages render without errors.
 */

const protectedRoutes = [
  '/dashboard',
  '/goals',
  '/indicators',
  '/action-plans',
  '/strategy',
  '/reports',
  '/admin',
  '/area-plans',
  '/governance/decisions',
  '/governance/closings',
  '/planning',
  '/calendar',
]

test.describe('Navigation — Route Guards', () => {
  for (const route of protectedRoutes) {
    test(`${route} redirects to login when unauthenticated`, async ({ page }) => {
      // Collect console errors
      const jsErrors: string[] = []
      page.on('pageerror', (err) => jsErrors.push(err.message))

      await page.goto(route)
      await page.waitForLoadState('networkidle')

      // Protected route should redirect to /login
      await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })

      // No JS errors should have occurred
      expect(jsErrors).toHaveLength(0)
    })
  }
})

test.describe('Navigation — Public Routes', () => {
  test('root redirects to dashboard then login', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Should end up at /login (via /dashboard redirect chain)
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })

  test('login page renders without errors', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    expect(jsErrors).toHaveLength(0)
  })

  test('reset-password page renders without errors', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto('/reset-password')
    await page.waitForLoadState('networkidle')
    // Should render the reset password form or an info message
    expect(jsErrors).toHaveLength(0)
  })
})
