'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import { formatDate, getPriorityColor, getPriorityLabel } from '@/lib/utils'
import { Calendar, User, GripVertical } from 'lucide-react'
import Link from 'next/link'

interface TaskCardProps {
  task: any
  isDragging?: boolean
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <Link
        href={`/tasks/${task.id}`}
        className="block bg-gray-800 light:bg-white rounded-lg p-4 shadow-sm border border-gray-700 light:border-gray-200 hover:shadow-md transition-shadow"
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 light:hover:text-gray-600"
        >
          <GripVertical size={20} />
        </div>

        {/* Priority Badge */}
        <div className="mb-2">
          <Badge className={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white light:text-gray-900 mb-2 pr-6">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-400 light:text-gray-600 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        {/* Category */}
        {task.category && (
          <div className="mb-3">
            <span
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border light:border-opacity-30"
              style={{
                backgroundColor: task.category.color + '20',
                color: task.category.color,
                borderColor: task.category.color + '40',
              }}
            >
              {task.category.name}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 light:text-gray-500 pt-3 border-t border-gray-700 light:border-gray-100">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{task.assignee.name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
