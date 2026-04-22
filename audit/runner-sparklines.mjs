/* eslint-disable no-empty */
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

  // Desktop light
  const ctxLight = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctxLight.addInitScript(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch (_e) { /* ignore */ }
  })
  const p1 = await ctxLight.newPage()
  await p1.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 })
  await p1.waitForTimeout(1500)
  await p1.screenshot({ path: join(OUT, '80-dashboard-sparklines-light.png'), fullPage: false })
  console.log('  ✓ 80-dashboard-sparklines-light')

  // Desktop dark
  const ctxDark = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  })
  await ctxDark.addInitScript(() => {
    try {
      localStorage.setItem('onboarding-completed', 'true')
      localStorage.setItem('app-theme', 'dark')
    } catch (_e) { /* ignore */ }
  })
  const p2 = await ctxDark.newPage()
  await p2.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 })
  await p2.waitForTimeout(1500)
  await p2.screenshot({ path: join(OUT, '81-dashboard-sparklines-dark.png'), fullPage: false })
  console.log('  ✓ 81-dashboard-sparklines-dark')

  // Mobile light (sparklines devem aparecer bem em 390px)
  const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctxMobile.addInitScript(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch (_e) { /* ignore */ }
  })
  const p3 = await ctxMobile.newPage()
  await p3.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 })
  await p3.waitForTimeout(1500)
  await p3.screenshot({ path: join(OUT, '82-dashboard-sparklines-mobile.png'), fullPage: false })
  console.log('  ✓ 82-dashboard-sparklines-mobile')

  await browser.close()
})()
