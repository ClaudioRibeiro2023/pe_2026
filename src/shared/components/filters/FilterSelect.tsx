import { ChevronDown } from '@/shared/ui/icons'

interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  className?: string
  id?: string
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className = '',
  id,
}: FilterSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={selectId} className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 pr-10 text-sm border border-border rounded-lg bg-surface text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer hover:border-muted"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
      </div>
    </div>
  )
}
