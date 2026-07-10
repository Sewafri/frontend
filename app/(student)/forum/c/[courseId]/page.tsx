"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Plus, ArrowLeft, Search, X } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
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
      <PageHeader
        title={`${courseTitle} Forum`}
        description="Discuss course material, ask questions, and collaborate"
      />

      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/my-learning" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to courses
          </Link>
          <button
            onClick={() => setShowNew(!showNew)}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90"
          >
            <Plus className="h-4 w-4" /> New Thread
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search threads..."
              className="w-full rounded-lg border border-border-default bg-surface-card py-2 pl-10 pr-3 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
            />
          </div>
          {searching ? (
            <button onClick={handleClearSearch} className="cursor-pointer rounded-lg border border-border-default px-3 py-2 text-xs text-text-secondary hover:text-text-primary">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSearch} className="cursor-pointer rounded-lg bg-accent-500 px-4 py-2 text-xs font-medium text-text-primary hover:bg-accent-500/90">
              Search
            </button>
          )}
        </div>

        {showNew && (
          <div className="space-y-2 rounded-xl border border-border-default bg-surface-dark p-4">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Thread title..."
              className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
            />
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim()}
                className="cursor-pointer rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading threads...</p>
      ) : threads.length === 0 ? (
        <div className="rounded-xl border border-border-default p-8 text-center">
          <p className="text-sm text-text-secondary">
            {searching ? "No threads match your search." : "No threads yet. Start a discussion!"}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border-default">
          {[...pinned, ...unpinned].map((thread) => (
            <button
              key={thread.id}
              onClick={() => router.push(`/forum/c/${courseId}/t/${thread.id}`)}
              className="flex w-full cursor-pointer items-center justify-between border-b border-border-default px-5 py-4 text-left last:border-0 hover:bg-surface-card-hover/50"
            >
              <div className="flex items-start gap-3">
                <MessageSquare className={`mt-0.5 h-5 w-5 ${thread.isPinned ? "text-accent-500" : "text-text-secondary"}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary">{thread.title}</span>
                    {thread.isPinned && <span className="rounded bg-accent-500/10 px-1.5 py-0.5 text-[10px] text-accent-500">Pinned</span>}
                    {thread.isLocked && <span className="rounded bg-accent-red/10 px-1.5 py-0.5 text-[10px] text-accent-red">Locked</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">
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
