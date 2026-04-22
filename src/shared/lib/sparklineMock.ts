/**
 * Gerador determinístico de séries históricas sintéticas para sparklines em demo mode.
 *
 * Quando o backend não fornece série temporal, geramos uma "história plausível"
 * convergindo para o valor atual, com volatilidade controlada e tendência direcional.
 *
 * Determinístico: mesma entrada produz mesma saída (útil para snapshot testing).
 */

export type SparklineTrend = 'up' | 'down' | 'stable' | 'volatile'

interface GenerateOptions {
  /** Valor atual (último ponto da série). */
  current: number
  /** Número de pontos. Default 12. */
  points?: number
  /** Tendência direcional. Default 'stable'. */
  trend?: SparklineTrend
  /** Seed determinística (ex: id do KPI). Default: soma dos char codes do stringify(current). */
  seed?: string | number
  /** Amplitude máxima da variação aleatória como % do current. Default 0.08 (8%). */
  volatility?: number
}

/**
 * Hash FNV-1a 32-bit → número pseudoaleatório reprodutível.
 */
function seededRand(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s ^ (s >>> 15), 2246822519)
    s = Math.imul(s ^ (s >>> 13), 3266489917)
    s ^= s >>> 16
    return (s >>> 0) / 4294967296
  }
}

function hashSeed(input: string | number): number {
  const str = String(input)
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Gera série sintética que termina em `current` seguindo `trend`.
 * A série inicia num ponto base e caminha em direção ao current com ruído.
 */
export function generateSparklineSeries({
  current,
  points = 12,
  trend = 'stable',
  seed,
  volatility = 0.08,
}: GenerateOptions): number[] {
  if (!Number.isFinite(current) || points < 2) return [current, current]

  const s = hashSeed(seed ?? String(current))
  const rand = seededRand(s)

  // Define valor de partida com base no trend
  let startMultiplier: number
  switch (trend) {
    case 'up':
      startMultiplier = 0.6 + rand() * 0.15 // começa em 60-75% do current
      break
    case 'down':
      startMultiplier = 1.25 + rand() * 0.2 // começa em 125-145%
      break
    case 'volatile':
      startMultiplier = 0.85 + rand() * 0.3
      break
    case 'stable':
    default:
      startMultiplier = 0.92 + rand() * 0.16 // entre 92-108%
      break
  }

  // Evita valores irreais quando current é 0 ou muito pequeno
  const safeCurrent = current === 0 ? 1 : current
  const start = safeCurrent * startMultiplier
  const series: number[] = []

  for (let i = 0; i < points; i++) {
    const t = i / (points - 1)
    // Interpolação suave (ease-in-out)
    const eased = t * t * (3 - 2 * t)
    const base = start + (current - start) * eased
    // Ruído centrado em 0, amplitude = volatility * |current|
    const noiseScale = Math.abs(safeCurrent) * volatility
    const noise = (rand() - 0.5) * 2 * noiseScale
    // Último ponto sempre exatamente `current` (sem ruído)
    const value = i === points - 1 ? current : base + noise
    series.push(Number(value.toFixed(2)))
  }

  return series
}

/**
 * Inferir trend a partir de variação current vs previous.
 */
export function inferTrend(current: number, previous: number | null | undefined): SparklineTrend {
  if (previous === null || previous === undefined || previous === 0) return 'stable'
  const delta = ((current - previous) / previous) * 100
  if (delta >= 5) return 'up'
  if (delta <= -5) return 'down'
  return 'stable'
}
