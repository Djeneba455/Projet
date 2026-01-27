import { getStudents } from '@/app/actions/users'
import { getCategories } from '@/app/actions/categories'
import { TaskForm } from '@/components/task/task-form'

export const dynamic = 'force-dynamic'

export default async function TeacherAssignmentsPage() {
  const studentsResult = await getStudents()
  const categoriesResult = await getCategories()

  const students = studentsResult.students || []
  const categories = categoriesResult.categories || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Attribuer des tâches
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Créez et assignez des tâches à vos étudiants
        </p>
      </div>

      {/* Quick Assignment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nouvelle attribution
        </h2>
        <TaskForm categories={categories} students={students} />
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mes étudiants
          </h2>
        </div>
        <div className="p-6">
          {students.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Aucun étudiant enregistré
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
