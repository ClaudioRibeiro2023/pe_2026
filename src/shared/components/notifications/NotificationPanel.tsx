import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, CheckCircle, X, AlertCircle, AlertTriangle, Info } from '@/shared/ui/icons'
import { useNotifications } from '@/shared/contexts/NotificationContext'
import { cn } from '@/shared/lib/cn'
import { Link } from 'react-router-dom'

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()

  if (!open) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-danger-600" />
      default:
        return <Info className="h-5 w-5 text-primary-600" />
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-surface rounded-lg shadow-xl border border-border z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-foreground" />
            <h3 className="font-semibold text-foreground">Notificações</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-600 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent text-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="h-12 w-12 text-muted mb-3" />
            <p className="text-sm text-muted text-center">Nenhuma notificação</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-accent/30">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs text-primary-600 hover:text-primary-700 disabled:text-muted disabled:cursor-not-allowed"
              >
                Marcar todas como lidas
              </button>
              <button
                onClick={clearAll}
                className="text-xs text-danger-600 hover:text-danger-700"
              >
                Limpar todas
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'px-4 py-3 border-b border-border hover:bg-accent/50 transition-colors',
                    !notification.read && 'bg-primary-50/50 dark:bg-primary-950/20'
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex-shrink-0 p-1 rounded hover:bg-accent"
                            title="Marcar como lida"
                          >
                            <CheckCircle className="h-4 w-4 text-muted" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-muted mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                        {notification.actionUrl && notification.actionLabel && (
                          <Link
                            to={notification.actionUrl}
                            onClick={onClose}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {notification.actionLabel}
                          </Link>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="flex-shrink-0 p-1 rounded hover:bg-accent text-muted hover:text-foreground"
                      title="Remover"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
