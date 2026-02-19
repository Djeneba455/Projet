'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { getUnreadNotificationsCount } from '@/app/actions/notifications'
import Link from 'next/link'

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      const result = await getUnreadNotificationsCount()
      setUnreadCount(result.count)
    }

    fetchCount()
    const interval = setInterval(fetchCount, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Link
      href="/notifications"
      className="relative p-2 text-gray-400 hover:text-white light:text-gray-600 light:hover:text-gray-900 transition-colors"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
