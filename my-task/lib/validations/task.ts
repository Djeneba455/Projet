import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
})

export const updateTaskSchema = taskSchema.extend({
  id: z.string(),
})

export type TaskInput = z.infer<typeof taskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
