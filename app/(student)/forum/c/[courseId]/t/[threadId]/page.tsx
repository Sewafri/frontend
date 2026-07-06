"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, MessageSquare } from "lucide-react";

const THREAD_DATA: Record<string, { title: string; author: string; posts: { id: string; author: string; role: string; content: string; timestamp: string; likes: number }[] }> = {
  "t1": {
    title: "Welcome to Web Development 101!",
    author: "Dr. Sarah Wilson",
    posts: [
      {
        id: "p1",
        author: "Dr. Sarah Wilson",
        role: "Instructor",
        content: "Welcome everyone! This forum is for discussing course material, asking questions, and helping each other learn. Please introduce yourselves!",
        timestamp: "2 days ago",
        likes: 15,
      },
      {
        id: "p2",
        author: "Alex J.",
        role: "Student",
        content: "Hi everyone! Excited to start this course. I've done some HTML before but looking forward to diving deeper.",
        timestamp: "1 day ago",
        likes: 3,
      },
      {
        id: "p3",
        author: "Maria G.",
        role: "Student",
        content: "Hello! Quick question — are there any prerequisites for the JavaScript module?",
        timestamp: "12 hours ago",
        likes: 1,
      },
    ],
  },
  default: {
    title: "Thread",
    author: "Unknown",
    posts: [
      { id: "p1", author: "User", role: "Student", content: "No content yet.", timestamp: "N/A", likes: 0 },
    ],
  },
};

export default function ForumThreadDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const threadId = params.threadId as string;
  const thread = THREAD_DATA[threadId] ?? THREAD_DATA.default;

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
        <p className="mt-1 text-sm text-text-secondary">Started by {thread.author}</p>
      </div>

      <div className="space-y-4">
        {thread.posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-border-glass bg-surface-dark p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-medium text-brand-orange">
                  {post.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{post.author}</span>
                    <span className="rounded bg-surface-card px-1.5 py-0.5 text-[10px] text-text-secondary">
                      {post.role}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">{post.timestamp}</span>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">{post.content}</p>
            <div className="mt-3 flex items-center gap-4">
              <button className="flex cursor-pointer items-center gap-1 text-xs text-text-secondary hover:text-brand-orange">
                <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
              </button>
              <button className="flex cursor-pointer items-center gap-1 text-xs text-text-secondary hover:text-brand-orange">
                <MessageSquare className="h-3.5 w-3.5" /> Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border-glass bg-surface-dark p-5">
        <h3 className="mb-3 text-sm font-medium text-text-primary">Post a Reply</h3>
        <textarea
          placeholder="Write your reply..."
          className="min-h-[100px] w-full rounded-lg border border-border-glass bg-surface-card p-3 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20"
        />
        <button className="mt-3 cursor-pointer rounded-xl bg-brand-orange px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-brand-orange/90">
          Post Reply
        </button>
      </div>
    </div>
  );
}
