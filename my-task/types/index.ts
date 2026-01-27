import { Prisma } from '@prisma/client'

// Task with relations
export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    creator: true
    assignee: true
    category: true
  }
}>

// User with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    createdTasks: true
    assignedTasks: true
  }
}>

// Notification type
export type NotificationWithUser = Prisma.NotificationGetPayload<{
  include: {
    user: true
  }
}>

// Filter types
export type TaskFilter = {
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  categoryId?: string
  assigneeId?: string
  search?: string
}

// Form types
export type TaskFormData = {
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
  categoryId?: string
  assigneeId?: string
}

export type UserFormData = {
  name: string
  email: string
  password: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
}

export type CategoryFormData = {
  name: string
  color: string
  description?: string
}
