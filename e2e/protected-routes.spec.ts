import { test, expect } from '@playwright/test'

/**
 * Smoke tests — Error Handling & Edge Cases
 *
 * Verifies 404 handling and that the app doesn't crash on invalid routes.
 */

test.describe('Error Handling', () => {
  test('unknown route does not crash the app', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto('/this-route-does-not-exist')
    await page.waitForLoadState('networkidle')

    // App should render something (not a blank page)
    const bodyText = await page.textContent('body')
    expect(bodyText?.trim().length).toBeGreaterThan(0)

    // No uncaught JS errors
    expect(jsErrors).toHaveLength(0)
  })

  test('deeply nested unknown route does not crash', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto('/foo/bar/baz/qux')
    await page.waitForLoadState('networkidle')

    const bodyText = await page.textContent('body')
    expect(bodyText?.trim().length).toBeGreaterThan(0)
    expect(jsErrors).toHaveLength(0)
  })

  test('app loads without console errors on initial visit', async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // App should render something regardless of auth mode
    const bodyText = await page.textContent('body')
    expect(bodyText?.trim().length).toBeGreaterThan(0)
    expect(jsErrors).toHaveLength(0)
  })
})
