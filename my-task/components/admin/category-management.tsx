'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus } from 'lucide-react'

interface CategoryManagementProps {
  categories: any[]
}

export function CategoryManagement({ categories }: CategoryManagementProps) {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = editingCategory
      ? await updateCategory(editingCategory.id, formData)
      : await createCategory(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsCreateModalOpen(false)
      setEditingCategory(null)
      router.refresh()
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      await deleteCategory(id)
      router.refresh()
    }
  }

  return (
    <>
      {/* Create Button */}
      <div className="mb-4">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCategory(category)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: category.color }}
            >
              {category.name}
            </h3>
            
            {category.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {category.description}
              </p>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {category._count?.tasks || 0} tâche{category._count?.tasks !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!editingCategory}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingCategory(null)
          setError('')
        }}
        title={editingCategory ? 'Modifier la catégorie' : 'Créer une catégorie'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              required
              defaultValue={editingCategory?.name}
              placeholder="Ex: Mathématiques"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Couleur <span className="text-red-500">*</span>
            </label>
            <Input
              name="color"
              type="color"
              required
              defaultValue={editingCategory?.color || '#3B82F6'}
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Textarea
              name="description"
              defaultValue={editingCategory?.description}
              placeholder="Description de la catégorie..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Enregistrement...' : editingCategory ? 'Mettre à jour' : 'Créer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setEditingCategory(null)
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
