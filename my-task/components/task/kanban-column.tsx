'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './task-card'
import { getStatusLabel } from '@/lib/utils'

interface KanbanColumnProps {
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  tasks: any[]
  title: string
}

export function KanbanColumn({ status, tasks, title }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const colorClasses = {
    TODO: 'bg-gray-800 light:bg-gray-100 border-gray-700 light:border-gray-300',
    IN_PROGRESS: 'bg-blue-900/20 light:bg-blue-50 border-blue-800 light:border-blue-300',
    COMPLETED: 'bg-green-900/20 light:bg-green-50 border-green-800 light:border-green-300',
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className={`${colorClasses[status]} rounded-t-lg px-4 py-3 border-b-2`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white light:text-gray-900">
            {title}
          </h3>
          <span className="text-sm text-gray-400 light:text-gray-600 font-medium bg-gray-700 light:bg-white px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 sm:p-3 space-y-2 sm:space-y-3 rounded-b-lg border-x border-b ${colorClasses[status]} min-h-[400px] sm:min-h-[500px] transition-colors ${
          isOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 light:text-gray-400">
              <p className="text-sm">Aucune tâche</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>
      </div>
    </div>
  )
}
