/* eslint-disable no-empty */
// Re-auditoria rápida — 8 screenshots-chave para validar mudanças principais
import { chromium } from 'playwright'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = join(__dirname, 'screenshots-v2')
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

const TIMEOUT = 8000

;(async () => {
  console.log(`[quick-audit] BASE=${BASE}`)
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  // Pré-popular localStorage para evitar tour + sidebar expandida por padrão
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('onboarding-completed', 'true')
      localStorage.setItem('sidebar-collapsed', 'false')
    } catch (_e) { /* ignore */ }
  })

  const page = await ctx.newPage()
  const shots = [
    ['01-dashboard', '/dashboard'],
    ['02-planning-rh', '/planning/rh/dashboard'],
    ['03-scoreboard', '/analytics/scoreboard'],
    ['04-okrs', '/strategy/okrs'],
    ['05-risks', '/strategy/risks'],
    ['06-approvals', '/planning/actions/approvals'],
    ['07-initiatives', '/initiatives'],
    ['08-alerts', '/alerts'],
    ['redir-governance', '/governance'],
    ['redir-strategy-overview', '/strategy/overview'],
  ]

  for (const [slug, path] of shots) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: TIMEOUT })
      await page.waitForTimeout(1200)
      await page.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch (e) {
      console.log(`  ✗ ${slug}: ${String(e).split('\n')[0].slice(0, 80)}`)
    }
  }

  // Sidebar colapsada
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx2.addInitScript(() => {
    try {
      localStorage.setItem('onboarding-completed', 'true')
      localStorage.setItem('sidebar-collapsed', 'true')
    } catch (_e) { /* ignore */ }
  })
  const page2 = await ctx2.newPage()
  try {
    await page2.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: TIMEOUT })
    await page2.waitForTimeout(1000)
    await page2.screenshot({ path: join(OUT, '20-collapsed-dashboard.png'), fullPage: true })
    console.log('  ✓ 20-collapsed-dashboard')
  } catch (e) {
    console.log(`  ✗ 20-collapsed-dashboard: ${String(e).split('\n')[0].slice(0, 80)}`)
  }

  // Mobile
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await mCtx.addInitScript(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch (_e) { /* ignore */ }
  })
  const mPage = await mCtx.newPage()
  for (const [slug, path] of [
    ['30-mobile-dashboard', '/dashboard'],
    ['31-mobile-scoreboard', '/analytics/scoreboard'],
    ['32-mobile-planning-rh', '/planning/rh/dashboard'],
  ]) {
    try {
      await mPage.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: TIMEOUT })
      await mPage.waitForTimeout(1000)
      await mPage.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch (e) {
      console.log(`  ✗ ${slug}: ${String(e).split('\n')[0].slice(0, 80)}`)
    }
  }

  await browser.close()
  console.log(`\n✅ Screenshots em: ${OUT}`)
})()
