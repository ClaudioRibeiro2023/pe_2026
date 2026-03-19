import { ChevronLeft, ChevronRight } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  canGoNext: boolean
  canGoPrevious: boolean
  paginationRange: (number | string)[]
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  canGoNext,
  canGoPrevious,
  paginationRange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {paginationRange.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-2 text-muted">
              ...
            </span>
          )
        }

        const pageNumber = page as number
        const isActive = pageNumber === currentPage

        return (
          <Button
            key={pageNumber}
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className="min-w-[40px]"
          >
            {pageNumber}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
