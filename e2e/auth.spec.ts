import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Template/)
    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByText(/email inválido/i)).toBeVisible()
  })

  test('should navigate to signup', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /não tem conta/i }).click()
    await expect(page.getByRole('heading', { name: /criar conta/i })).toBeVisible()
  })

  test('should show password recovery form', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /esqueceu sua senha/i }).click()
    await expect(page.getByRole('heading', { name: /recuperar senha/i })).toBeVisible()
  })
})
