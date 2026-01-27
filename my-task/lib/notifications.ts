import { prisma } from './prisma'
import { createNotification } from '@/app/actions/notifications'

/**
 * Check for tasks due soon (within 24 hours) and send notifications
 * This should be called by a cron job or scheduled task
 */
export async function checkUpcomingDeadlines() {
  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Find tasks due in the next 24 hours that are not completed
    const upcomingTasks = await prisma.task.findMany({
      where: {
        status: {
          not: 'COMPLETED',
        },
        dueDate: {
          gte: now,
          lte: tomorrow,
        },
      },
      include: {
        assignee: true,
        creator: true,
      },
    })

    // Check if notification already sent for this task
    for (const task of upcomingTasks) {
      if (!task.assigneeId) continue

      // Check if notification already exists
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: task.assigneeId,
          message: {
            contains: task.id,
          },
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      })

      if (!existingNotification) {
        // Create notification for assignee
        await createNotification({
          userId: task.assigneeId,
          title: 'Échéance proche',
          message: `La tâche "${task.title}" est due dans les prochaines 24 heures. (ID: ${task.id})`,
          type: 'warning',
        })
      }
    }

    return { success: true, count: upcomingTasks.length }
  } catch (error) {
    console.error('Error checking deadlines:', error)
    return { success: false, error: 'Failed to check deadlines' }
  }
}

/**
 * Check for overdue tasks and send notifications
 */
export async function checkOverdueTasks() {
  try {
    const now = new Date()

    // Find tasks that are overdue and not completed
    const overdueTasks = await prisma.task.findMany({
      where: {
        status: {
          not: 'COMPLETED',
        },
        dueDate: {
          lt: now,
        },
      },
      include: {
        assignee: true,
        creator: true,
      },
    })

    for (const task of overdueTasks) {
      if (!task.assigneeId) continue

      // Check if overdue notification already sent in last 24 hours
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: task.assigneeId,
          title: 'Tâche en retard',
          message: {
            contains: task.id,
          },
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
        },
      })

      if (!existingNotification) {
        await createNotification({
          userId: task.assigneeId,
          title: 'Tâche en retard',
          message: `La tâche "${task.title}" est en retard. (ID: ${task.id})`,
          type: 'error',
        })
      }
    }

    return { success: true, count: overdueTasks.length }
  } catch (error) {
    console.error('Error checking overdue tasks:', error)
    return { success: false, error: 'Failed to check overdue tasks' }
  }
}

/**
 * Send weekly summary notifications
 */
export async function sendWeeklySummary() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['STUDENT', 'TEACHER'],
        },
      },
      include: {
        assignedTasks: {
          where: {
            status: {
              not: 'COMPLETED',
            },
          },
        },
        createdTasks: {
          where: {
            status: {
              not: 'COMPLETED',
            },
          },
        },
      },
    })

    for (const user of users) {
      const pendingCount =
        user.role === 'STUDENT'
          ? user.assignedTasks.length
          : user.createdTasks.length

      if (pendingCount > 0) {
        await createNotification({
          userId: user.id,
          title: 'Résumé hebdomadaire',
          message: `Vous avez ${pendingCount} tâche${
            pendingCount > 1 ? 's' : ''
          } en attente.`,
          type: 'info',
        })
      }
    }

    return { success: true, count: users.length }
  } catch (error) {
    console.error('Error sending weekly summary:', error)
    return { success: false, error: 'Failed to send weekly summary' }
  }
}
