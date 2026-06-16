'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { registerAction } from '@/app/actions/auth'
import { getClasses } from '@/app/actions/classes'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatchError, setPasswordMatchError] = useState<string>('')

  useEffect(() => {
    async function loadClasses() {
      const result = await getClasses()
      if (result.classes) {
        setClasses(result.classes)
      }
    }
    loadClasses()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPasswordMatchError('')
    setIsLoading(true)

    const form = e.currentTarget
    const password = (form.querySelector('[name="password"]') as HTMLInputElement)?.value
    const confirmPassword = (form.querySelector('[name="confirmPassword"]') as HTMLInputElement)?.value

    if (password !== confirmPassword) {
      setPasswordMatchError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    const formData = new FormData(form)
    const result = await registerAction(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 light:from-blue-50 light:to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 light:bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white light:text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-gray-400 light:text-gray-600">
              Rejoignez notre plateforme de gestion de tâches
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 light:bg-red-50 border border-red-800 light:border-red-200 rounded-lg">
              <p className="text-sm text-red-400 light:text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2"
              >
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full px-4 py-3 border border-gray-600 light:border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 light:bg-white text-white light:text-gray-900 transition"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-600 light:border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 light:bg-white text-white light:text-gray-900 transition"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 border border-gray-600 light:border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 light:bg-white text-white light:text-gray-900 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-gray-300 light:hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400 light:text-gray-500">
                Minimum 6 caractères
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 light:bg-white text-white light:text-gray-900 transition ${
                    passwordMatchError
                      ? 'border-red-500 light:border-red-400'
                      : 'border-gray-600 light:border-gray-300'
                  }`}
                  placeholder="••••••••"
                  onBlur={(e) => {
                    const pwd = (e.target.form?.querySelector('[name="password"]') as HTMLInputElement)?.value
                    setPasswordMatchError(pwd && e.target.value && pwd !== e.target.value ? 'Les mots de passe ne correspondent pas' : '')
                  }}
                  onChange={() => setPasswordMatchError('')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-gray-300 light:hover:text-gray-600 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordMatchError && (
                <p className="mt-1 text-xs text-red-400 light:text-red-600">{passwordMatchError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telegram"
                className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2"
              >
                Nom d'utilisateur Telegram (ex: @username - optionnel)
              </label>
              <input
                id="telegram"
                name="telegram"
                type="text"
                className="w-full px-4 py-3 border border-gray-600 light:border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 light:bg-white text-white light:text-gray-900 transition"
                placeholder="@username"
              />
            </div>

            {classes.length > 0 && (
              <div>
                <label
                  htmlFor="classeId"
                  className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2"
                >
                  Classe (optionnel)
                </label>
                <select
                  id="classeId"
                  name="classeId"
                  className="w-full px-4 py-3 border border-gray-600 light:border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 light:bg-white text-white light:text-gray-900 transition"
                >
                  <option value="">Aucune classe</option>
                  {classes.map((classe) => (
                    <option key={classe.id} value={classe.id}>
                      {classe.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 light:text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/login"
                className="text-blue-400 light:text-blue-600 hover:text-blue-300 light:hover:text-blue-700 font-semibold"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
