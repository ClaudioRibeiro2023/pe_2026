/* eslint-disable no-empty */
// Valida onboarding tour (P01): clique-fora fecha, ESC fecha, não-bloqueante
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
  // NÃO seta localStorage → tour deve aparecer
  const page = await ctx.newPage()

  await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(2500) // aguarda 1.5s do tour + folga

  // Screenshot com tour aberto
  await page.screenshot({ path: join(OUT, '50-tour-open.png'), fullPage: false })
  console.log('  ✓ 50-tour-open')

  // Simula clique-fora → deve fechar (overlay transparente em z-90, não coberto)
  await page.mouse.click(1200, 400)
  await page.waitForTimeout(500)
  await page.screenshot({ path: join(OUT, '51-tour-after-click-outside.png'), fullPage: false })
  console.log('  ✓ 51-tour-after-click-outside')

  // Limpa localStorage e tenta ESC fechar
  await page.evaluate(() => {
    try { localStorage.removeItem('onboarding-completed') } catch (_e) { /* ignore */ }
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  await page.screenshot({ path: join(OUT, '52-tour-after-esc.png'), fullPage: false })
  console.log('  ✓ 52-tour-after-esc')

  // Página longa com scroll para ver ScrollProgress
  await page.goto(`${BASE}/analytics/scoreboard`, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(1500)
  await page.evaluate(() => {
    const el = document.querySelector('#main-content')
    if (el) el.scrollTop = 800
  })
  await page.waitForTimeout(300)
  await page.screenshot({ path: join(OUT, '53-scoreboard-scroll-progress.png'), fullPage: false })
  console.log('  ✓ 53-scoreboard-scroll-progress')

  // Tour reopen via guia de atalhos (? → clicar Refazer tour)
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(1200)
  // Marca tour como concluído para garantir que não reabre automaticamente
  await page.evaluate(() => {
    try { localStorage.setItem('onboarding-completed', 'true') } catch (_e) { /* ignore */ }
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  // Pressiona '?' para abrir ShortcutsGuide
  await page.keyboard.press('?')
  await page.waitForTimeout(600)
  await page.screenshot({ path: join(OUT, '54-shortcuts-guide-with-refresh.png'), fullPage: false })
  console.log('  ✓ 54-shortcuts-guide-with-refresh')

  await browser.close()
  console.log('\n✅ Screenshots do tour em audit/screenshots-v2/')
})()
