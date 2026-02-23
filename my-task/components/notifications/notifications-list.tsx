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
        return <CheckCircle size={20} className="text-green-400 light:text-green-600" />
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400 light:text-yellow-600" />
      case 'error':
        return <AlertTriangle size={20} className="text-red-400 light:text-red-600" />
      default:
        return <Info size={20} className="text-blue-400 light:text-blue-600" />
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
        <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-600 light:text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-white light:text-gray-900 mb-2">
            Aucune notification
          </h3>
          <p className="text-gray-400 light:text-gray-600">
            Vous n'avez pas encore de notifications
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-gray-800 light:bg-white rounded-lg shadow-sm border p-3 sm:p-4 transition-all ${
                notification.read
                  ? 'border-gray-700 light:border-gray-200'
                  : 'border-blue-800 light:border-blue-200 bg-blue-900/10 light:bg-blue-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Icon + Content */}
                <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1 sm:mb-2">
                      <h3 className="font-semibold text-white light:text-gray-900 break-words">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="default" className="flex-shrink-0">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 light:text-gray-600 mb-1 sm:mb-2 break-words">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end sm:justify-start gap-2 flex-shrink-0 border-t border-gray-700/50 light:border-gray-200/50 pt-2 sm:pt-0 sm:border-0">
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
