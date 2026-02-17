'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function getUsers() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only admins and teachers can see all users
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return { error: 'Accès non autorisé' }
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            createdTasks: true,
            assignedTasks: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return { users }
  } catch (error) {
    console.error('Get users error:', error)
    return { error: 'Erreur lors du chargement des utilisateurs' }
  }
}

export async function getStudents() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only teachers and admins can see students
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        classe: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { classe: { name: 'asc' } },
        { name: 'asc' },
      ],
    })

    return { students }
  } catch (error) {
    console.error('Get students error:', error)
    return { error: 'Erreur lors du chargement des étudiants' }
  }
}

export async function updateUserRole(userId: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN') {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only admins can update roles
    if (session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    // Cannot change own role
    if (userId === session.user.id) {
      return { error: 'Vous ne pouvez pas changer votre propre rôle' }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error) {
    console.error('Update user role error:', error)
    return { error: 'Erreur lors de la mise à jour du rôle' }
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only admins can delete users
    if (session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    // Cannot delete self
    if (userId === session.user.id) {
      return { error: 'Vous ne pouvez pas supprimer votre propre compte' }
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Delete user error:', error)
    return { error: 'Erreur lors de la suppression de l\'utilisateur' }
  }
}

export async function createUser(data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    // Only admins can create users
    if (session.user.role !== 'ADMIN') {
      return { error: 'Accès non autorisé' }
    }

    const name = data.get('name') as string
    const email = data.get('email') as string
    const password = data.get('password') as string
    const role = (data.get('role') as 'STUDENT' | 'TEACHER' | 'ADMIN') || 'STUDENT'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'Cet email est déjà utilisé' }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error) {
    console.error('Create user error:', error)
    return { error: 'Erreur lors de la création de l\'utilisateur' }
  }
}
