import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-blue-900/30 text-blue-400 light:bg-blue-100 light:text-blue-800':
            variant === 'default',
          'bg-gray-700 text-gray-400 light:bg-gray-100 light:text-gray-800':
            variant === 'secondary',
          'bg-green-900/30 text-green-400 light:bg-green-100 light:text-green-800':
            variant === 'success',
          'bg-yellow-900/30 text-yellow-400 light:bg-yellow-100 light:text-yellow-800':
            variant === 'warning',
          'bg-red-900/30 text-red-400 light:bg-red-100 light:text-red-800':
            variant === 'error',
        },
        className
      )}
      {...props}
    />
  )
}
