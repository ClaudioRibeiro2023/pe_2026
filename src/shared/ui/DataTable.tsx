import { useState, useMemo, useCallback, type ReactNode } from 'react'
import { ChevronUp, ChevronDown } from '@/shared/ui/icons'
import { Skeleton } from './Skeleton'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DataTableColumn<T> {
  /** Unique key for the column (used for sorting) */
  key: string
  /** Header label */
  header: string
  /** Is this column sortable? */
  sortable?: boolean
  /** Custom render function — receives the row */
  render?: (row: T) => ReactNode
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Minimum width class e.g. 'min-w-[120px]' */
  className?: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  /** Function or key string to derive a unique row key */
  rowKey: string | ((row: T) => string)
  /** Show loading skeleton */
  isLoading?: boolean
  /** Element shown when rows is empty */
  emptyState?: ReactNode
  /** Page size options */
  pageSizeOptions?: number[]
  /** Additional wrapper class */
  className?: string
}

type SortDir = 'asc' | 'desc'

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyState,
  pageSizeOptions = [10, 25, 50],
  className = '',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10)

  /* ---- Sort ---- */
  const sorted = useMemo(() => {
    if (!sortKey) return rows
    return [...rows].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va
      }
      const sa = String(va).toLowerCase()
      const sb = String(vb).toLowerCase()
      const cmp = sa.localeCompare(sb)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir])

  /* ---- Pagination ---- */
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize)

  const getRowKey = useCallback(
    (row: T, idx: number): string => {
      if (typeof rowKey === 'function') return rowKey(row)
      return String((row as Record<string, unknown>)[rowKey] ?? idx)
    },
    [rowKey],
  )

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(0)
  }

  /* ---- Loading state ---- */
  if (isLoading) {
    return (
      <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      </div>
    )
  }

  /* ---- Empty state ---- */
  if (rows.length === 0) {
    return (
      <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
        {emptyState ?? (
          <div className="py-12 text-center text-muted text-sm">
            Nenhum registro encontrado.
          </div>
        )}
      </div>
    )
  }

  /* ---- Table ---- */
  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              {columns.map((col) => {
                const isSorted = sortKey === col.key
                const align = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={`px-4 py-3 font-medium text-muted whitespace-nowrap select-none ${align} ${col.className ?? ''} ${
                      col.sortable ? 'cursor-pointer hover:text-foreground' : ''
                    }`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="inline-flex flex-col" aria-hidden="true">
                          {isSorted ? (
                            sortDir === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )
                          ) : (
                            <span className="flex flex-col -space-y-1 opacity-40"><ChevronUp className="h-2.5 w-2.5" /><ChevronDown className="h-2.5 w-2.5" /></span>
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((row, idx) => (
              <tr
                key={getRowKey(row, safePage * pageSize + idx)}
                className="hover:bg-accent/30 transition-colors"
              >
                {columns.map((col) => {
                  const align = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  return (
                    <td key={col.key} className={`px-4 py-3 text-foreground ${align} ${col.className ?? ''}`}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '-')}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {sorted.length > pageSizeOptions[0] && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-border bg-accent/20 text-sm">
          <div className="flex items-center gap-2 text-muted">
            <span>Mostrando</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSize(Number(e.target.value))}
              className="h-7 px-2 text-xs rounded border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-label="Itens por pagina"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span>
              de {sorted.length} {sorted.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          <nav aria-label="Paginacao" className="flex items-center gap-1">
            <button
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-2.5 py-1 rounded border border-border text-foreground bg-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              aria-label="Pagina anterior"
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  i === safePage
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-border text-foreground bg-surface hover:bg-accent'
                }`}
                aria-current={i === safePage ? 'page' : undefined}
                aria-label={`Pagina ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="px-2.5 py-1 rounded border border-border text-foreground bg-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              aria-label="Proxima pagina"
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
