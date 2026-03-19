import { FileDown, FileSpreadsheet } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'

interface ExportButtonsProps {
  onExportPDF: () => void
  onExportExcel: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ExportButtons({
  onExportPDF,
  onExportExcel,
  disabled = false,
  size = 'sm',
}: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={onExportPDF}
        disabled={disabled}
        title="Exportar para PDF"
      >
        <FileDown className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size={size}
        onClick={onExportExcel}
        disabled={disabled}
        title="Exportar para Excel"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
    </div>
  )
}
