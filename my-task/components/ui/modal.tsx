'use client'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative z-10 w-full max-h-[90vh] flex flex-col rounded-xl bg-gray-800 light:bg-white p-4 sm:p-6 shadow-xl mx-4 overflow-hidden',
          {
            'max-w-sm': size === 'sm',
            'max-w-md': size === 'md',
            'max-w-lg': size === 'lg',
            'max-w-2xl': size === 'xl',
          }
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-4 flex-shrink-0">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-white light:text-gray-900 break-words">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-400 light:text-gray-500">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto min-h-0 flex-1 -mx-4 sm:-mx-6 px-4 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  )
}
