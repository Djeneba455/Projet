'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { classeSchema, updateClasseSchema } from '@/lib/validations/classe'

export async function getClasses() {
  try {
    const classes = await prisma.classe.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    return { classes }
  } catch (error) {
    console.error('Get classes error:', error)
    return { error: 'Erreur lors du chargement des classes' }
  }
}

export async function getClasseById(id: string) {
  try {
    const classe = await prisma.classe.findUnique({
      where: { id },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!classe) {
      return { error: 'Classe introuvable' }
    }

    return { classe }
  } catch (error) {
    console.error('Get classe error:', error)
    return { error: 'Erreur lors du chargement de la classe' }
  }
}

export async function createClasse(data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only teachers and admins can create classes
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    const formData = {
      name: data.get('name') as string,
      description: data.get('description') as string || undefined,
    }

    const validatedData = classeSchema.parse(formData)

    // Check if class name already exists
    const existingClasse = await prisma.classe.findUnique({
      where: { name: validatedData.name },
    })

    if (existingClasse) {
      return { error: 'Une classe avec ce nom existe déjà' }
    }

    const classe = await prisma.classe.create({
      data: validatedData,
    })

    revalidatePath('/admin/classes')
    revalidatePath('/register')
    return { success: true, classe }
  } catch (error) {
    console.error('Create classe error:', error)
    return { error: 'Erreur lors de la création de la classe' }
  }
}

export async function updateClasse(id: string, data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only teachers and admins can update classes
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    const formData = {
      id,
      name: data.get('name') as string,
      description: data.get('description') as string || undefined,
    }

    const validatedData = updateClasseSchema.parse(formData)

    const classe = await prisma.classe.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
    })

    revalidatePath('/admin/classes')
    revalidatePath('/register')
    return { success: true, classe }
  } catch (error) {
    console.error('Update classe error:', error)
    return { error: 'Erreur lors de la mise à jour de la classe' }
  }
}

export async function deleteClasse(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only admins can delete classes
    if (session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    await prisma.classe.delete({
      where: { id },
    })

    revalidatePath('/admin/classes')
    revalidatePath('/register')
    return { success: true }
  } catch (error) {
    console.error('Delete classe error:', error)
    return { error: 'Erreur lors de la suppression de la classe' }
  }
}
