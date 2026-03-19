import { describe, it, expect } from 'vitest'
import {
  NODE_TYPE_LABELS,
  NODE_TYPE_COLORS,
  DEFAULT_TEMPLATES,
  type NodeType,
} from '../types'

describe('NODE_TYPE maps', () => {
  const types: NodeType[] = ['macro', 'area', 'meta', 'pilar', 'acao']

  it('LABELS has entry for every node type', () => {
    for (const t of types) {
      expect(NODE_TYPE_LABELS[t]).toBeTruthy()
    }
  })

  it('COLORS has entry for every node type', () => {
    for (const t of types) {
      expect(NODE_TYPE_COLORS[t]).toBeTruthy()
    }
  })

  it('LABELS and COLORS have same keys', () => {
    expect(Object.keys(NODE_TYPE_LABELS).sort()).toEqual(
      Object.keys(NODE_TYPE_COLORS).sort()
    )
  })
})

describe('DEFAULT_TEMPLATES', () => {
  it('has at least 3 templates', () => {
    expect(DEFAULT_TEMPLATES.length).toBeGreaterThanOrEqual(3)
  })

  it('each template has id, name, and structure', () => {
    for (const t of DEFAULT_TEMPLATES) {
      expect(t.id).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(Array.isArray(t.structure)).toBe(true)
      expect(t.structure.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('exactly one template is default', () => {
    const defaults = DEFAULT_TEMPLATES.filter(t => t.is_default)
    expect(defaults.length).toBe(1)
  })

  it('all structure entries are valid NodeTypes', () => {
    const validTypes: NodeType[] = ['macro', 'area', 'meta', 'pilar', 'acao']
    for (const t of DEFAULT_TEMPLATES) {
      for (const node of t.structure) {
        expect(validTypes).toContain(node)
      }
    }
  })

  it('full template has all 5 levels', () => {
    const full = DEFAULT_TEMPLATES.find(t => t.id === 'template-full')
    expect(full).toBeDefined()
    expect(full!.structure).toHaveLength(5)
  })

  it('flat template has only acao', () => {
    const flat = DEFAULT_TEMPLATES.find(t => t.id === 'template-flat')
    expect(flat).toBeDefined()
    expect(flat!.structure).toEqual(['acao'])
  })
})
