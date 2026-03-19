import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Plus, MoreVertical } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { NODE_TYPE_LABELS, NODE_TYPE_COLORS } from '@/features/plan-templates/types'
import type { PlanAction, NodeType } from '../types'

interface ActionTreeViewProps {
  actions: PlanAction[]
  onActionClick?: (action: PlanAction) => void
  onAddChild?: (parentAction: PlanAction) => void
  onEditAction?: (action: PlanAction) => void
  selectedActionId?: string
}

interface ActionNode extends PlanAction {
  children: ActionNode[]
  level: number
}

function buildTree(actions: PlanAction[]): ActionNode[] {
  const actionMap = new Map<string, ActionNode>()
  const roots: ActionNode[] = []

  // Criar nós com children vazios
  actions.forEach((action) => {
    actionMap.set(action.id, { ...action, children: [], level: 0 })
  })

  // Construir hierarquia
  actions.forEach((action) => {
    const node = actionMap.get(action.id)!
    if (action.parent_action_id && actionMap.has(action.parent_action_id)) {
      const parent = actionMap.get(action.parent_action_id)!
      node.level = parent.level + 1
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  // Ordenar filhos por prioridade
  const sortNodes = (nodes: ActionNode[]) => {
    nodes.sort((a, b) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2 }
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 1)
    })
    nodes.forEach((node) => sortNodes(node.children))
  }

  sortNodes(roots)
  return roots
}

interface ActionTreeItemProps {
  node: ActionNode
  onActionClick?: (action: PlanAction) => void
  onAddChild?: (parentAction: PlanAction) => void
  onEditAction?: (action: PlanAction) => void
  selectedActionId?: string
  expandedIds: Set<string>
  toggleExpanded: (id: string) => void
}

function ActionTreeItem({
  node,
  onActionClick,
  onAddChild,
  onEditAction,
  selectedActionId,
  expandedIds,
  toggleExpanded,
}: ActionTreeItemProps) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const isSelected = selectedActionId === node.id
  const isLeaf = node.node_type === 'acao'

  const statusColors: Record<string, string> = {
    PENDENTE: 'bg-accent text-muted',
    EM_ANDAMENTO: 'bg-blue-100 text-blue-700',
    BLOQUEADA: 'bg-red-100 text-red-700',
    AGUARDANDO_EVIDENCIA: 'bg-yellow-100 text-yellow-700',
    EM_VALIDACAO: 'bg-purple-100 text-purple-700',
    CONCLUIDA: 'bg-green-100 text-green-700',
    CANCELADA: 'bg-accent text-muted',
  }

  const priorityColors: Record<string, string> = {
    P0: 'bg-red-500',
    P1: 'bg-orange-500',
    P2: 'bg-blue-500',
  }

  return (
    <div className="select-none">
      <div
        className={`group flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-primary-100 border border-primary-300' : 'hover:bg-accent'
        }`}
        style={{ paddingLeft: `${node.level * 24 + 12}px` }}
        onClick={() => onActionClick?.(node)}
      >
        {/* Expand/Collapse */}
        <button
          className="w-5 h-5 flex items-center justify-center text-muted hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) toggleExpanded(node.id)
          }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <span className="w-4 h-4" />
          )}
        </button>

        {/* Priority indicator */}
        <div className={`w-2 h-2 rounded-full ${priorityColors[node.priority] || priorityColors.P1}`} />

        {/* Node type badge */}
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded ${
            NODE_TYPE_COLORS[node.node_type as NodeType] || 'bg-accent text-muted'
          }`}
        >
          {NODE_TYPE_LABELS[node.node_type as NodeType] || node.node_type}
        </span>

        {/* Title */}
        <span className="flex-1 text-sm font-medium text-foreground truncate">{node.title}</span>

        {/* Progress */}
        {isLeaf && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all"
                style={{ width: `${node.progress || 0}%` }}
              />
            </div>
            <span className="text-xs text-muted w-8">{node.progress || 0}%</span>
          </div>
        )}

        {/* Status */}
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[node.status] || statusColors.PENDENTE}`}>
          {node.status.replace('_', ' ')}
        </span>

        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          {!isLeaf && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onAddChild?.(node)
              }}
              title="Adicionar filho"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onEditAction?.(node)
            }}
            title="Editar"
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <ActionTreeItem
              key={child.id}
              node={child}
              onActionClick={onActionClick}
              onAddChild={onAddChild}
              onEditAction={onEditAction}
              selectedActionId={selectedActionId}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ActionTreeView({
  actions,
  onActionClick,
  onAddChild,
  onEditAction,
  selectedActionId,
}: ActionTreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Por padrão, expandir todos os nós não-folha
    return new Set(actions.filter((a) => a.node_type !== 'acao').map((a) => a.id))
  })

  const tree = useMemo(() => buildTree(actions), [actions])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    setExpandedIds(new Set(actions.map((a) => a.id)))
  }

  const collapseAll = () => {
    setExpandedIds(new Set())
  }

  if (actions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted">Nenhuma ação cadastrada neste plano.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expandir tudo
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Recolher tudo
          </Button>
        </div>
        <div className="text-sm text-muted">
          {actions.length} {actions.length === 1 ? 'item' : 'itens'}
        </div>
      </div>

      {/* Tree */}
      <Card className="p-2">
        {tree.map((node) => (
          <ActionTreeItem
            key={node.id}
            node={node}
            onActionClick={onActionClick}
            onAddChild={onAddChild}
            onEditAction={onEditAction}
            selectedActionId={selectedActionId}
            expandedIds={expandedIds}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </Card>
    </div>
  )
}
