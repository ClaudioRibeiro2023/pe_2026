import type { BaseEntity } from '@/shared/types'

export interface Area extends BaseEntity {
  slug: string
  name: string
  owner: string | null
  focus: string | null
  color?: string
}

export interface AreaFormData {
  name: string
  slug: string
  owner: string
  focus: string
  color?: string
}

export interface CreateAreaData {
  name: string
  slug?: string
  owner?: string
  focus?: string
  color?: string
}

export interface UpdateAreaData {
  name?: string
  slug?: string
  owner?: string
  focus?: string
  color?: string
}
