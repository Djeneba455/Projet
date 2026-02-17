'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { TaskCard } from './task-card'
import { updateTaskStatus } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'

interface KanbanBoardProps {
  initialTasks: any[]
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState<any>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const todoTasks = tasks.filter((t) => t.status === 'TODO')
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS')
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED')

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    setActiveTask(task)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (!activeTask) return

    // If over is a column
    const columns = ['TODO', 'IN_PROGRESS', 'COMPLETED']
    if (columns.includes(overId as string)) {
      setTasks((tasks) => {
        return tasks.map((t) =>
          t.id === activeId ? { ...t, status: overId } : t
        )
      })
      return
    }

    // If over is another task
    if (overTask && activeTask.status !== overTask.status) {
      setTasks((tasks) => {
        return tasks.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      })
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    const columns = ['TODO', 'IN_PROGRESS', 'COMPLETED']
    let newStatus = activeTask.status

    // Check if dropped on a column
    if (columns.includes(overId as string)) {
      newStatus = overId as 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
    } else {
      // Dropped on a task
      const overTask = tasks.find((t) => t.id === overId)
      if (overTask) {
        newStatus = overTask.status
      }
    }

    // Update status on server
    if (newStatus !== activeTask.status) {
      await updateTaskStatus(activeTask.id, newStatus)
      router.refresh()
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="min-w-[280px] sm:min-w-[320px] snap-start">
          <KanbanColumn status="TODO" tasks={todoTasks} title="À faire" />
        </div>
        <div className="min-w-[280px] sm:min-w-[320px] snap-start">
          <KanbanColumn status="IN_PROGRESS" tasks={inProgressTasks} title="En cours" />
        </div>
        <div className="min-w-[280px] sm:min-w-[320px] snap-start">
          <KanbanColumn status="COMPLETED" tasks={completedTasks} title="Terminé" />
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
