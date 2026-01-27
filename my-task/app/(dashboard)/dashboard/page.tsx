import { auth } from '@/lib/auth'
import { getTasks } from '@/app/actions/tasks'
import { getCategories } from '@/app/actions/categories'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDate, getPriorityColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  const tasksResult = await getTasks()
  const categoriesResult = await getCategories()

  const tasks = tasksResult.tasks || []
  const categories = categoriesResult.categories || []

  // Statistics
  const todoCount = tasks.filter((t) => t.status === 'TODO').length
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length
  const urgentCount = tasks.filter((t) => t.priority === 'URGENT' && t.status !== 'COMPLETED').length

  // Upcoming tasks (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingTasks = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) >= today &&
      new Date(t.dueDate) <= nextWeek &&
      t.status !== 'COMPLETED'
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bienvenue, {session?.user?.name}
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>
            <Plus size={18} className="mr-2" />
            Nouvelle tâche
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="À faire"
          value={todoCount}
          icon={<Clock size={24} />}
          color="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        />
        <StatCard
          title="En cours"
          value={inProgressCount}
          icon={<TrendingUp size={24} />}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Terminées"
          value={completedCount}
          icon={<CheckCircle size={24} />}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Urgentes"
          value={urgentCount}
          icon={<AlertCircle size={24} />}
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tâches à venir (7 prochains jours)
          </h2>
        </div>
        <div className="p-6">
          {upcomingTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Aucune tâche à venir
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.category && (
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: task.category.color + '20',
                              color: task.category.color,
                            }}
                          >
                            {task.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(task.dueDate)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Overview */}
      {categories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Catégories
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-3 rounded-lg border"
                  style={{
                    backgroundColor: category.color + '10',
                    borderColor: category.color + '40',
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <p
                    className="font-medium text-sm"
                    style={{ color: category.color }}
                  >
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {category._count?.tasks || 0} tâches
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  )
}
