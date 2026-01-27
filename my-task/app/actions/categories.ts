'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { categorySchema, updateCategorySchema } from '@/lib/validations/category'

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    })

    return { categories }
  } catch (error) {
    console.error('Get categories error:', error)
    return { error: 'Erreur lors du chargement des catégories' }
  }
}

export async function createCategory(data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only teachers and admins can create categories
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    const formData = {
      name: data.get('name') as string,
      color: data.get('color') as string,
      description: data.get('description') as string || undefined,
    }

    const validatedData = categorySchema.parse(formData)

    const category = await prisma.category.create({
      data: validatedData,
    })

    revalidatePath('/admin/categories')
    return { success: true, category }
  } catch (error) {
    console.error('Create category error:', error)
    return { error: 'Erreur lors de la création de la catégorie' }
  }
}

export async function updateCategory(id: string, data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only teachers and admins can update categories
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    const formData = {
      id,
      name: data.get('name') as string,
      color: data.get('color') as string,
      description: data.get('description') as string || undefined,
    }

    const validatedData = updateCategorySchema.parse(formData)

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        color: validatedData.color,
        description: validatedData.description,
      },
    })

    revalidatePath('/admin/categories')
    return { success: true, category }
  } catch (error) {
    console.error('Update category error:', error)
    return { error: 'Erreur lors de la mise à jour de la catégorie' }
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only admins can delete categories
    if (session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Delete category error:', error)
    return { error: 'Erreur lors de la suppression de la catégorie' }
  }
}
