import { z } from 'zod'

export const classeSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
})

export const updateClasseSchema = classeSchema.extend({
  id: z.string(),
})

export type ClasseInput = z.infer<typeof classeSchema>
export type UpdateClasseInput = z.infer<typeof updateClasseSchema>
