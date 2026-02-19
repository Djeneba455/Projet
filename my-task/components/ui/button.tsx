import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-blue-600 text-white hover:bg-blue-700 light:bg-blue-600 light:hover:bg-blue-700':
              variant === 'default',
            'bg-red-600 text-white hover:bg-red-700 light:bg-red-600 light:hover:bg-red-700':
              variant === 'destructive',
            'border border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700 light:border-gray-300 light:bg-white light:text-gray-900 light:hover:bg-gray-50':
              variant === 'outline',
            'bg-gray-700 text-gray-100 hover:bg-gray-600 light:bg-gray-100 light:text-gray-900 light:hover:bg-gray-200':
              variant === 'secondary',
            'text-gray-100 hover:bg-gray-800 light:text-gray-900 light:hover:bg-gray-100': variant === 'ghost',
            'text-blue-400 underline-offset-4 hover:underline light:text-blue-600':
              variant === 'link',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
