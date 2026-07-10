import { api, apiMutate } from "@/lib/api/client"

export interface ConversationParticipant {
  conversationId: string
  userId: string
  joinedAt: string
  user: { id: string; fullName: string; photoUrl?: string | null }
}

export interface Message {
  id: string
  body: string
  isRead: boolean
  sentAt: string
  conversationId: string
  senderId: string
  sender?: { id: string; fullName: string; photoUrl?: string | null }
}

export interface Conversation {
  id: string
  createdAt: string
  lastMessageAt: string
  participants: ConversationParticipant[]
  messages: Message[]
  unreadCount: number
}

export async function getConversations(): Promise<{ conversations: Conversation[] }> {
  return api<{ conversations: Conversation[] }>("/messages/conversations")
}

export async function getConversationMessages(
  conversationId: string,
): Promise<{ messages: Message[] }> {
  return api<{ messages: Message[] }>(`/messages/conversations/${conversationId}/messages`)
}

export async function createConversation(
  participantId: string,
): Promise<{ conversation: Conversation }> {
  return apiMutate<{ conversation: Conversation }>(
    "/messages/conversations",
    { method: "POST", body: JSON.stringify({ participantId }) },
    "Conversation started",
  )
}

export async function sendMessage(
  conversationId: string,
  body: string,
): Promise<{ message: Message }> {
  return apiMutate<{ message: Message }>(
    `/messages/conversations/${conversationId}/messages`,
    { method: "POST", body: JSON.stringify({ body }) },
  )
}
