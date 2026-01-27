'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function createNotification(data: {
  userId: string
  title: string
  message: string
  type?: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
      },
    })

    revalidatePath('/dashboard')
    return { success: true, notification }
  } catch (error) {
    console.error('Create notification error:', error)
    return { error: 'Erreur lors de la création de la notification' }
  }
}

export async function getNotifications() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return { notifications }
  } catch (error) {
    console.error('Get notifications error:', error)
    return { error: 'Erreur lors du chargement des notifications' }
  }
}

export async function getUnreadNotificationsCount() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { count: 0 }
    }

    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    })

    return { count }
  } catch (error) {
    console.error('Get unread count error:', error)
    return { count: 0 }
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    await prisma.notification.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        read: true,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Mark as read error:', error)
    return { error: 'Erreur lors de la mise à jour' }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Mark all as read error:', error)
    return { error: 'Erreur lors de la mise à jour' }
  }
}

export async function deleteNotification(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Non authentifié' }
    }

    await prisma.notification.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Delete notification error:', error)
    return { error: 'Erreur lors de la suppression' }
  }
}
