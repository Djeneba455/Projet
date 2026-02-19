'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-gray-700 light:hover:bg-gray-100 transition-colors"
        aria-label="Changer le thème"
        disabled
      >
        <Sun size={20} className="text-gray-400 light:text-gray-600" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-700 light:hover:bg-gray-100 transition-colors"
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      type="button"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400 light:text-yellow-500" />
      ) : (
        <Moon size={20} className="text-gray-400 light:text-gray-600" />
      )}
    </button>
  )
}
