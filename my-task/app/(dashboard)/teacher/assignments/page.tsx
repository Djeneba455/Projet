import { getStudents } from '@/app/actions/users'
import { getCategories } from '@/app/actions/categories'
import { TaskForm } from '@/components/task/task-form'
import { requireAuth } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export default async function TeacherAssignmentsPage() {
  // Protect this page - only TEACHER and ADMIN can access
  await requireAuth(['TEACHER', 'ADMIN'])
  
  const studentsResult = await getStudents()
  const categoriesResult = await getCategories()

  const students = studentsResult.students || []
  const categories = categoriesResult.categories || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-gray-900">
          Attribuer des tâches
        </h1>
        <p className="text-sm sm:text-base text-gray-400 light:text-gray-600 mt-1">
          Créez et assignez des tâches à vos étudiants
        </p>
      </div>

      {/* Quick Assignment Form */}
      <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white light:text-gray-900 mb-4">
          Nouvelle attribution
        </h2>
        <TaskForm categories={categories} students={students} />
      </div>

      {/* Students List */}
      <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200">
        <div className="p-6 border-b border-gray-700 light:border-gray-200">
          <h2 className="text-lg font-semibold text-white light:text-gray-900">
            Mes étudiants
          </h2>
        </div>
        <div className="p-6">
          {students.length === 0 ? (
            <p className="text-center text-gray-400 light:text-gray-500 py-8">
              Aucun étudiant enregistré
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-gray-700/50 light:bg-gray-50 rounded-lg"
                >
                  <h3 className="font-medium text-white light:text-gray-900">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-400 light:text-gray-500">
                    {student.email}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
