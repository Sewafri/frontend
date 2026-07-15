"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Loader2, Send, ArrowLeft, MessageSquare, UserPlus, School } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getConversations,
  getConversationMessages,
  createConversation,
  sendMessage,
  type Conversation,
  type Message,
  type ConversationParticipant,
} from "@/lib/data/messaging"
import { ApiError } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"

function getOtherParticipant(
  participants: ConversationParticipant[],
  currentUserId: string,
): ConversationParticipant | undefined {
  return participants.find((p) => p.userId !== currentUserId)
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "now"
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString()
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function InstructorMessagesPage() {
  const { user } = useAuth()
  const currentUserId = user?.id ?? ""

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [showNewConv, setShowNewConv] = useState(false)
  const [newConvId, setNewConvId] = useState("")
  const [creatingConv, setCreatingConv] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  async function loadConversations() {
    setLoading(true)
    try {
      const result = await getConversations()
      setConversations(result.conversations)
    } catch {
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  async function openConversation(convId: string) {
    setActiveConvId(convId)
    setMessagesLoading(true)
    try {
      const result = await getConversationMessages(convId)
      setMessages(result.messages)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, unreadCount: 0 } : c,
        ),
      )
    } catch {
      setMessages([])
    } finally {
      setMessagesLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const body = input.trim()
    if (!body || !activeConvId || sending) return

    setSending(true)
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      body,
      isRead: false,
      sentAt: new Date().toISOString(),
      conversationId: activeConvId,
      senderId: currentUserId,
    }
    setMessages((prev) => [...prev, optimisticMsg])
    setInput("")

    try {
      const result = await sendMessage(activeConvId, body)
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? result.message : m)),
      )
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessageAt: result.message.sentAt }
            : c,
        ),
      )
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id))
    } finally {
      setSending(false)
    }
  }

  async function handleCreateConversation(e: React.FormEvent) {
    e.preventDefault()
    if (!newConvId.trim() || creatingConv) return
    setCreatingConv(true)
    try {
      const result = await createConversation(newConvId.trim())
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === result.conversation.id)
        return exists ? prev : [result.conversation, ...prev]
      })
      setShowNewConv(false)
      setNewConvId("")
      openConversation(result.conversation.id)
    } catch {
      // silently fail
    } finally {
      setCreatingConv(false)
    }
  }

  const activeConversation = conversations.find((c) => c.id === activeConvId)
  const otherParticipant = activeConversation
    ? getOtherParticipant(activeConversation.participants, currentUserId)
    : null

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-brand-text-mid">
          {totalUnread > 0
            ? `You have ${totalUnread} unread message${totalUnread !== 1 ? "s" : ""}`
            : "Conversations with your students"}
        </p>
      </div>

      <div className="flex h-[70vh] overflow-hidden rounded-xl border border-brand-border bg-brand-bg">
        {/* Left pane — Conversation list */}
        <div
          className={cn(
            "flex w-full flex-col border-r border-brand-border sm:w-80",
            activeConvId && "hidden sm:flex",
          )}
        >
          <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
            <span className="text-sm font-semibold text-brand-text">Inbox</span>
            <button
              onClick={() => setShowNewConv(!showNewConv)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-brand-text-light transition-colors hover:bg-brand-bg hover:text-brand-text"
              title="New conversation"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          </div>

          {showNewConv && (
            <form
              onSubmit={handleCreateConversation}
              className="border-b border-brand-border p-3"
            >
              <label className="mb-1 block text-xs font-medium text-brand-text-mid">
                Enter Student ID to message
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newConvId}
                  onChange={(e) => setNewConvId(e.target.value)}
                  placeholder="User ID..."
                  className="flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-1.5 text-xs text-brand-text placeholder-text-brand-text-light focus:border-brand-green focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newConvId.trim() || creatingConv}
                  className="cursor-pointer rounded-lg bg-brand-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
                >
                  {creatingConv ? "..." : "Start"}
                </button>
              </div>
            </form>
          )}

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-brand-green" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="mb-2 h-8 w-8 text-brand-text-light" />
                <p className="text-sm text-brand-text-mid">No conversations yet</p>
                <p className="mt-1 text-xs text-brand-text-light">
                  When students reach out, their messages will appear here
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv.participants, currentUserId)
                const lastMsg = conv.messages[0]
                return (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 border-b border-brand-border px-4 py-3 text-left transition-colors hover:bg-brand-bg",
                      activeConvId === conv.id && "bg-brand-green-light/40",
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-sm font-semibold text-brand-green">
                      {other?.user.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-brand-text">
                          {other?.user.fullName ?? "Unknown"}
                        </span>
                        {lastMsg && (
                          <span className="shrink-0 text-[10px] text-brand-text-light">
                            {formatTime(lastMsg.sentAt)}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="truncate text-xs text-brand-text-mid">
                          {lastMsg?.body ?? "No messages yet"}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-brand-green px-1 text-[10px] font-semibold text-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right pane — Message thread */}
        <div
          className={cn(
            "flex flex-1 flex-col",
            !activeConvId && "hidden sm:flex",
          )}
        >
          {!activeConvId ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare className="mb-3 h-12 w-12 text-brand-text-light" />
              <p className="text-sm text-brand-text-mid">Select a conversation</p>
              <p className="text-xs text-brand-text-light">
                Choose a conversation from the left to start messaging
              </p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 border-b border-brand-border px-4 py-3">
                <button
                  onClick={() => setActiveConvId(null)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-brand-text-light transition-colors hover:bg-brand-bg hover:text-brand-text sm:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-sm font-semibold text-brand-green">
                  {otherParticipant?.user.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-text">
                    {otherParticipant?.user.fullName ?? "Unknown"}
                  </p>
                  <p className="text-xs text-brand-text-light">Student</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-brand-green" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-brand-text-mid">No messages yet</p>
                    <p className="mt-1 text-xs text-brand-text-light">
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((msg) => {
                      const isMe = msg.senderId === currentUserId
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            isMe ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                              isMe
                                ? "rounded-br-md bg-brand-green text-white"
                                : "rounded-bl-md border border-brand-border bg-brand-card text-brand-text",
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words leading-relaxed">
                              {msg.body}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-right text-[10px]",
                                isMe ? "text-white/60" : "text-brand-text-light",
                              )}
                            >
                              {formatMessageTime(msg.sentAt)}
                              {isMe && (
                                <span className="ml-1">
                                  {msg.isRead ? "✓✓" : "✓"}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-brand-border p-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={5000}
                  disabled={sending}
                  className="flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-text-brand-text-light focus:border-brand-green focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-brand-green text-white transition-colors hover:bg-brand-green-dark disabled:opacity-30"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
