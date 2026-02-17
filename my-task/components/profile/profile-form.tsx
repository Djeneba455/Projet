'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface ProfileFormProps {
  user: any
  classes: any[]
}

export function ProfileForm({ user, classes }: ProfileFormProps) {
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
    const result = await updateProfile(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(result.message || 'Profil mis à jour avec succès')
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Informations personnelles
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nom complet <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={user.name}
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={user.email}
            placeholder="votre@email.com"
          />
        </div>

        {user.role === 'STUDENT' && classes.length > 0 && (
          <div>
            <label
              htmlFor="classeId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Classe
            </label>
            <Select id="classeId" name="classeId" defaultValue={user.classeId || ''}>
              <option value="">Aucune classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Mettre à jour le profil'}
          </Button>
        </div>
      </form>
    </div>
  )
}
