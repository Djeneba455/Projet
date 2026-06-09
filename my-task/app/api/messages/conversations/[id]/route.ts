import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/messages/conversations/[id] - Récupère les messages d'une discussion et les marque comme lus
export const GET = auth(async function GET(
  req,
  context
) {
  try {
    const session = req.auth
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const params = await (context?.params as Promise<{ id: string }>)
    const conversationId = params?.id

    if (!conversationId) {
      return NextResponse.json({ error: 'ID de discussion manquant' }, { status: 400 })
    }

    const currentUserId = session.user.id

    // Vérifier si l'utilisateur est participant de cette conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        participants: {
          select: { id: true }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Discussion introuvable' }, { status: 404 })
    }

    const isParticipant = conversation.participants.some(p => p.id === currentUserId)
    if (!isParticipant) {
      return NextResponse.json({ error: 'Accès non autorisé à cette discussion' }, { status: 403 })
    }

    // Marquer les messages envoyés par les autres comme lus
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: currentUserId },
        read: false
      },
      data: {
        read: true
      }
    })

    // Récupérer tous les messages triés par date d'envoi
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de la récupération des messages' }, { status: 500 })
  }
})

// POST /api/messages/conversations/[id] - Envoie un message dans la discussion
export const POST = auth(async function POST(
  req,
  context
) {
  try {
    const session = req.auth
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const params = await (context?.params as Promise<{ id: string }>)
    const conversationId = params?.id

    if (!conversationId) {
      return NextResponse.json({ error: 'ID de discussion manquant' }, { status: 400 })
    }

    const currentUserId = session.user.id
    const body = await req.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Le contenu du message ne peut pas être vide' }, { status: 400 })
    }

    // Vérifier si l'utilisateur fait partie de la conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        participants: {
          select: { id: true }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Discussion introuvable' }, { status: 404 })
    }

    const isParticipant = conversation.participants.some(p => p.id === currentUserId)
    if (!isParticipant) {
      return NextResponse.json({ error: 'Accès non autorisé à cette discussion' }, { status: 403 })
    }

    // Créer le message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: currentUserId,
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    // Mettre à jour le timestamp de la conversation pour qu'elle remonte en tête de liste
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de l\'envoi du message' }, { status: 500 })
  }
})
