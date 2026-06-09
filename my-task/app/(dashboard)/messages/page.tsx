'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useConversations, useMessages, useChatUsers } from '@/hooks/use-messages'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Search, 
  Plus, 
  Users, 
  MessageSquare, 
  Check, 
  CheckCheck, 
  Loader2, 
  User, 
  ArrowLeft,
  X 
} from 'lucide-react'

// Utilitaire pour récupérer les initiales
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Couleurs d'avatars selon le rôle
function getAvatarColor(role?: string, isGroup?: boolean) {
  if (isGroup) return 'bg-teal-900/30 text-teal-400 border border-teal-500/20 light:bg-teal-100 light:text-teal-800 light:border-teal-200'
  if (role === 'ADMIN') return 'bg-red-900/30 text-red-400 border border-red-500/20 light:bg-red-100 light:text-red-800 light:border-red-200'
  if (role === 'TEACHER') return 'bg-purple-900/30 text-purple-400 border border-purple-500/20 light:bg-purple-100 light:text-purple-800 light:border-purple-200'
  return 'bg-blue-900/30 text-blue-400 border border-blue-500/20 light:bg-blue-100 light:text-blue-800 light:border-blue-200'
}

// Rôle en libellé français
function getRoleLabel(role?: string) {
  if (!role) return ''
  switch (role) {
    case 'ADMIN': return 'Admin'
    case 'TEACHER': return 'Enseignant'
    case 'STUDENT': return 'Étudiant'
    default: return role
  }
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id
  const currentUserRole = session?.user?.role

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [messageText, setMessageText] = useState('')

  // State pour la création de groupe
  const [isGroupMode, setIsGroupMode] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [contactSearchQuery, setContactSearchQuery] = useState('')

  // SWR Hooks
  const { conversations, isLoading: conversationsLoading, mutate: mutateConversations } = useConversations()
  const { messages, isLoading: messagesLoading, sendMessage } = useMessages(activeConversationId)
  const { users: chatUsers, isLoading: usersLoading } = useChatUsers()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Faire défiler vers le bas lors de la réception ou envoi de messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Formatter la date/heure
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
    } catch {
      return ''
    }
  }

  // Extraire le nom et rôle pour l'en-tête et l'affichage
  const getConversationInfo = (conv: any) => {
    if (conv.isGroup) {
      return {
        name: conv.name || 'Groupe sans nom',
        role: null,
        isGroup: true,
        participants: conv.participants
      }
    }
    const otherParticipant = conv.participants.find((p: any) => p.id !== currentUserId)
    return {
      name: otherParticipant?.name || 'Utilisateur inconnu',
      role: otherParticipant?.role || 'STUDENT',
      isGroup: false,
      participants: conv.participants
    }
  }

  // Envoyer un message
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !activeConversationId) return

    try {
      const text = messageText
      setMessageText('')
      await sendMessage(text)
      mutateConversations() // Actualise le dernier message en temps réel
    } catch (err) {
      console.error(err)
      alert("Impossible d'envoyer le message.")
    }
  }

  // Démarrer une conversation 1-à-1
  const handleStartConversation = async (recipientId: string) => {
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isGroup: false, participantIds: [recipientId] })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Erreur lors de la création')
      }

      const conv = await res.json()
      setIsNewChatOpen(false)
      setActiveConversationId(conv.id)
      mutateConversations()
    } catch (err: any) {
      alert(err.message || "Impossible de démarrer la discussion.")
    }
  }

  // Créer un groupe
  const handleCreateGroup = async (e: FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) {
      alert("Le nom du groupe est obligatoire.")
      return
    }
    if (selectedUserIds.length === 0) {
      alert("Sélectionnez au moins un participant.")
      return
    }

    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isGroup: true,
          name: groupName.trim(),
          participantIds: selectedUserIds
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Erreur lors de la création du groupe')
      }

      const conv = await res.json()
      setIsNewChatOpen(false)
      setGroupName('')
      setSelectedUserIds([])
      setIsGroupMode(false)
      setActiveConversationId(conv.id)
      mutateConversations()
    } catch (err: any) {
      alert(err.message || "Création de groupe échouée.")
    }
  }

  // Toggle la sélection des utilisateurs pour les groupes
  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  // Filtrer les conversations actives selon la recherche
  const filteredConversations = conversations.filter((conv: any) => {
    const info = getConversationInfo(conv)
    return info.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Filtrer les contacts dans le modal
  const filteredContacts = chatUsers.filter((user: any) =>
    user.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(contactSearchQuery.toLowerCase())
  )

  const activeConv = conversations.find((c: any) => c.id === activeConversationId)
  const activeConvInfo = activeConv ? getConversationInfo(activeConv) : null

  return (
    <div className="h-[calc(100vh-8.5rem)] flex bg-gray-800/40 light:bg-white rounded-2xl border border-gray-700/50 light:border-gray-200 shadow-xl overflow-hidden backdrop-blur-md">
      
      {/* 1. Panneau latéral gauche : Liste des discussions */}
      <div className={`w-full md:w-80 flex flex-col border-r border-gray-700/50 light:border-gray-200 bg-gray-800/20 light:bg-gray-50/50 h-full ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* En-tête de la sidebar */}
        <div className="p-4 border-b border-gray-700/50 light:border-gray-200 flex justify-between items-center bg-gray-800/40 light:bg-white">
          <h2 className="text-xl font-bold text-white light:text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-blue-500" size={22} />
            Messagerie
          </h2>
          <Button 
            onClick={() => {
              setIsNewChatOpen(true)
              setIsGroupMode(false)
            }}
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            title="Nouveau message"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="p-3 border-b border-gray-700/30 light:border-gray-200/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input
              type="text"
              placeholder="Rechercher une discussion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-800/50 light:bg-white border-gray-700/50 light:border-gray-300 text-sm h-9"
            />
          </div>
        </div>

        {/* Liste des discussions */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-700/20 light:divide-gray-200">
          {conversationsLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
              <Loader2 className="animate-spin text-blue-500" size={24} />
              <span className="text-xs">Chargement des discussions...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <MessageSquare size={36} className="mb-2 opacity-30 text-gray-400" />
              <p className="text-sm">Aucune discussion active.</p>
              <button 
                onClick={() => setIsNewChatOpen(true)}
                className="mt-2 text-xs text-blue-400 light:text-blue-600 hover:underline font-semibold"
              >
                Démarrer une discussion
              </button>
            </div>
          ) : (
            filteredConversations.map((conv: any) => {
              const info = getConversationInfo(conv)
              const isActive = conv.id === activeConversationId
              const lastMsg = conv.lastMessage
              const isUnread = conv.unreadCount > 0

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-blue-500/10 border-l-4 border-blue-500 light:bg-blue-50' 
                      : 'hover:bg-gray-800/25 light:hover:bg-gray-100/70 border-l-4 border-transparent'
                  }`}
                >
                  {/* Avatar de discussion */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${getAvatarColor(info.role || undefined, info.isGroup)}`}>
                    {info.isGroup ? <Users size={16} /> : getInitials(info.name)}
                  </div>

                  {/* Détails du chat */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-sm font-semibold text-white light:text-gray-900 truncate pr-2">
                        {info.name}
                      </h4>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap flex-shrink-0">
                        {lastMsg ? formatTime(lastMsg.createdAt) : formatTime(conv.updatedAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate ${isUnread ? 'text-white light:text-gray-900 font-bold' : 'text-gray-400 light:text-gray-500'}`}>
                        {lastMsg ? (
                          <>
                            {lastMsg.senderId === currentUserId ? 'Vous : ' : ''}
                            {lastMsg.content}
                          </>
                        ) : (
                          <span className="italic text-[11px] opacity-75">Aucun message</span>
                        )}
                      </p>
                      
                      {/* Badge de non-lus */}
                      {isUnread && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 2. Zone de discussion active (droite) */}
      <div className={`flex-1 flex flex-col bg-gray-800/10 light:bg-white/80 h-full ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {activeConv && activeConvInfo ? (
          <>
            {/* Barre d'en-tête de la discussion */}
            <div className="p-4 border-b border-gray-700/50 light:border-gray-200 flex justify-between items-center bg-gray-800/40 light:bg-white flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Bouton retour mobile */}
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 light:hover:bg-gray-100 rounded-lg flex-shrink-0"
                  aria-label="Retour aux discussions"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${getAvatarColor(activeConvInfo.role || undefined, activeConvInfo.isGroup)}`}>
                  {activeConvInfo.isGroup ? <Users size={16} /> : getInitials(activeConvInfo.name)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white light:text-gray-900 truncate">
                      {activeConvInfo.name}
                    </h3>
                    {!activeConvInfo.isGroup && activeConvInfo.role && (
                      <span className="flex-shrink-0">
                        {getRoleBadge(activeConvInfo.role)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 light:text-gray-500 truncate">
                    {activeConvInfo.isGroup 
                      ? `${activeConvInfo.participants.length} participants : ${activeConvInfo.participants.map((p: any) => p.name).join(', ')}`
                      : activeConvInfo.participants.find((p: any) => p.id !== currentUserId)?.email
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Zone de défilement des messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/10 light:bg-gray-50/30">
              {messagesLoading && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <Loader2 className="animate-spin text-blue-500" size={24} />
                  <span className="text-xs">Chargement des messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <MessageSquare size={40} className="mb-2 opacity-25" />
                  <p className="text-sm font-medium">Début de la discussion</p>
                  <p className="text-xs opacity-75">Envoyez un message pour commencer la conversation.</p>
                </div>
              ) : (
                messages.map((msg: any, index: number) => {
                  const isSelf = msg.senderId === currentUserId
                  const showSenderName = activeConvInfo.isGroup && !isSelf
                  
                  // Vérifier si le message précédent a été envoyé le même jour
                  const prevMsg = index > 0 ? messages[index - 1] : null
                  const isNewDay = !prevMsg || 
                    new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString()

                  return (
                    <div key={msg.id} className="space-y-3">
                      {/* Séparateur de jour */}
                      {isNewDay && (
                        <div className="flex justify-center my-4 flex-shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800/60 text-gray-400 light:bg-gray-200/80 light:text-gray-600 font-semibold uppercase tracking-wider">
                            {formatDateLabel(msg.createdAt)}
                          </span>
                        </div>
                      )}

                      <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                        {/* Nom d'expéditeur en groupe */}
                        {showSenderName && (
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-xs font-semibold text-gray-300 light:text-gray-700">
                              {msg.sender?.name}
                            </span>
                            {msg.sender?.role && (
                              <span className="scale-75 origin-left">
                                {getRoleBadge(msg.sender.role)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Bulle de message */}
                        <div className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-md flex flex-col ${
                          isSelf 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none' 
                            : 'bg-gray-800 light:bg-white border border-gray-700/50 light:border-gray-200 text-white light:text-gray-900 rounded-tl-none'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                          
                          {/* Heure et statuts de lecture */}
                          <div className={`flex items-center justify-end gap-1.5 mt-1 text-[9px] ${isSelf ? 'text-blue-100/70' : 'text-gray-400 light:text-gray-500'}`}>
                            <span>{formatTime(msg.createdAt)}</span>
                            {isSelf && (
                              msg.id.startsWith('temp-') ? (
                                <Loader2 size={10} className="animate-spin" />
                              ) : msg.read ? (
                                <span title="Lu"><CheckCheck size={12} className="text-blue-300" /></span>
                              ) : (
                                <span title="Remis"><Check size={12} /></span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Barre d'envoi du message */}
            <form 
              onSubmit={handleSendMessage} 
              className="p-3 border-t border-gray-700/50 light:border-gray-200 bg-gray-800/40 light:bg-white flex gap-2 items-center flex-shrink-0"
            >
              <Input
                type="text"
                placeholder="Écrivez votre message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 bg-gray-800/60 light:bg-gray-50 border-gray-700/50 light:border-gray-300 h-10 pr-4"
              />
              <Button 
                type="submit" 
                disabled={!messageText.trim()}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Send size={16} />
                <span className="hidden sm:inline ml-2">Envoyer</span>
              </Button>
            </form>
          </>
        ) : (
          /* Écran vide / d'accueil */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <div className="p-4 rounded-full bg-blue-900/20 text-blue-500 light:bg-blue-50 mb-4 animate-pulse">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-lg font-bold text-white light:text-gray-900 mb-1">
              Messagerie Générale
            </h3>
            <p className="text-sm text-gray-400 light:text-gray-500 max-w-sm">
              Sélectionnez une discussion à gauche, ou démarrez-en une nouvelle avec vos enseignants, camarades ou administrateurs.
            </p>
            <Button 
              onClick={() => setIsNewChatOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <Plus size={16} className="mr-2" />
              Nouveau message
            </Button>
          </div>
        )}
      </div>

      {/* 3. Modal de démarrage de discussion / création de groupe */}
      <Modal
        isOpen={isNewChatOpen}
        onClose={() => {
          setIsNewChatOpen(false)
          setIsGroupMode(false)
          setGroupName('')
          setSelectedUserIds([])
        }}
        title={isGroupMode ? "Créer un groupe de discussion" : "Nouvelle discussion"}
        size="md"
      >
        <div className="flex flex-col h-full max-h-[70vh] py-2">
          {/* Onglets si Enseignant/Admin */}
          {(currentUserRole === 'ADMIN' || currentUserRole === 'TEACHER') && (
            <div className="flex gap-2 border-b border-gray-700/50 light:border-gray-200 pb-3 mb-3">
              <button
                type="button"
                onClick={() => {
                  setIsGroupMode(false)
                  setSelectedUserIds([])
                }}
                className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                  !isGroupMode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white light:hover:text-gray-950 hover:bg-gray-700/30'
                }`}
              >
                Chat Privé
              </button>
              <button
                type="button"
                onClick={() => setIsGroupMode(true)}
                className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                  isGroupMode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white light:hover:text-gray-950 hover:bg-gray-700/30'
                }`}
              >
                Créer un Groupe
              </button>
            </div>
          )}

          {/* Mode Groupe : Saisie du nom */}
          {isGroupMode && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-300 light:text-gray-700 mb-1.5">
                Nom du groupe
              </label>
              <Input
                type="text"
                placeholder="Ex: Projet d'Études, Groupe Classe..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-gray-800/80 light:bg-white border-gray-700 light:border-gray-300"
              />
            </div>
          )}

          {/* Recherche de contacts */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <Input
                type="text"
                placeholder="Rechercher un contact par nom ou e-mail..."
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
                className="pl-8 bg-gray-800/80 light:bg-white border-gray-700 light:border-gray-300 text-xs h-9"
              />
            </div>
          </div>

          {/* Liste des contacts */}
          <div className="flex-1 overflow-y-auto max-h-[30vh] border border-gray-700/50 light:border-gray-200 rounded-xl divide-y divide-gray-700/20 light:divide-gray-200">
            {usersLoading ? (
              <div className="flex items-center justify-center p-8 text-gray-400 gap-2">
                <Loader2 className="animate-spin text-blue-500" size={18} />
                <span className="text-xs">Chargement des contacts...</span>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                Aucun contact disponible ou trouvé.
              </div>
            ) : (
              filteredContacts.map((u: any) => {
                const isSelected = selectedUserIds.includes(u.id)

                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      if (isGroupMode) {
                        toggleSelectUser(u.id)
                      } else {
                        handleStartConversation(u.id)
                      }
                    }}
                    className={`p-2.5 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-700/30 light:hover:bg-gray-100/60 ${
                      isSelected ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${getAvatarColor(u.role)}`}>
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-white light:text-gray-900 truncate">
                            {u.name}
                          </p>
                          <span>{getRoleBadge(u.role)}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 light:text-gray-500 truncate">
                          {u.email} {u.classe?.name ? `• ${u.classe.name}` : ''}
                        </p>
                      </div>
                    </div>

                    {isGroupMode && (
                      <div className={`w-4 shadow-inner h-4 rounded border flex items-center justify-center ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'border-gray-600 light:border-gray-300'
                      }`}>
                        {isSelected && <Check size={10} className="stroke-[3]" />}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Bouton de confirmation en mode Groupe */}
          {isGroupMode && (
            <div className="mt-4 pt-3 border-t border-gray-700/50 light:border-gray-200 flex justify-end gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  setIsGroupMode(false)
                  setSelectedUserIds([])
                }}
                size="sm"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedUserIds.length === 0}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Créer ({selectedUserIds.length})
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'ADMIN': 
      return <Badge variant="error" className="py-0 px-1 text-[9px] uppercase">Admin</Badge>
    case 'TEACHER': 
      return <Badge variant="warning" className="py-0 px-1 text-[9px] uppercase">Enseignant</Badge>
    case 'STUDENT': 
      return <Badge variant="default" className="py-0 px-1 text-[9px] uppercase">Élève</Badge>
    default: 
      return null
  }
}
