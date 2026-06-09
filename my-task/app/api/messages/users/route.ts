import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const currentUserId = session.user.id
    const currentUserRole = session.user.role

    // Récupérer les détails de l'utilisateur actuel pour son classeId
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { classeId: true }
    })

    let users: any[] = []

    if (currentUserRole === 'ADMIN' || currentUserRole === 'TEACHER') {
      // Les enseignants et admins peuvent envoyer des messages à n'importe qui (sauf eux-mêmes)
      users = await prisma.user.findMany({
        where: {
          id: { not: currentUserId }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          classe: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    } else if (currentUserRole === 'STUDENT') {
      // Les étudiants peuvent envoyer des messages aux enseignants, aux admins, et aux étudiants de leur classe
      users = await prisma.user.findMany({
        where: {
          id: { not: currentUserId },
          OR: [
            { role: 'TEACHER' },
            { role: 'ADMIN' },
            {
              AND: [
                { role: 'STUDENT' },
                { classeId: currentUser?.classeId || 'non-existent-class-id' }
              ]
            }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          classe: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching chat users:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de la récupération des contacts' }, { status: 500 })
  }
}
