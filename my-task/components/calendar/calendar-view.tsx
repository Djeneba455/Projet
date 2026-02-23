'use client'

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { getPriorityColor, formatDate } from '@/lib/utils'

const locales = {
  fr: fr,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarViewProps {
  tasks: any[]
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const router = useRouter()
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const events = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate)
        .map((task) => ({
          id: task.id,
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          resource: task,
        })),
    [tasks]
  )

  const eventStyleGetter = (event: any) => {
    const task = event.resource
    let backgroundColor = '#3B82F6'

    if (task.status === 'COMPLETED') {
      backgroundColor = '#10B981'
    } else if (task.priority === 'URGENT') {
      backgroundColor = '#EF4444'
    } else if (task.priority === 'HIGH') {
      backgroundColor = '#F59E0B'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

  const handleSelectEvent = (event: any) => {
    setSelectedTask(event.resource)
  }

  const handleNavigateToTask = () => {
    if (selectedTask) {
      router.push(`/tasks/${selectedTask.id}`)
    }
  }

  return (
    <>
      <div className="bg-gray-800 light:bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-700 light:border-gray-200 calendar-container overflow-x-auto">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'min(600px, 70vh)', minHeight: 320 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: 'Suivant',
            previous: 'Précédent',
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            agenda: 'Agenda',
            date: 'Date',
            time: 'Heure',
            event: 'Événement',
            noEventsInRange: 'Aucune tâche dans cette période',
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultView={Views.MONTH}
        />
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title="Détails de la tâche"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white light:text-gray-900">
                {selectedTask.title}
              </h3>
              {selectedTask.description && (
                <p className="text-sm text-gray-400 light:text-gray-600 mt-2">
                  {selectedTask.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={getPriorityColor(selectedTask.priority)}>
                {selectedTask.priority}
              </Badge>
              <Badge
                variant={
                  selectedTask.status === 'COMPLETED'
                    ? 'success'
                    : selectedTask.status === 'IN_PROGRESS'
                    ? 'default'
                    : 'secondary'
                }
              >
                {selectedTask.status}
              </Badge>
              {selectedTask.category && (
                <span
                  className="text-xs px-2 py-1 rounded font-medium border light:border-opacity-30"
                  style={{
                    backgroundColor: selectedTask.category.color + '20',
                    color: selectedTask.category.color,
                    borderColor: selectedTask.category.color + '40',
                  }}
                >
                  {selectedTask.category.name}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 light:text-gray-600">Échéance:</span>
                <span className="font-medium text-white light:text-gray-900">
                  {formatDate(selectedTask.dueDate)}
                </span>
              </div>
              {selectedTask.assignee && (
                <div className="flex justify-between">
                  <span className="text-gray-400 light:text-gray-600">Assigné à:</span>
                  <span className="font-medium text-white light:text-gray-900">
                    {selectedTask.assignee.name}
                  </span>
                </div>
              )}
              {selectedTask.creator && (
                <div className="flex justify-between">
                  <span className="text-gray-400 light:text-gray-600">Créé par:</span>
                  <span className="font-medium text-white light:text-gray-900">
                    {selectedTask.creator.name}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handleNavigateToTask}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                Voir les détails complets
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx global>{`
        .calendar-container .rbc-calendar {
          font-family: inherit;
        }

        .calendar-container .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
          background-color: #f9fafb;
        }

        .dark .calendar-container .rbc-header {
          background-color: #1f2937;
          border-bottom-color: #374151;
          color: #f3f4f6;
        }

        .calendar-container .rbc-today {
          background-color: #dbeafe;
        }

        .dark .calendar-container .rbc-today {
          background-color: #1e3a8a;
        }

        .calendar-container .rbc-off-range {
          color: #9ca3af;
        }

        .calendar-container .rbc-event {
          padding: 2px 5px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .calendar-container .rbc-event:hover {
          opacity: 1 !important;
        }

        .calendar-container .rbc-toolbar button {
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 6px 12px;
          border-radius: 6px;
          background-color: white;
        }

        .dark .calendar-container .rbc-toolbar button {
          color: #f3f4f6;
          border-color: #4b5563;
          background-color: #374151;
        }

        .calendar-container .rbc-toolbar button:hover {
          background-color: #f3f4f6;
        }

        .dark .calendar-container .rbc-toolbar button:hover {
          background-color: #4b5563;
        }

        .calendar-container .rbc-toolbar button.rbc-active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .calendar-container .rbc-month-view,
        .calendar-container .rbc-time-view,
        .calendar-container .rbc-agenda-view {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .dark .calendar-container .rbc-month-view,
        .dark .calendar-container .rbc-time-view,
        .dark .calendar-container .rbc-agenda-view {
          border-color: #374151;
          background-color: #1f2937;
        }

        .dark .calendar-container .rbc-day-bg,
        .dark .calendar-container .rbc-time-slot {
          border-color: #374151;
        }

        .dark .calendar-container .rbc-date-cell {
          color: #f3f4f6;
        }
      `}</style>
    </>
  )
}
