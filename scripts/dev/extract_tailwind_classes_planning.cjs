/**
 * Extract Tailwind CSS classes from Planning module + shared UI
 * Usage: node scripts/dev/extract_tailwind_classes_planning.js
 */
const fs = require('fs')
const path = require('path')

const DIRS = [
  'src/features/planning',
  'src/features/area-plans',
  'src/shared/ui',
  'src/shared/components',
  'src/app/layout',
]

const EXTENSIONS = ['.tsx', '.ts']

function walkDir(dir, results = []) {
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(full, results)
    } else if (EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
      results.push(full)
    }
  }
  return results
}

function extractClasses(content) {
  const classes = []
  // Match className="..." and className={cn(...)}
  const regex = /(?:className[=:]\s*["'`{]|cn\()([^"'`}]+)/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const raw = match[1]
    // Split by whitespace and filter
    const tokens = raw.split(/\s+/).filter(t =>
      t.length > 0 &&
      !t.startsWith('$') &&
      !t.startsWith('{') &&
      !t.includes('(') &&
      !t.includes(')') &&
      !t.startsWith("'") &&
      !t.startsWith('"') &&
      t !== '&&' &&
      t !== '||' &&
      t !== '?' &&
      t !== ':' &&
      !t.startsWith('//') &&
      /^[a-z\-!\/\[\]0-9.:@]/.test(t)
    )
    classes.push(...tokens)
  }
  return classes
}

// Collect
const repoRoot = process.cwd()
const allClasses = {}
let totalFiles = 0

for (const dir of DIRS) {
  const absDir = path.join(repoRoot, dir)
  const files = walkDir(absDir)
  for (const file of files) {
    totalFiles++
    const content = fs.readFileSync(file, 'utf8')
    const classes = extractClasses(content)
    for (const cls of classes) {
      allClasses[cls] = (allClasses[cls] || 0) + 1
    }
  }
}

// Sort by frequency
const sorted = Object.entries(allClasses)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 80)

// Categorize
const categories = {
  spacing: [],
  typography: [],
  colors: [],
  layout: [],
  borders: [],
  sizing: [],
  effects: [],
  other: [],
}

for (const [cls, count] of sorted) {
  if (/^(p[xytblr]?-|m[xytblr]?-|gap-|space-)/.test(cls)) categories.spacing.push([cls, count])
  else if (/^(text-[0-9smlx]|font-|tracking-|leading-)/.test(cls)) categories.typography.push([cls, count])
  else if (/^(text-(?:gray|blue|red|green|white|black|primary|success|danger|warning|info|muted|foreground)|bg-|border-(?:gray|blue|red|border))/.test(cls)) categories.colors.push([cls, count])
  else if (/^(flex|grid|items-|justify-|col-|row-|overflow|inline)/.test(cls)) categories.layout.push([cls, count])
  else if (/^(border|rounded|shadow|ring)/.test(cls)) categories.borders.push([cls, count])
  else if (/^(w-|h-|min-|max-|size-)/.test(cls)) categories.sizing.push([cls, count])
  else if (/^(animate|transition|opacity|hover:|focus|dark:)/.test(cls)) categories.effects.push([cls, count])
  else categories.other.push([cls, count])
}

// Output
console.log(`# Tailwind Classes Extraction - Planning Module`)
console.log(``)
console.log(`**Files scanned:** ${totalFiles}`)
console.log(`**Unique classes:** ${Object.keys(allClasses).length}`)
console.log(`**Top 80 shown below**`)
console.log(``)

console.log(`## Top 50 (by frequency)`)
console.log(``)
console.log(`| # | Class | Count |`)
console.log(`|---|-------|------:|`)
for (let i = 0; i < Math.min(50, sorted.length); i++) {
  console.log(`| ${i + 1} | \`${sorted[i][0]}\` | ${sorted[i][1]} |`)
}
console.log(``)

for (const [cat, items] of Object.entries(categories)) {
  if (items.length === 0) continue
  console.log(`## ${cat.charAt(0).toUpperCase() + cat.slice(1)}`)
  console.log(``)
  console.log(`| Class | Count |`)
  console.log(`|-------|------:|`)
  for (const [cls, count] of items.slice(0, 15)) {
    console.log(`| \`${cls}\` | ${count} |`)
  }
  console.log(``)
}
