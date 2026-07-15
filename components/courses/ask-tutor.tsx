"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, BookOpen, MessageSquare, X } from "lucide-react"
import { askCourseQuestion } from "@/lib/data/ask"
import { ApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"

interface AskTutorProps {
  courseId: string
  courseTitle?: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  citations?: Array<{
    id: string
    type: "LESSON" | "FORUM_ANSWER"
    label: string
    similarity: number
  }>
}

export function AskTutor({ courseId, courseTitle }: AskTutorProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    setMessages((prev) => [...prev, { role: "user", content: question }])
    setInput("")
    setLoading(true)

    try {
      const result = await askCourseQuestion(courseId, question)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          citations: result.citations,
        },
      ])
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Sorry, I couldn't process that question. Please try again."
      setMessages((prev) => [...prev, { role: "assistant", content: msg }])
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-text-on-accent shadow-lg transition-all hover:bg-accent-500/90 hover:shadow-xl active:scale-95"
        aria-label="Ask AI Tutor"
      >
        <Bot className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-2xl sm:w-96">
      <div className="flex items-center justify-between border-b border-border-default bg-accent-500 px-4 py-3 text-text-on-accent">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">AI Tutor</p>
            {courseTitle && (
              <p className="truncate text-xs text-text-on-accent/70">{courseTitle}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-text-on-accent/70 transition-colors hover:bg-text-on-accent/20"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex h-80 flex-col overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <BookOpen className="mb-2 h-10 w-10 text-accent-500" />
            <p className="text-sm font-medium text-text-primary">
              Ask anything about this course
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Get answers powered by course content.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "rounded-br-md bg-accent-500 text-text-on-accent"
                      : "rounded-bl-md border border-border-default bg-surface-dark text-text-primary",
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 border-t border-border-default pt-2">
                      <p className="mb-1 flex items-center gap-1 text-xs font-medium text-text-tertiary">
                        <MessageSquare className="h-3 w-3" />
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.citations.map((c) => (
                          <span
                            key={c.id}
                            className="rounded-md bg-accent-500/10 px-2 py-0.5 text-xs text-accent-500"
                            title={`Similarity: ${(c.similarity * 100).toFixed(0)}%`}
                          >
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border-default bg-surface-dark px-3 py-2 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500 [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500 [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-border-default p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          maxLength={1000}
          disabled={loading}
          className="flex-1 rounded-lg border border-border-default bg-surface-dark px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent-500 text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-30"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
