"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Plus, ArrowLeft, Search, X } from "lucide-react"
import { getForumThreads, createForumThread, searchForumThreads } from "@/lib/data/forum"
import type { ForumThread } from "@/types/db"
import { getCourseById } from "@/lib/data/courses"

export default function ForumThreadListPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [courseTitle, setCourseTitle] = useState("Course Forum")
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")
  const [creating, setCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  const fetchThreads = useCallback(async () => {
    try {
      const t = await getForumThreads(courseId)
      setThreads(t)
    } catch { setThreads([]) }
  }, [courseId])

  useEffect(() => {
    Promise.all([
      fetchThreads(),
      getCourseById(courseId).then((c) => setCourseTitle(c.title)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [courseId, fetchThreads])

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setSearching(false)
      await fetchThreads()
      return
    }
    setSearching(true)
    try {
      const results = await searchForumThreads(searchQuery.trim(), courseId)
      setThreads(results)
    } catch { /* noop */ }
  }

  async function handleClearSearch() {
    setSearchQuery("")
    setSearching(false)
    await fetchThreads()
  }

  async function handleCreate() {
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const thread = await createForumThread(courseId, newTitle.trim(), newBody.trim())
      router.push(`/forum/c/${courseId}/t/${thread.id}`)
    } catch { setCreating(false) }
  }

  const pinned = threads.filter((t) => t.isPinned)
  const unpinned = threads.filter((t) => !t.isPinned)

  return (
    <div className="">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">{courseTitle} Forum</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Discuss course material, ask questions, and collaborate</p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/my-learning" className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
            <ArrowLeft className="h-4 w-4" /> Back to courses
          </Link>
          <button
            onClick={() => setShowNew(!showNew)}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
          >
            <Plus className="h-4 w-4" /> New Thread
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-light" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search threads..."
              className="w-full rounded-lg border border-brand-border bg-brand-card py-2 pl-10 pr-3 text-sm text-brand-text placeholder-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
            />
          </div>
          {searching ? (
            <button onClick={handleClearSearch} className="cursor-pointer rounded-lg border border-brand-border px-3 py-2 text-xs text-brand-text-mid hover:text-brand-text">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSearch} className="cursor-pointer rounded-lg bg-brand-green px-4 py-2 text-xs font-medium text-white hover:bg-brand-green-dark">
              Search
            </button>
          )}
        </div>

        {showNew && (
          <div className="space-y-2 rounded-xl border border-brand-border bg-brand-bg p-4">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Thread title..."
              className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
            />
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim()}
                className="cursor-pointer rounded-xl bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-brand-text-mid">Loading threads...</p>
      ) : threads.length === 0 ? (
        <div className="rounded-xl border border-brand-border p-8 text-center">
          <p className="text-sm text-brand-text-mid">
            {searching ? "No threads match your search." : "No threads yet. Start a discussion!"}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-brand-border">
          {[...pinned, ...unpinned].map((thread) => (
            <button
              key={thread.id}
              onClick={() => router.push(`/forum/c/${courseId}/t/${thread.id}`)}
              className="flex w-full cursor-pointer items-center justify-between border-b border-brand-border px-5 py-4 text-left last:border-0 hover:bg-brand-bg/50"
            >
              <div className="flex items-start gap-3">
                <MessageSquare className={`mt-0.5 h-5 w-5 ${thread.isPinned ? "text-brand-green" : "text-brand-text-mid"}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-brand-text">{thread.title}</span>
                    {thread.isPinned && <span className="rounded bg-brand-green-light px-1.5 py-0.5 text-[10px] text-brand-green">Pinned</span>}
                    {thread.isLocked && <span className="rounded bg-accent-red/10 px-1.5 py-0.5 text-[10px] text-accent-red">Locked</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-brand-text-mid">
                    {thread.author?.fullName ?? "Unknown"} &middot; {(thread as ForumThreadWithCount)._count?.posts ?? 0} replies
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface ForumThreadWithCount extends ForumThread {
  _count: { posts: number }
}
