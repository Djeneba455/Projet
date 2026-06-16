'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { profileSchema, passwordSchema } from '@/lib/validations/profile'
import { hash, compare } from 'bcryptjs'

export async function getCurrentUser() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        classeId: true,
        telegram: true,
        classe: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    })

    if (!user) {
      return { error: 'Utilisateur introuvable' }
    }

    return { user }
  } catch (error) {
    console.error('Get current user error:', error)
    return { error: 'Erreur lors du chargement du profil' }
  }
}

export async function updateProfile(data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const formData = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      classeId: (data.get('classeId') as string) || null,
      telegram: (data.get('telegram') as string) || null,
    }

    const validatedData = profileSchema.parse(formData)

    // Check if email is already used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        NOT: {
          id: session.user.id,
        },
      },
    })

    if (existingUser) {
      return { error: 'Cet email est déjà utilisé' }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        classeId: validatedData.classeId || undefined,
        telegram: validatedData.telegram,
      },
    })

    revalidatePath('/profile')
    return { success: true, message: 'Profil mis à jour avec succès' }
  } catch (error) {
    console.error('Update profile error:', error)
    return { error: 'Erreur lors de la mise à jour du profil' }
  }
}

export async function changePassword(data: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const formData = {
      currentPassword: data.get('currentPassword') as string,
      newPassword: data.get('newPassword') as string,
      confirmPassword: data.get('confirmPassword') as string,
    }

    const validatedData = passwordSchema.parse(formData)

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
      },
    })

    if (!user) {
      return { error: 'Utilisateur introuvable' }
    }

    // Verify current password
    const isPasswordValid = await compare(validatedData.currentPassword, user.password)

    if (!isPasswordValid) {
      return { error: 'Mot de passe actuel incorrect' }
    }

    // Hash new password
    const hashedPassword = await hash(validatedData.newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    })

    revalidatePath('/profile')
    return { success: true, message: 'Mot de passe modifié avec succès' }
  } catch (error) {
    console.error('Change password error:', error)
    return { error: 'Erreur lors du changement de mot de passe' }
  }
}
