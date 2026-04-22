/* eslint-disable no-empty */
// Validação em dark mode
import { chromium } from 'playwright'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = join(__dirname, 'screenshots-v2')
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  })
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('onboarding-completed', 'true')
      localStorage.setItem('sidebar-collapsed', 'false')
      localStorage.setItem('app-theme', 'dark')
    } catch (_e) { /* ignore */ }
  })
  const page = await ctx.newPage()

  const routes = [
    ['60-dark-dashboard', '/dashboard'],
    ['61-dark-scoreboard', '/analytics/scoreboard'],
    ['62-dark-okrs', '/strategy/okrs'],
    ['63-dark-risks', '/strategy/risks'],
    ['64-dark-planning-rh', '/planning/rh/dashboard'],
    ['65-dark-approvals', '/planning/actions/approvals'],
    ['66-dark-alerts', '/alerts'],
    ['67-dark-goals', '/goals'],
  ]

  for (const [slug, path] of routes) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 })
      await page.waitForTimeout(1200)
      await page.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch (e) {
      console.log(`  ✗ ${slug}: ${String(e).split('\n')[0].slice(0, 80)}`)
    }
  }

  // Mobile dark
  const mCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  })
  await mCtx.addInitScript(() => {
    try {
      localStorage.setItem('onboarding-completed', 'true')
      localStorage.setItem('app-theme', 'dark')
    } catch (_e) { /* ignore */ }
  })
  const mPage = await mCtx.newPage()
  for (const [slug, path] of [
    ['70-dark-mobile-dashboard', '/dashboard'],
    ['71-dark-mobile-scoreboard', '/analytics/scoreboard'],
  ]) {
    try {
      await mPage.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 })
      await mPage.waitForTimeout(1000)
      await mPage.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch (e) {
      console.log(`  ✗ ${slug}: ${String(e).split('\n')[0].slice(0, 80)}`)
    }
  }

  await browser.close()
  console.log('\n✅ Dark mode screenshots em audit/screenshots-v2/')
})()
