'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
      if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
        document.documentElement.classList.add('light')
      } else {
        document.documentElement.removeAttribute('data-theme')
        document.documentElement.classList.remove('light')
      }
    } else {
      // Mode sombre par défaut (pas de préférence système)
      setTheme('dark')
      document.documentElement.removeAttribute('data-theme')
      document.documentElement.classList.remove('light')
    }
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', newTheme)
      
      // Update DOM attributes
      if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
        document.documentElement.classList.add('light')
      } else {
        document.documentElement.removeAttribute('data-theme')
        document.documentElement.classList.remove('light')
      }
      
      return newTheme
    })
  }

  // Always provide the context, even before mount
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
