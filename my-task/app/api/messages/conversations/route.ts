import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/messages/conversations - Liste les conversations de l'utilisateur
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const currentUserId = session.user.id

    // Récupère les conversations avec les participants et le dernier message
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: currentUserId }
        }
      },
      include: {
        participants: {
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
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            read: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Calculer le nombre de messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: currentUserId },
            read: false
          }
        })

        return {
          ...conv,
          unreadCount,
          lastMessage: conv.messages[0] || null
        }
      })
    )

    return NextResponse.json(conversationsWithUnread)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de la récupération des discussions' }, { status: 500 })
  }
}

// POST /api/messages/conversations - Crée une conversation (DM ou Groupe)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const currentUserId = session.user.id
    const currentUserRole = session.user.role
    const body = await req.json()
    const { isGroup, name, participantIds } = body

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json({ error: 'Destinataire(s) requis' }, { status: 400 })
    }

    // Cas 1: Message Direct (1-à-1)
    if (!isGroup) {
      const recipientId = participantIds[0]

      if (recipientId === currentUserId) {
        return NextResponse.json({ error: 'Vous ne pouvez pas démarrer une discussion avec vous-même' }, { status: 400 })
      }

      // Vérifier si une conversation existante existe entre ces deux personnes
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            { participants: { some: { id: currentUserId } } },
            { participants: { some: { id: recipientId } } }
          ]
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              classe: { select: { name: true } }
            }
          }
        }
      })

      if (existingConversation) {
        return NextResponse.json(existingConversation)
      }

      // Règle de sécurité étudiant : vérifier que l'étudiant peut initier cette discussion
      if (currentUserRole === 'STUDENT') {
        const recipient = await prisma.user.findUnique({
          where: { id: recipientId },
          select: { role: true, classeId: true }
        })

        if (!recipient) {
          return NextResponse.json({ error: 'Destinataire introuvable' }, { status: 404 })
        }

        // Si le destinataire est un étudiant, il doit être dans la même classe
        if (recipient.role === 'STUDENT') {
          const currentUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { classeId: true }
          })
          if (!currentUser?.classeId || currentUser.classeId !== recipient.classeId) {
            return NextResponse.json({ error: 'Accès non autorisé : cet étudiant n\'est pas dans votre classe' }, { status: 403 })
          }
        }
      }

      // Créer la conversation 1-à-1
      const newConversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          participants: {
            connect: [
              { id: currentUserId },
              { id: recipientId }
            ]
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              classe: { select: { name: true } }
            }
          }
        }
      })

      return NextResponse.json(newConversation, { status: 201 })
    }

    // Cas 2: Conversation de Groupe
    // Seuls les enseignants et administrateurs peuvent créer des groupes
    if (currentUserRole === 'STUDENT') {
      return NextResponse.json({ error: 'Seuls les enseignants et les administrateurs peuvent créer des groupes de discussion' }, { status: 403 })
    }

    const newGroup = await prisma.conversation.create({
      data: {
        isGroup: true,
        name: name || 'Groupe sans nom',
        participants: {
          connect: [
            { id: currentUserId },
            ...participantIds.map((id: string) => ({ id }))
          ]
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            classe: { select: { name: true } }
          }
        }
      }
    })

    return NextResponse.json(newGroup, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de la création de la discussion' }, { status: 500 })
  }
}
