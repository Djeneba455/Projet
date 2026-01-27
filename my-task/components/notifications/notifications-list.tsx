'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/app/actions/notifications'
import { useRouter } from 'next/navigation'
import { formatDateTime } from '@/lib/utils'
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle } from 'lucide-react'

interface NotificationsListProps {
  notifications: any[]
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleMarkAsRead = async (id: string) => {
    setLoading(id)
    await markNotificationAsRead(id)
    router.refresh()
    setLoading(null)
  }

  const handleMarkAllAsRead = async () => {
    setLoading('all')
    await markAllNotificationsAsRead()
    router.refresh()
    setLoading(null)
  }

  const handleDelete = async (id: string) => {
    setLoading(id)
    await deleteNotification(id)
    router.refresh()
    setLoading(null)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400" />
      case 'error':
        return <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
      default:
        return <Info size={20} className="text-blue-600 dark:text-blue-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={loading === 'all'}
          >
            <CheckCheck size={16} className="mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
      )}

      {/* Notifications */}
      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune notification
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Vous n'avez pas encore de notifications
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 transition-all ${
                notification.read
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <Badge variant="default" className="flex-shrink-0">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {notification.message}
                  </p>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-start gap-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={loading === notification.id}
                      title="Marquer comme lu"
                    >
                      <Check size={16} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notification.id)}
                    disabled={loading === notification.id}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
