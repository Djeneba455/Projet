'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun size={20} className="text-gray-400" />
      )}
    </button>
  )
}
