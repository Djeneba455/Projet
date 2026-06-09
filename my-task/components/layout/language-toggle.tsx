'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, Check } from 'lucide-react'

const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'ar', label: 'العربية (Arabe)' },
  { code: 'bm', label: 'Bamanankan (Bambara)' }
]

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('fr')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Détecter la langue actuelle depuis le cookie googtrans
    const getLangFromCookie = () => {
      const match = document.cookie.match(/googtrans=\/fr\/([^;]+)/)
      if (match && match[1]) {
        return match[1]
      }
      return 'fr'
    }
    setCurrentLang(getLangFromCookie())

    // Fermer le dropdown lors d'un clic en dehors
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Injecter le script Google Translate de manière dynamique au chargement
  useEffect(() => {
    if ((window as any).googleTranslateElementInit) return

    // Créer la fonction globale d'initialisation de Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'fr',
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    // Créer le conteneur masqué requis par Google Translate
    let translateDiv = document.getElementById('google_translate_element')
    if (!translateDiv) {
      translateDiv = document.createElement('div')
      translateDiv.id = 'google_translate_element'
      translateDiv.style.display = 'none'
      document.body.appendChild(translateDiv)
    }

    // Ajouter le script Google Translate
    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    const hostname = window.location.hostname
    
    // Nettoyer les cookies de traduction existants pour éviter les conflits
    const cookieStringClean = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = cookieStringClean
    document.cookie = `${cookieStringClean} domain=.${hostname}`
    document.cookie = `${cookieStringClean} domain=${hostname}`

    if (langCode !== 'fr') {
      // Écrire le cookie googtrans pour demander la traduction en langCode
      const val = `/fr/${langCode}`
      document.cookie = `googtrans=${val}; path=/;`
      document.cookie = `googtrans=${val}; path=/; domain=.${hostname}`
      document.cookie = `googtrans=${val}; path=/; domain=${hostname}`
    }

    setCurrentLang(langCode)
    setIsOpen(false)
    window.location.reload()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-gray-700 light:hover:bg-gray-100 transition-colors text-gray-300 light:text-gray-700"
        aria-label="Changer de langue"
        type="button"
      >
        <Globe size={20} className="text-gray-400 light:text-gray-600" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {currentLang}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-gray-800 light:bg-white border border-gray-700 light:border-gray-200 rounded-lg shadow-lg py-1 z-50">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-gray-700/50 light:hover:bg-gray-100 ${
                  isSelected 
                    ? 'text-blue-400 light:text-blue-600 font-bold' 
                    : 'text-gray-300 light:text-gray-700'
                }`}
                type="button"
              >
                <span>{lang.label}</span>
                {isSelected && <Check size={12} className="stroke-[3] text-blue-400 light:text-blue-600" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
