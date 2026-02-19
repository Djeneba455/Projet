'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClasse, updateClasse, deleteClasse } from '@/app/actions/classes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Trash2, Edit, Plus, Users } from 'lucide-react'

interface ClasseManagementProps {
  classes: any[]
}

export function ClasseManagement({ classes }: ClasseManagementProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClasse, setEditingClasse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = editingClasse
      ? await updateClasse(editingClasse.id, formData)
      : await createClasse(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsModalOpen(false)
      setEditingClasse(null)
      router.refresh()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      return
    }

    const result = await deleteClasse(id)
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  function openCreateModal() {
    setEditingClasse(null)
    setError('')
    setIsModalOpen(true)
  }

  function openEditModal(classe: any) {
    setEditingClasse(classe)
    setError('')
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white light:text-gray-900">
          Gestion des Classes
        </h2>
        <Button onClick={openCreateModal}>
          <Plus size={18} className="mr-2" />
          Nouvelle classe
        </Button>
      </div>

      {classes.length === 0 ? (
        <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-8 text-center">
          <p className="text-gray-400 light:text-gray-500">
            Aucune classe créée pour le moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classe) => (
            <div
              key={classe.id}
              className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white light:text-gray-900">
                    {classe.name}
                  </h3>
                  {classe.description && (
                    <p className="text-sm text-gray-400 light:text-gray-600 mt-1">
                      {classe.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 light:text-gray-500 mb-4">
                <Users size={16} />
                <span>
                  {classe._count.students} étudiant{classe._count.students !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(classe)}
                  className="flex-1"
                >
                  <Edit size={16} className="mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(classe.id)}
                  className="text-red-400 light:text-red-600 light:hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingClasse(null)
          setError('')
        }}
        title={editingClasse ? 'Modifier la classe' : 'Nouvelle classe'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 light:bg-red-50 light:border-red-200 rounded-lg text-sm text-red-400 light:text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
            >
              Nom de la classe <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={editingClasse?.name}
              placeholder="Ex: 6ème A, Terminal S, Licence 1..."
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
            >
              Description (optionnel)
            </label>
            <Textarea
              id="description"
              name="description"
              defaultValue={editingClasse?.description}
              placeholder="Description de la classe..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Enregistrement...' : editingClasse ? 'Mettre à jour' : 'Créer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingClasse(null)
                setError('')
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
