import { useState } from 'react'
import { Edit3, Save, X } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import type { AreaPackSection } from '../types'

interface SectionContentProps {
  section: AreaPackSection
  onUpdate?: (data: { body_markdown?: string; structured_data?: Record<string, unknown> }) => void
  isUpdating?: boolean
  readonly?: boolean
}

export function SectionContent({ 
  section, 
  onUpdate, 
  isUpdating,
  readonly = false 
}: SectionContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(section.body_markdown || '')

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ body_markdown: content })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setContent(section.body_markdown || '')
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg">{section.title}</CardTitle>
        {!readonly && !isEditing && onUpdate && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Editar
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
            >
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-3 border border-border rounded-lg font-mono text-sm resize-y bg-surface focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Conteúdo em Markdown..."
          />
        ) : section.body_markdown ? (
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer content={section.body_markdown} />
          </div>
        ) : (
          <p className="text-muted italic">
            Nenhum conteúdo ainda. Clique em "Editar" para adicionar.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold text-foreground">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold text-foreground mt-4">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium text-foreground mt-3">{line.slice(4)}</h3>
        }
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 text-foreground">
              {renderInlineMarkdown(line.slice(2))}
            </li>
          )
        }
        if (line.startsWith('| ')) {
          return (
            <div key={index} className="font-mono text-sm text-muted bg-accent px-2 py-1 rounded">
              {line}
            </div>
          )
        }
        if (line.trim() === '') {
          return <div key={index} className="h-2" />
        }
        return <p key={index} className="text-foreground">{renderInlineMarkdown(line)}</p>
      })}
    </div>
  )
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/)
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      return (
        <a 
          key={i} 
          href={linkMatch[2]} 
          className="text-blue-600 hover:underline"
        >
          {linkMatch[1]}
        </a>
      )
    }
    return part
  })
}
