'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 min-w-[300px] rounded-lg p-4 shadow-lg transition-all duration-300',
        {
          'translate-y-0 opacity-100': isVisible,
          'translate-y-2 opacity-0': !isVisible,
          'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800':
            type === 'success',
          'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800':
            type === 'error',
          'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800':
            type === 'warning',
          'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800':
            type === 'info',
        }
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
