/* eslint-disable no-empty */
// Captura focada em Goals + Indicators para validar IconButton
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
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch (_e) { /* ignore */ }
  })
  const page = await ctx.newPage()

  for (const [slug, path] of [
    ['40-goals-iconbutton', '/goals'],
    ['41-indicators-iconbutton', '/indicators'],
  ]) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 })
      // Espera cards renderizarem
      try {
        await page.waitForSelector('[class*="border"]', { timeout: 5000 })
      } catch (_e) { /* sem cards, captura mesmo assim */ }
      await page.waitForTimeout(1500)
      await page.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch (e) {
      console.log(`  ✗ ${slug}: ${String(e).split('\n')[0].slice(0, 80)}`)
    }
  }

  await browser.close()
})()
