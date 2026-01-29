import { getCategories } from '@/app/actions/categories'
import { CategoryManagement } from '@/components/admin/category-management'
import { requireAuth } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  // Protect this page - only ADMIN can access
  await requireAuth(['ADMIN'])
  
  const categoriesResult = await getCategories()
  const categories = categoriesResult.categories || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des catégories
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Category Management Component */}
      <CategoryManagement categories={categories} />
    </div>
  )
}
