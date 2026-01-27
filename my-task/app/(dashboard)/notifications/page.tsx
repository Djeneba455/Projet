import { getNotifications } from '@/app/actions/notifications'
import { NotificationsList } from '@/components/notifications/notifications-list'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const notificationsResult = await getNotifications()
  const notifications = notificationsResult.notifications || []

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          {unreadCount > 0 && ` · ${unreadCount} non lue${unreadCount !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Notifications List */}
      <NotificationsList notifications={notifications} />
    </div>
  )
}
