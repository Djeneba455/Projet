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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-gray-900">
            Calendrier
          </h1>
          <p className="text-sm sm:text-base text-gray-400 light:text-gray-600 mt-1">
            Vue d'ensemble de vos tâches avec échéances
          </p>
        </div>
        <Link href="/tasks/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" />
            <span className="hidden xs:inline">Nouvelle tâche</span>
            <span className="xs:hidden">Nouvelle</span>
          </Button>
        </Link>
      </div>

      {/* Calendar */}
      <CalendarView tasks={tasks} />

      {/* Legend */}
      <div className="bg-gray-800 light:bg-white rounded-lg shadow-sm border border-gray-700 light:border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-white light:text-gray-900 mb-3">
          Légende
        </h3>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-gray-400 light:text-gray-600">Urgente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-gray-400 light:text-gray-600">Haute priorité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: '#3B82F6' }} />
            <span className="text-gray-400 light:text-gray-600">Moyenne/Basse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: '#10B981' }} />
            <span className="text-gray-400 light:text-gray-600">Terminée</span>
          </div>
        </div>
      </div>
    </div>
  )
}
