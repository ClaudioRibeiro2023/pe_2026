import { useState } from 'react'
import { Check, Layers, Building2, Target, ListTodo } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { usePlanTemplates } from '../hooks'
import { NODE_TYPE_LABELS, NODE_TYPE_COLORS } from '../types'

interface TemplateSelectorProps {
  value: string | null
  onChange: (templateId: string) => void
  className?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  building: Building2,
  target: Target,
  list: ListTodo,
}

export function TemplateSelector({ value, onChange, className = '' }: TemplateSelectorProps) {
  const { data: templates = [], isLoading } = usePlanTemplates()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-accent animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${className}`}>
      {templates.map((template) => {
        const isSelected = value === template.id
        const isHovered = hoveredId === template.id
        const IconComponent = iconMap[template.icon || 'layers'] || Layers

        return (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'ring-2 ring-primary-500 border-primary-500'
                : isHovered
                ? 'border-primary-300'
                : 'border-border'
            }`}
            onClick={() => onChange(template.id)}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${template.color}20`, color: template.color }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{template.name}</h4>
                    <p className="text-xs text-muted mt-0.5">{template.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {(() => {
                const struct = Array.isArray(template.structure) ? template.structure : []
                return (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {struct.map((nodeType, idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${NODE_TYPE_COLORS[nodeType]}`}
                        >
                          {NODE_TYPE_LABELS[nodeType]}
                        </span>
                        {idx < struct.length - 1 && (
                          <span className="text-muted text-xs">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                )
              })()}

              {template.is_default && (
                <div className="mt-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-primary-100 text-primary-700">
                    Recomendado
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
