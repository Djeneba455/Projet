'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { changePassword } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function PasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const result = await changePassword(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(result.message || 'Mot de passe modifié avec succès')
      setIsLoading(false)
      // Reset form
      e.currentTarget.reset()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Changer le mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            {success}
          </div>
        )}

        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Mot de passe actuel <span className="text-red-500">*</span>
          </label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nouveau mot de passe <span className="text-red-500">*</span>
          </label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum 6 caractères
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirmer le nouveau mot de passe <span className="text-red-500">*</span>
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Modification...' : 'Changer le mot de passe'}
          </Button>
        </div>
      </form>
    </div>
  )
}
