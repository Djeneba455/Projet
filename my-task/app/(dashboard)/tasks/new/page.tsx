import { getCategories } from '@/app/actions/categories'
import { getStudents } from '@/app/actions/users'
import { auth } from '@/lib/auth'
import { TaskForm } from '@/components/task/task-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NewTaskPage() {
  const session = await auth()
  const categoriesResult = await getCategories()
  
  let studentsResult = null
  if (session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN') {
    studentsResult = await getStudents()
  }

  const categories = categoriesResult.categories || []
  const students = studentsResult?.students || []

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/tasks"
          className="inline-flex items-center text-sm text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux tâches
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-gray-900">
          Nouvelle tâche
        </h1>
      </div>

      {/* Form */}
      <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-4 sm:p-6">
        <TaskForm categories={categories} students={students} />
      </div>
    </div>
  )
}
