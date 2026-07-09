"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, MessageSquare } from "lucide-react";
import { getForumThread, createForumPost } from "@/lib/data/forum";
import type { ForumThread, ForumPost } from "@/types/db";

export default function ForumThreadDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const threadId = params.threadId as string;
  const [thread, setThread] = useState<
    (ForumThread & { posts: ForumPost[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!threadId) return;
    getForumThread(threadId)
      .then((data) => {
        if (data?.thread) setThread(data.thread);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [threadId]);

  async function handlePostReply() {
    if (!replyBody.trim()) return;
    setPosting(true);
    try {
      await createForumPost(threadId, replyBody.trim());
      setReplyBody("");
      const data = await getForumThread(threadId);
      if (data?.thread) setThread(data.thread);
    } catch {
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-text-secondary">Loading thread...</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-text-primary">Thread not found</p>
        <Link href={`/forum/c/${courseId}`} className="mt-2 text-sm text-accent-500 hover:underline">Back to threads</Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6">
        <Link
          href={`/forum/c/${courseId}`}
          className="mb-4 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to threads
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">{thread.title}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Started by {thread.author?.fullName ?? "Unknown"}
        </p>
      </div>

      <div className="space-y-4">
        {thread.posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-border-default bg-surface-dark p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500/10 text-xs font-medium text-accent-500">
                  {(post.author?.fullName ?? "U").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <span className="text-sm font-medium text-text-primary">{post.author?.fullName ?? "Unknown"}</span>
                  <span className="ml-2 text-xs text-text-secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">{post.body}</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <ThumbsUp className="h-3.5 w-3.5" /> {(post as ForumPostWithUpvotes)._count?.upvotes ?? 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!thread.isLocked && (
        <div className="mt-6 rounded-xl border border-border-default bg-surface-dark p-5">
          <h3 className="mb-3 text-sm font-medium text-text-primary">Post a Reply</h3>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-[100px] w-full rounded-lg border border-border-default bg-surface-card p-3 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20"
          />
          <button
            onClick={handlePostReply}
            disabled={posting || !replyBody.trim()}
            className="mt-3 cursor-pointer rounded-xl bg-accent-500 px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      )}
    </div>
  );
}

interface ForumPostWithUpvotes extends ForumPost {
  _count: { upvotes: number }
}
