import { getTasks } from '@/app/actions/tasks'
import { getCategories } from '@/app/actions/categories'
import { getStudents } from '@/app/actions/users'
import { auth } from '@/lib/auth'
import { KanbanBoard } from '@/components/task/kanban-board'
import { TaskFilters } from '@/components/task/task-filters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const session = await auth()
  const tasksResult = await getTasks(searchParams)
  const categoriesResult = await getCategories()
  
  let studentsResult = null
  if (session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN') {
    studentsResult = await getStudents()
  }

  const tasks = tasksResult.tasks || []
  const categories = categoriesResult.categories || []
  const students = studentsResult?.students || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mes tâches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {tasks.length} tâche{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>
            <Plus size={18} className="mr-2" />
            Nouvelle tâche
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <TaskFilters categories={categories} students={students} />

      {/* Kanban Board */}
      <KanbanBoard initialTasks={tasks} />
    </div>
  )
}
