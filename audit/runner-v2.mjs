/* eslint-disable no-empty */
// Re-auditoria visual pós-refactor
// Uso: node audit/runner-v2.mjs
// Requisitos: preview em http://localhost:4174 (npm run build && npm run preview)

import { chromium } from 'playwright'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.BASE_URL || 'http://localhost:4174'
const OUT = join(__dirname, 'screenshots-v2')
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

const ROUTES = [
  ['01-dashboard', '/dashboard'],
  ['02-sidebar-expanded', '/dashboard'],
  ['03-planning', '/planning'],
  ['04-planning-rh', '/planning/rh/dashboard'],
  ['05-analytics-scoreboard', '/analytics/scoreboard'],
  ['06-strategy-okrs', '/strategy/okrs'],
  ['07-strategy-risks', '/strategy/risks'],
  ['08-strategy-scenarios', '/strategy/scenarios'],
  ['09-goals', '/goals'],
  ['10-initiatives', '/initiatives'],
  ['11-actions-approvals', '/planning/actions/approvals'],
  ['12-admin', '/admin'],
  // Redirects adicionados na Fase 0
  ['redir-01-governance', '/governance'],
  ['redir-02-strategy-overview', '/strategy/overview'],
  ['redir-03-analytics-reports', '/analytics/reports'],
]

;(async () => {
  console.log('\n=== RE-AUDITORIA PE2026 v2 (pós-refactor) ===\n')
  const browser = await chromium.launch({ headless: true })

  // ── DESKTOP com localStorage populado para evitar onboarding ──
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  // Pré-popular para não disparar o tour
  await page.addInitScript(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch {}
    try { localStorage.setItem('sidebar-collapsed', 'false') } catch {}
  })

  console.log('[desktop 1440×900]')
  for (const [slug, path] of ROUTES) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(1000)
      await page.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch (err) {
      console.log(`  ✗ ${slug}: ${String(err).split('\n')[0]}`)
    }
  }

  // Sidebar colapsada
  console.log('[sidebar colapsada]')
  await page.addInitScript(() => {
    try { localStorage.setItem('sidebar-collapsed', 'true') } catch {}
  })
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx2.addInitScript(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch {}
    try { localStorage.setItem('sidebar-collapsed', 'true') } catch {}
  })
  const page2 = await ctx2.newPage()
  for (const [slug, path] of [
    ['20-collapsed-dashboard', '/dashboard'],
    ['21-collapsed-planning', '/planning/rh/dashboard'],
    ['22-collapsed-scoreboard', '/analytics/scoreboard'],
  ]) {
    try {
      await page2.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page2.waitForTimeout(800)
      await page2.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch {}
  }
  await ctx2.close()
  await ctx.close()

  // Mobile
  console.log('[mobile 390×844]')
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await mCtx.addInitScript(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch {}
  })
  const mPage = await mCtx.newPage()
  for (const [slug, path] of [
    ['30-mobile-dashboard', '/dashboard'],
    ['31-mobile-planning', '/planning'],
    ['32-mobile-scoreboard', '/analytics/scoreboard'],
    ['33-mobile-okrs', '/strategy/okrs'],
  ]) {
    try {
      await mPage.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await mPage.waitForTimeout(800)
      await mPage.screenshot({ path: join(OUT, `${slug}.png`), fullPage: true })
      console.log(`  ✓ ${slug}`)
    } catch {}
  }

  // Mobile drawer aberto
  console.log('[mobile drawer]')
  try {
    await mPage.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await mPage.waitForTimeout(800)
    const hamburger = mPage.locator('button[aria-label="Abrir menu"]').first()
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await mPage.waitForTimeout(600)
      await mPage.screenshot({ path: join(OUT, '40-mobile-drawer-open.png'), fullPage: true })
      console.log('  ✓ 40-mobile-drawer-open')
    }
  } catch {}
  await mCtx.close()

  await browser.close()
  console.log(`\n✅ Concluído. Screenshots em: ${OUT}\n`)
})()
