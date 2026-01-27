import { getTasks } from '@/app/actions/tasks'
import { CalendarView } from '@/components/calendar/calendar-view'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const tasksResult = await getTasks()
  const tasks = tasksResult.tasks || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendrier
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vue d'ensemble de vos tâches avec échéances
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>
            <Plus size={18} className="mr-2" />
            Nouvelle tâche
          </Button>
        </Link>
      </div>

      {/* Calendar */}
      <CalendarView tasks={tasks} />

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Légende
        </h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-gray-600 dark:text-gray-400">Urgente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-gray-600 dark:text-gray-400">Haute priorité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }} />
            <span className="text-gray-600 dark:text-gray-400">Moyenne/Basse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }} />
            <span className="text-gray-600 dark:text-gray-400">Terminée</span>
          </div>
        </div>
      </div>
    </div>
  )
}
