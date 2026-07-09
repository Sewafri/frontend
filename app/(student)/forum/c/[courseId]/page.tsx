"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Plus, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { getForumThreads, createForumThread } from "@/lib/data/forum";
import type { ForumThread } from "@/types/db";
import { getCourseById } from "@/lib/data/courses";

export default function ForumThreadListPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [courseTitle, setCourseTitle] = useState("Course Forum");
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      getForumThreads(courseId).catch(() => []),
      getCourseById(courseId)
        .then((c) => setCourseTitle(c.title))
        .catch(() => {}),
    ])
      .then(([t]) => setThreads(t))
      .finally(() => setLoading(false));
  }, [courseId]);

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const thread = await createForumThread(courseId, newTitle.trim());
      router.push(`/forum/c/${courseId}/t/${thread.id}`);
    } catch {
      setCreating(false);
    }
  }

  return (
    <div className="">
      <PageHeader
        title={`${courseTitle} Forum`}
        description="Discuss course material, ask questions, and collaborate"
      />

      <div className="mb-6 flex items-center justify-between">
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

      {showNew && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-default bg-surface-dark p-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Thread title..."
            className="flex-1 rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newTitle.trim()}
            className="cursor-pointer rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-text-secondary">Loading threads...</p>
      ) : threads.length === 0 ? (
        <div className="rounded-xl border border-border-default p-8 text-center">
          <p className="text-sm text-text-secondary">No threads yet. Start a discussion!</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border-default">
          {threads.map((thread) => (
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
  );
}

interface ForumThreadWithCount extends ForumThread {
  _count: { posts: number }
}
