import { getTaskById } from '@/app/actions/tasks'
import { getCategories } from '@/app/actions/categories'
import { getStudents } from '@/app/actions/users'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { TaskForm } from '@/components/task/task-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatDateTime, getPriorityColor, getStatusColor } from '@/lib/utils'
import { deleteTask } from '@/app/actions/tasks'

export const dynamic = 'force-dynamic'

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const taskResult = await getTaskById(params.id)

  if (taskResult.error || !taskResult.task) {
    notFound()
  }

  const task = taskResult.task
  const categoriesResult = await getCategories()
  
  let studentsResult = null
  if (session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN') {
    studentsResult = await getStudents()
  }

  const categories = categoriesResult.categories || []
  const students = studentsResult?.students || []

  const canEdit =
    session?.user?.role === 'ADMIN' ||
    session?.user?.role === 'TEACHER' ||
    task.creatorId === session?.user?.id

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 min-w-0">
      {/* Header */}
      <div>
        <Link
          href="/tasks"
          className="inline-flex items-center text-sm text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux tâches
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-gray-900">
            Détails de la tâche
          </h1>
        </div>
      </div>

      {/* Task Details */}
      <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-4 sm:p-6">
        <div className="space-y-6">
          {/* Title and Badges */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white light:text-gray-900 mb-3 break-words">
              {task.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status === 'TODO'
                  ? 'À faire'
                  : task.status === 'IN_PROGRESS'
                  ? 'En cours'
                  : 'Terminé'}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority === 'LOW'
                  ? 'Basse'
                  : task.priority === 'MEDIUM'
                  ? 'Moyenne'
                  : task.priority === 'HIGH'
                  ? 'Haute'
                  : 'Urgente'}
              </Badge>
              {task.category && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border light:border-opacity-30"
                  style={{
                    backgroundColor: task.category.color + '20',
                    color: task.category.color,
                    borderColor: task.category.color + '40',
                  }}
                >
                  {task.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 light:text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-400 light:text-gray-600 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700 light:border-gray-200">
            {task.dueDate && (
              <div>
                <p className="text-sm font-medium text-gray-400 light:text-gray-500">
                  Date d'échéance
                </p>
                <p className="text-white light:text-gray-900 mt-1">
                  {formatDateTime(task.dueDate)}
                </p>
              </div>
            )}
            {task.creator && (
              <div>
                <p className="text-sm font-medium text-gray-400 light:text-gray-500">
                  Créée par
                </p>
                <p className="text-white light:text-gray-900 mt-1">{task.creator.name}</p>
              </div>
            )}
            {task.assignee && (
              <div>
                <p className="text-sm font-medium text-gray-400 light:text-gray-500">
                  Assignée à
                </p>
                <p className="text-white light:text-gray-900 mt-1">{task.assignee.name}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-400 light:text-gray-500">
                Créée le
              </p>
              <p className="text-white light:text-gray-900 mt-1">
                {formatDateTime(task.createdAt)}
              </p>
            </div>
            {task.completedAt && (
              <div>
                <p className="text-sm font-medium text-gray-400 light:text-gray-500">
                  Complétée le
                </p>
                <p className="text-white light:text-gray-900 mt-1">
                  {formatDateTime(task.completedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form (only for authorized users) */}
      {canEdit && (
        <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-white light:text-gray-900 mb-4">
            Modifier la tâche
          </h3>
          <TaskForm task={task} categories={categories} students={students} />
        </div>
      )}
    </div>
  )
}
