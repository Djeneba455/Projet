import { getTasks } from '@/app/actions/tasks'
import { getCategories } from '@/app/actions/categories'
import { getUsers } from '@/app/actions/users'
import { auth } from '@/lib/auth'
import { ReportGenerator } from '@/components/reports/report-generator'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const session = await auth()
  const tasksResult = await getTasks()
  const categoriesResult = await getCategories()

  let usersResult = null
  if (session?.user?.role === 'ADMIN') {
    usersResult = await getUsers()
  }

  const tasks = tasksResult.tasks || []
  const categories = categoriesResult.categories || []
  const users = usersResult?.users || []

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 min-w-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-gray-900">
          Rapports
        </h1>
        <p className="text-sm sm:text-base text-gray-400 light:text-gray-600 mt-1">
          Exportez des rapports PDF de vos données
        </p>
      </div>

      {/* Report Generator */}
      <ReportGenerator
        tasks={tasks}
        categories={categories}
        users={users}
        userRole={session?.user?.role || 'STUDENT'}
      />
    </div>
  )
}
