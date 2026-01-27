'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { taskSchema, updateTaskSchema } from '@/lib/validations/task'
import { createNotification } from './notifications'

export async function getTasks(filters?: {
  status?: string
  priority?: string
  categoryId?: string
  assigneeId?: string
  search?: string
}) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const where: any = {}

    // Students see only their assigned tasks or their own tasks
    if (session.user.role === 'STUDENT') {
      where.OR = [
        { assigneeId: session.user.id },
        { creatorId: session.user.id },
      ]
    }
    // Teachers see all tasks they created or are involved in
    else if (session.user.role === 'TEACHER') {
      where.OR = [
        { creatorId: session.user.id },
        { assigneeId: session.user.id },
      ]
    }
    // Admins see everything (no filter)

    // Apply additional filters
    if (filters?.status) {
      where.status = filters.status
    }
    if (filters?.priority) {
      where.priority = filters.priority
    }
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }
    if (filters?.assigneeId) {
      where.assigneeId = filters.assigneeId
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: true,
      },
      orderBy: [
        { status: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' },
      ],
    })

    return { tasks }
  } catch (error) {
    console.error('Get tasks error:', error)
    return { error: 'Erreur lors du chargement des tâches' }
  }
}

export async function getTaskById(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        creator: true,
        assignee: true,
        category: true,
      },
    })

    if (!task) {
      return { error: 'Tâche introuvable' }
    }

    // Check permissions
    const canView =
      session.user.role === 'ADMIN' ||
      task.creatorId === session.user.id ||
      task.assigneeId === session.user.id

    if (!canView) {
      return { error: 'Accès non autorisé' }
    }

    return { task }
  } catch (error) {
    console.error('Get task error:', error)
    return { error: 'Erreur lors du chargement de la tâche' }
  }
}

export async function createTask(data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const formData = {
      title: data.get('title') as string,
      description: data.get('description') as string || undefined,
      status: (data.get('status') as string) || 'TODO',
      priority: (data.get('priority') as string) || 'MEDIUM',
      dueDate: data.get('dueDate') as string || null,
      categoryId: data.get('categoryId') as string || null,
      assigneeId: data.get('assigneeId') as string || null,
    }

    const validatedData = taskSchema.parse(formData)

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        creatorId: session.user.id,
        assigneeId: validatedData.assigneeId,
        categoryId: validatedData.categoryId,
      },
      include: {
        assignee: true,
        category: true,
      },
    })

    // Create notification for assignee if different from creator
    if (task.assigneeId && task.assigneeId !== session.user.id) {
      await createNotification({
        userId: task.assigneeId,
        title: 'Nouvelle tâche assignée',
        message: `${session.user.name} vous a assigné la tâche: ${task.title}`,
        type: 'info',
      })
    }

    revalidatePath('/dashboard')
    revalidatePath('/tasks')

    return { success: true, task }
  } catch (error) {
    console.error('Create task error:', error)
    return { error: 'Erreur lors de la création de la tâche' }
  }
}

export async function updateTask(id: string, data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return { error: 'Tâche introuvable' }
    }

    // Check permissions
    const canEdit =
      session.user.role === 'ADMIN' ||
      session.user.role === 'TEACHER' ||
      existingTask.creatorId === session.user.id

    if (!canEdit) {
      return { error: 'Vous n\'avez pas la permission de modifier cette tâche' }
    }

    const formData = {
      id,
      title: data.get('title') as string,
      description: data.get('description') as string || undefined,
      status: (data.get('status') as string) || 'TODO',
      priority: (data.get('priority') as string) || 'MEDIUM',
      dueDate: data.get('dueDate') as string || null,
      categoryId: data.get('categoryId') as string || null,
      assigneeId: data.get('assigneeId') as string || null,
    }

    const validatedData = updateTaskSchema.parse(formData)

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        assigneeId: validatedData.assigneeId,
        categoryId: validatedData.categoryId,
        completedAt: validatedData.status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        assignee: true,
        creator: true,
        category: true,
      },
    })

    // Notify assignee if task was completed
    if (task.status === 'COMPLETED' && task.creatorId !== session.user.id && task.creatorId) {
      await createNotification({
        userId: task.creatorId,
        title: 'Tâche complétée',
        message: `${session.user.name} a complété la tâche: ${task.title}`,
        type: 'success',
      })
    }

    revalidatePath('/dashboard')
    revalidatePath('/tasks')
    revalidatePath(`/tasks/${id}`)

    return { success: true, task }
  } catch (error) {
    console.error('Update task error:', error)
    return { error: 'Erreur lors de la mise à jour de la tâche' }
  }
}

export async function updateTaskStatus(id: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { creator: true },
    })

    if (!existingTask) {
      return { error: 'Tâche introuvable' }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        assignee: true,
        creator: true,
        category: true,
      },
    })

    // Notify creator if task was completed by assignee
    if (status === 'COMPLETED' && task.creatorId !== session.user.id) {
      await createNotification({
        userId: task.creatorId,
        title: 'Tâche complétée',
        message: `${session.user.name} a complété la tâche: ${task.title}`,
        type: 'success',
      })
    }

    revalidatePath('/dashboard')
    revalidatePath('/tasks')

    return { success: true, task }
  } catch (error) {
    console.error('Update task status error:', error)
    return { error: 'Erreur lors de la mise à jour du statut' }
  }
}

export async function deleteTask(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return { error: 'Tâche introuvable' }
    }

    // Only creator, teachers, and admins can delete
    const canDelete =
      session.user.role === 'ADMIN' ||
      session.user.role === 'TEACHER' ||
      task.creatorId === session.user.id

    if (!canDelete) {
      return { error: 'Vous n\'avez pas la permission de supprimer cette tâche' }
    }

    await prisma.task.delete({
      where: { id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/tasks')

    return { success: true }
  } catch (error) {
    console.error('Delete task error:', error)
    return { error: 'Erreur lors de la suppression de la tâche' }
  }
}
