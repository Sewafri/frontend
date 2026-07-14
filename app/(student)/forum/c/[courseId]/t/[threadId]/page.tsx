"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, Check, Pencil, Trash2, Flag, Pin, Lock } from "lucide-react"
import { getForumThread, createForumPost, toggleUpvotePost, acceptPostAnswer, editForumPost, deleteForumPost, togglePinThread, toggleLockThread } from "@/lib/data/forum"
import { fileReport } from "@/lib/data/reports"
import { useAuth } from "@/lib/auth/auth-context"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import type { ForumThread, ForumPost } from "@/types/db"

export default function ForumThreadDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const courseId = params.courseId as string
  const threadId = params.threadId as string
  const [thread, setThread] = useState<(ForumThread & { posts: ForumPost[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyBody, setReplyBody] = useState("")
  const [posting, setPosting] = useState(false)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState("")
  const [reportingPostId, setReportingPostId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchThread = useCallback(async () => {
    try {
      const data = await getForumThread(threadId)
      if (data?.thread) setThread(data.thread)
    } catch { /* noop */ }
  }, [threadId])

  useEffect(() => {
    if (threadId) {
      setLoading(true)
      fetchThread().finally(() => setLoading(false))
    }
  }, [threadId, fetchThread])

  async function handlePostReply() {
    if (!replyBody.trim()) return
    setPosting(true)
    try {
      await createForumPost(threadId, replyBody.trim())
      setReplyBody("")
      await fetchThread()
    } catch { /* noop */ }
    finally { setPosting(false) }
  }

  async function handleUpvote(postId: string) {
    try {
      await toggleUpvotePost(postId)
      await fetchThread()
    } catch { /* noop */ }
  }

  async function handleAccept(postId: string) {
    try {
      await acceptPostAnswer(postId)
      await fetchThread()
    } catch { /* noop */ }
  }

  async function handleEdit(postId: string) {
    if (!editBody.trim()) return
    try {
      await editForumPost(postId, editBody.trim())
      setEditingPostId(null)
      await fetchThread()
    } catch { /* noop */ }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteForumPost(deleteTarget)
      setDeleteTarget(null)
      await fetchThread()
    } catch { setDeleteTarget(null) }
    finally { setDeleting(false) }
  }

  async function handleReport() {
    if (!reportingPostId || !reportReason.trim()) return
    try {
      await fileReport("FORUM_POST", reportingPostId, reportReason.trim())
      setReportingPostId(null)
      setReportReason("")
    } catch { /* noop */ }
  }

  async function handleTogglePin() {
    try {
      await togglePinThread(threadId)
      await fetchThread()
    } catch { /* noop */ }
  }

  async function handleToggleLock() {
    try {
      await toggleLockThread(threadId)
      await fetchThread()
    } catch { /* noop */ }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-brand-text-mid">Loading thread...</p>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-brand-text">Thread not found</p>
        <Link href={`/forum/c/${courseId}`} className="mt-2 text-sm text-brand-green hover:underline">Back to threads</Link>
      </div>
    )
  }

  const isInstructorOrAdmin = user?.role === "INSTRUCTOR" || user?.role === "ADMIN"

  return (
    <div className="">
      <div className="mb-6">
        <Link href={`/forum/c/${courseId}`} className="mb-4 flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> Back to threads
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-brand-text">{thread.title}</h1>
          {thread.isPinned && <span className="rounded bg-brand-green-light px-2 py-0.5 text-xs text-brand-green">Pinned</span>}
          {thread.isLocked && <span className="rounded bg-accent-red/10 px-2 py-0.5 text-xs text-accent-red">Locked</span>}
        </div>
        <p className="mt-1 text-sm text-brand-text-mid">
          Started by {thread.author?.fullName ?? "Unknown"}
        </p>
        {isInstructorOrAdmin && (
          <div className="mt-2 flex items-center gap-2">
            <button onClick={handleTogglePin} className="cursor-pointer text-xs text-brand-text-light hover:text-brand-green">
              <Pin className="mr-1 inline h-3 w-3" />{thread.isPinned ? "Unpin" : "Pin"}
            </button>
            <button onClick={handleToggleLock} className="cursor-pointer text-xs text-brand-text-light hover:text-accent-red">
              <Lock className="mr-1 inline h-3 w-3" />{thread.isLocked ? "Unlock" : "Lock"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {thread.posts.map((post) => (
          <div key={post.id} className={`rounded-xl border p-5 ${post.isAcceptedAnswer ? "border-brand-green/30 bg-brand-green/[0.02]" : "border-brand-border bg-brand-bg"}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-xs font-medium text-brand-green">
                  {(post.author?.fullName ?? "U").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-brand-text">{post.author?.fullName ?? "Unknown"}</span>
                    {post.isAcceptedAnswer && <Check className="h-3.5 w-3.5 text-brand-green" />}
                  </div>
                  <span className="text-xs text-brand-text-mid">
                    {new Date(post.createdAt).toLocaleDateString()}
                    {post.editedAt && " (edited)"}
                  </span>
                </div>
              </div>
            </div>

            {editingPostId === post.id ? (
              <div className="space-y-2">
                <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} className="min-h-[80px] w-full rounded-lg border border-brand-border bg-brand-card p-3 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(post.id)} className="cursor-pointer rounded-lg bg-brand-green px-3 py-1.5 text-xs text-white">Save</button>
                  <button onClick={() => setEditingPostId(null)} className="cursor-pointer rounded-lg border border-brand-border px-3 py-1.5 text-xs text-brand-text-mid">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-brand-text-mid">{post.body}</p>
            )}

            <div className="mt-3 flex items-center gap-4">
              <button onClick={() => handleUpvote(post.id)} className="flex cursor-pointer items-center gap-1 text-xs text-brand-text-mid hover:text-brand-green">
                <ThumbsUp className="h-3.5 w-3.5" /> {(post as ForumPostWithCount)._count?.upvotes ?? 0}
              </button>

              {user?.id === post.authorId && !post.isAcceptedAnswer && (
                <>
                  <button onClick={() => { setEditingPostId(post.id); setEditBody(post.body) }} className="flex cursor-pointer items-center gap-1 text-xs text-brand-text-mid hover:text-brand-text">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(post.id)} className="flex cursor-pointer items-center gap-1 text-xs text-brand-text-mid hover:text-accent-red">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </>
              )}

              {isInstructorOrAdmin && post.threadId === threadId && !post.isAcceptedAnswer && thread.posts[0]?.id !== post.id && (
                <button onClick={() => handleAccept(post.id)} className="flex cursor-pointer items-center gap-1 text-xs text-brand-green hover:text-brand-green/80">
                  <Check className="h-3 w-3" /> Accept as answer
                </button>
              )}

              <button onClick={() => { setReportingPostId(post.id); setReportReason("") }} className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-brand-text-light hover:text-brand-amber">
                <Flag className="h-3 w-3" /> Report
              </button>
            </div>

            {reportingPostId === post.id && (
              <div className="mt-3 space-y-2 rounded-lg border border-brand-amber/20 bg-brand-amber/5 p-3">
                <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Why are you reporting this post?" className="min-h-[60px] w-full rounded-lg border border-brand-border bg-brand-card p-2 text-xs text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
                <div className="flex gap-2">
                  <button onClick={handleReport} disabled={!reportReason.trim()} className="cursor-pointer rounded-lg bg-brand-amber px-3 py-1.5 text-xs text-white disabled:opacity-50">Submit Report</button>
                  <button onClick={() => setReportingPostId(null)} className="cursor-pointer rounded-lg border border-brand-border px-3 py-1.5 text-xs text-brand-text-mid">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!thread.isLocked && (
        <div className="mt-6 rounded-xl border border-brand-border bg-brand-bg p-5">
          <h3 className="mb-3 text-sm font-medium text-brand-text">Post a Reply</h3>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-[100px] w-full rounded-lg border border-brand-border bg-brand-card p-3 text-sm text-brand-text placeholder-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
          />
          <button
            onClick={handlePostReply}
            disabled={posting || !replyBody.trim()}
            className="mt-3 cursor-pointer rounded-xl bg-brand-green px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}

interface ForumPostWithCount extends ForumPost {
  _count: { upvotes: number }
}
