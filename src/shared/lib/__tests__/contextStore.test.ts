import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabaseClient before importing contextStore
vi.mock('@/shared/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  },
  isSupabaseConfigured: vi.fn(() => false),
}))

// Mock fetch for fallback
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('fetchContextFromStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  it('falls back to fetch when supabase is not configured', async () => {
    const mockData = { key: 'value' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const { fetchContextFromStore } = await import('../contextStore')
    const result = await fetchContextFromStore({
      slug: 'test',
      fallbackUrl: '/api/test.json',
      errorLabel: 'Test Context',
    })

    expect(result).toEqual(mockData)
    expect(mockFetch).toHaveBeenCalledWith('/api/test.json')
  })

  it('throws when fallback fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { fetchContextFromStore } = await import('../contextStore')
    await expect(
      fetchContextFromStore({
        slug: 'test',
        fallbackUrl: '/api/fail.json',
        errorLabel: 'Fail Context',
      })
    ).rejects.toThrow('Falha ao carregar Fail Context')
  })

  it('returns typed data from fallback', async () => {
    interface TestData { items: string[] }
    const mockData: TestData = { items: ['a', 'b'] }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const { fetchContextFromStore } = await import('../contextStore')
    const result = await fetchContextFromStore<TestData>({
      slug: 'typed-test',
      fallbackUrl: '/api/typed.json',
      errorLabel: 'Typed',
    })

    expect(result.items).toEqual(['a', 'b'])
  })
})
