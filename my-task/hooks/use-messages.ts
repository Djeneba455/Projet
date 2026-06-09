import useSWR from 'swr'
import { useSession } from 'next-auth/react'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Une erreur est survenue lors de la récupération des données.')
  }
  return res.json()
}

// Hook pour obtenir toutes les conversations actives
export function useConversations() {
  const { data: session } = useSession()
  
  const { data, error, mutate } = useSWR(
    session?.user ? '/api/messages/conversations' : null,
    fetcher,
    {
      refreshInterval: 5000, // Rafraîchir la liste toutes les 5 secondes
      revalidateOnFocus: true,
    }
  )

  return {
    conversations: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// Hook pour obtenir les messages d'une conversation active et envoyer de nouveaux messages
export function useMessages(conversationId: string | null) {
  const { data: session } = useSession()

  const { data, error, mutate } = useSWR(
    session?.user && conversationId ? `/api/messages/conversations/${conversationId}` : null,
    fetcher,
    {
      refreshInterval: 3000, // Rafraîchir les messages toutes les 3 secondes pour un effet de chat
      revalidateOnFocus: true,
    }
  )

  const sendMessage = async (content: string) => {
    if (!conversationId || !session?.user) return null

    const text = content.trim()
    if (!text) return null

    const tempId = `temp-${Date.now()}`
    const optimisticMessage = {
      id: tempId,
      content: text,
      createdAt: new Date().toISOString(),
      senderId: session.user.id,
      sender: {
        id: session.user.id,
        name: session.user.name || 'Moi',
        role: session.user.role,
      },
      conversationId,
      read: false,
    }

    // Mise à jour optimiste locale (sans déclencher de revalidation réseau immédiate)
    const previousMessages = data || []
    mutate([...previousMessages, optimisticMessage], false)

    try {
      const res = await fetch(`/api/messages/conversations/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message')
      }

      const savedMessage = await res.json()
      
      // Mettre à jour avec le vrai message de la base de données
      mutate()
      return savedMessage
    } catch (err) {
      console.error('Send message error:', err)
      // Restaurer les messages précédents en cas d'erreur
      mutate(previousMessages)
      throw err
    }
  }

  return {
    messages: data || [],
    isLoading: !error && !data,
    isError: error,
    sendMessage,
    mutate,
  }
}

// Hook pour obtenir la liste des utilisateurs avec qui on peut démarrer un chat
export function useChatUsers() {
  const { data: session } = useSession()
  
  const { data, error } = useSWR(
    session?.user ? '/api/messages/users' : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  )

  return {
    users: data || [],
    isLoading: !error && !data,
    isError: error,
  }
}
